// lib/ai/analyze.ts — Claude analysis pipeline
import Anthropic from '@anthropic-ai/sdk'
import { AnalysisResult, TranscriptSegment } from '@/lib/types'

let claude: Anthropic | null = null

function getAnthropic() {
  if (claude) return claude
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey || apiKey === 'sk-ant-...' || apiKey.trim() === '') {
    throw new Error('AI analysis is not configured yet. Add your Anthropic API key in Settings or .env.local to enable summaries and search.')
  }
  claude = new Anthropic({ apiKey })
  return claude
}

const SYSTEM_PROMPT = `You are an expert meeting analyst. Given a meeting transcript, you extract structured insights with precision. Always respond with valid JSON matching the schema provided. Be concise but thorough. For sentiment, -1 is very negative, 0 is neutral, 1 is very positive.`

export async function analyzeMeeting(
  fullText: string,
  segments: TranscriptSegment[],
  title: string
): Promise<AnalysisResult> {
  // Build a speaker-attributed transcript for better analysis
  const speakerText = segments.length > 0
    ? segments.map(s => `[${s.speaker}] ${s.text}`).join('\n')
    : fullText

  const prompt = `
Meeting title: "${title}"
Meeting transcript:
---
${speakerText}
---

Analyze this meeting and return a JSON object with EXACTLY this structure:
{
  "tldr": "1-2 sentence summary of the meeting's main purpose and outcome",
  "body": "Clear 200-300 word summary covering what was discussed, key points raised, and conclusions reached",
  "key_decisions": ["Decision 1", "Decision 2"],
  "topics": ["Topic 1", "Topic 2", "Topic 3"],
  "sentiment_score": 0.0,
  "sentiment_label": "positive|neutral|negative",
  "speaker_sentiment": {
    "Speaker A": { "score": 0.0, "label": "positive|neutral|negative" }
  },
  "action_items": [
    {
      "text": "Clear description of the action",
      "owner": "Person name or null",
      "due_date": "YYYY-MM-DD or null",
      "priority": "high|medium|low"
    }
  ]
}

Rules:
- key_decisions: things explicitly decided, not just discussed (max 5)
- topics: main themes/subjects covered (max 6, short labels)
- Extract ALL action items, even implicit ones
- For due_date: infer from phrases like "by Friday", "next week", "end of month" relative to today (${new Date().toISOString().split('T')[0]})
- priority: high = urgent/blocking, medium = normal, low = nice-to-have
- Return ONLY the JSON object, no markdown, no explanation`

  const client = getAnthropic()
  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: prompt }],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text : ''

  try {
    const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim()
    const result = JSON.parse(cleaned) as AnalysisResult
    return result
  } catch {
    throw new Error(`Failed to parse Claude response: ${raw.slice(0, 200)}`)
  }
}

// Semantic search over meeting content using Claude
export async function searchMeetings(
  query: string,
  contextChunks: Array<{ meeting_id: string; chunk_text: string; title: string; date: string }>
): Promise<string> {
  if (contextChunks.length === 0) {
    return "I couldn't find any relevant meeting content for your query."
  }

  const context = contextChunks
    .map((c, i) => `[${i + 1}] From "${c.title}" (${c.date}):\n${c.chunk_text}`)
    .join('\n\n')

  const client = getAnthropic()
  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 800,
    system: 'You are a helpful assistant that answers questions about meeting content. Be concise and cite which meeting the information comes from.',
    messages: [{
      role: 'user',
      content: `Based on these meeting excerpts, answer: "${query}"\n\nMeeting excerpts:\n${context}`
    }],
  })

  return message.content[0].type === 'text' ? message.content[0].text : ''
}
