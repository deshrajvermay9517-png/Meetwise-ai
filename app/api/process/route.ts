// app/api/process/route.ts — AI pipeline endpoint
// Called after audio upload. Runs: transcribe → analyze → embed → store
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { transcribeAudio } from '@/lib/ai/transcribe'
import { analyzeMeeting } from '@/lib/ai/analyze'
import { storeMeetingEmbeddings } from '@/lib/ai/embed'
import { sendMeetingReadyEmail } from '@/lib/email'

export const maxDuration = 300  // 5 min Vercel function timeout

export async function POST(req: NextRequest) {
  const supabase = createClient()

  // Verify auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { meeting_id } = await req.json()
  if (!meeting_id) return NextResponse.json({ error: 'meeting_id required' }, { status: 400 })

  // Fetch meeting
  const { data: meeting } = await supabase
    .from('meetings')
    .select('*')
    .eq('id', meeting_id)
    .eq('user_id', user.id)
    .single()

  if (!meeting) return NextResponse.json({ error: 'Meeting not found' }, { status: 404 })
  if (!meeting.audio_url) return NextResponse.json({ error: 'No audio file' }, { status: 400 })

  try {
    // ── Step 1: Transcribing ────────────────────────────────────────────────
    await supabase
      .from('meetings')
      .update({ status: 'transcribing' })
      .eq('id', meeting_id)

    const { data: audioData, error: downloadError } = await supabase.storage
      .from('audio')
      .download(meeting.audio_url)

    if (downloadError) throw new Error(`Audio download failed: ${downloadError.message}`)

    const buffer = Buffer.from(await audioData.arrayBuffer())
    const filename = meeting.audio_url.split('/').pop() ?? 'audio.mp3'

    const { full_text, segments, duration_secs } = await transcribeAudio(
      buffer,
      filename,
      meeting.language
    )

    // Store transcript
    await supabase.from('transcripts').upsert({
      meeting_id,
      full_text,
      segments,
    })

    await supabase
      .from('meetings')
      .update({
        status: 'analyzing',
        duration_secs,
        participants: [...new Set(segments.map(s => s.speaker))],
      })
      .eq('id', meeting_id)

    // ── Step 2: AI Analysis ─────────────────────────────────────────────────
    const analysis = await analyzeMeeting(full_text, segments, meeting.title)

    // Store summary
    await supabase.from('summaries').upsert({
      meeting_id,
      tldr: analysis.tldr,
      body: analysis.body,
      key_decisions: analysis.key_decisions,
      topics: analysis.topics,
      sentiment_score: analysis.sentiment_score,
      sentiment_label: analysis.sentiment_label,
      speaker_sentiment: analysis.speaker_sentiment,
    })

    // Store action items — delete first to avoid duplicates on retry
    await supabase.from('action_items').delete().eq('meeting_id', meeting_id)

    if (analysis.action_items.length > 0) {
      await supabase.from('action_items').insert(
        analysis.action_items.map(item => ({
          meeting_id,
          user_id: user.id,
          text: item.text,
          owner: item.owner,
          due_date: item.due_date,
          priority: item.priority,
        }))
      )
    }

    // ── Step 3: Embeddings for search ────────────────────────────────────────
    await storeMeetingEmbeddings(meeting_id, full_text)

    // ── Done ─────────────────────────────────────────────────────────────────
    await supabase
      .from('meetings')
      .update({ status: 'done' })
      .eq('id', meeting_id)

    // Increment usage counter
    await supabase.rpc('increment_meeting_count', { user_id_param: user.id })

    // Send notification email (non-blocking — errors are logged, not thrown)
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', user.id)
      .single()

    if (profile?.email) {
      await sendMeetingReadyEmail({
        to: profile.email,
        userName: profile.full_name,
        meetingId: meeting_id,
        meetingTitle: meeting.title,
        tldr: analysis.tldr,
        actionItemCount: analysis.action_items.length,
      })
    }

    return NextResponse.json({ success: true, meeting_id })

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error(`[process] Error for meeting ${meeting_id}:`, message)

    await supabase
      .from('meetings')
      .update({ status: 'error', error_message: message })
      .eq('id', meeting_id)

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
