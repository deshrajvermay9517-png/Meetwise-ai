// lib/ai/embed.ts — pgvector embeddings for semantic search
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'

let openai: OpenAI | null = null

function getOpenAI() {
  if (openai) return openai
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey || apiKey === 'sk-...' || apiKey.trim() === '') {
    throw new Error('AI embedding is not configured yet. Add your OpenAI API key in Settings or .env.local to enable semantic search.')
  }
  openai = new OpenAI({ apiKey })
  return openai
}

const CHUNK_SIZE = 500      // characters per chunk
const CHUNK_OVERLAP = 100

export function chunkText(text: string): string[] {
  const chunks: string[] = []
  let start = 0

  while (start < text.length) {
    const end = Math.min(start + CHUNK_SIZE, text.length)
    const chunk = text.slice(start, end).trim()
    if (chunk.length > 50) chunks.push(chunk)
    start += CHUNK_SIZE - CHUNK_OVERLAP
  }

  return chunks
}

export async function embedText(text: string): Promise<number[]> {
  const client = getOpenAI()
  const response = await client.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  })
  return response.data[0].embedding
}

export async function storeMeetingEmbeddings(
  meetingId: string,
  fullText: string
): Promise<void> {
  const supabase = createClient()
  const chunks = chunkText(fullText)

  // Embed in batches of 10 to avoid OpenAI rate limits
  const BATCH_SIZE = 10
  const embeddings: number[][] = []

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE)
    const batchEmbeddings = await Promise.all(batch.map(chunk => embedText(chunk)))
    embeddings.push(...batchEmbeddings)
  }

  const rows = chunks.map((chunk, i) => ({
    meeting_id: meetingId,
    chunk_text: chunk,
    chunk_index: i,
    embedding: embeddings[i],   // pass raw number[] — Supabase client serialises for pgvector
  }))

  const { error } = await supabase
    .from('meeting_embeddings')
    .insert(rows)

  if (error) throw new Error(`Failed to store embeddings: ${error.message}`)
}

export async function semanticSearch(
  query: string,
  userId: string,
  limit = 5
): Promise<Array<{
  meeting_id: string
  chunk_text: string
  similarity: number
  meeting: { id: string; title: string; created_at: string }
}>> {
  const supabase = createClient()
  const queryEmbedding = await embedText(query)

  // pgvector cosine similarity search — requires RPC function (see below)
  const { data, error } = await supabase.rpc('search_meetings', {
    query_embedding: queryEmbedding,
    user_id_filter: userId,
    match_count: limit,
    match_threshold: 0.5,
  })

  if (error) throw new Error(`Search failed: ${error.message}`)
  return data ?? []
}

// search_meetings RPC is defined in supabase/migrations/001_init.sql
