// app/api/search/route.ts — semantic search over meeting content
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { semanticSearch } from '@/lib/ai/embed'
import { searchMeetings } from '@/lib/ai/analyze'

export async function POST(req: NextRequest) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { query } = await req.json()
  if (!query || query.trim().length < 3) {
    return NextResponse.json({ error: 'Query too short' }, { status: 400 })
  }

  // Check plan — search is pro+
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  if (profile?.plan === 'free') {
    return NextResponse.json({ error: 'Upgrade to Pro to use AI search', upgrade_required: true }, { status: 403 })
  }

  try {
    // Vector search for relevant chunks
    const chunks = await semanticSearch(query, user.id, 6)

    // Use Claude to synthesize an answer from the chunks
    const contextChunks = chunks.map(c => ({
      meeting_id: c.meeting_id,
      chunk_text: c.chunk_text,
      title: (c.meeting as any).title,
      date: new Date((c.meeting as any).created_at).toLocaleDateString(),
    }))

    const answer = await searchMeetings(query, contextChunks)

    return NextResponse.json({ answer, sources: chunks })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    if (msg.includes('configured') || msg.includes('API key') || msg.includes('missing')) {
      return NextResponse.json({ error: 'ai_search_not_configured' }, { status: 400 })
    }
    console.error('[search-api] Error during search:', msg)
    return NextResponse.json({ error: 'Search failed. Please try again later.' }, { status: 500 })
  }
}
