// app/(dashboard)/meetings/[id]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { StatusPoller } from '@/components/StatusPoller'
import { ActionItemsList } from '@/components/ActionItemsList'
import { DeleteMeetingButton } from '@/components/DeleteMeetingButton'

function SentimentBar({ score }: { score: number }) {
  // score -1 to 1
  const pct = Math.round(((score + 1) / 2) * 100)
  const color = score > 0.2 ? '#6ec98a' : score < -0.2 ? '#c96e6e' : '#888'
  return (
    <div style={{ marginTop: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#555', marginBottom: '0.3rem' }}>
        <span>Negative</span>
        <span style={{ color }}>{score > 0 ? '+' : ''}{score.toFixed(2)}</span>
        <span>Positive</span>
      </div>
      <div style={{ background: '#1a1a1a', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '4px', transition: 'width 0.5s' }} />
      </div>
    </div>
  )
}

export default async function MeetingPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: meeting } = await supabase
    .from('meetings')
    .select(`
      *,
      summaries(*),
      action_items(*),
      transcripts(*)
    `)
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!meeting) notFound()

  const summary = meeting.summaries?.[0]
  const transcript = meeting.transcripts?.[0]
  const actions = meeting.action_items ?? []

  const completedActions = actions.filter((a: any) => a.done).length
  const totalActions = actions.length

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', padding: '2rem 3rem', maxWidth: '1000px', margin: '0 auto' }}>
      <StatusPoller status={meeting.status} />

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <a href="/dashboard" style={{ fontSize: '0.8rem', color: '#444', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            ← Back
          </a>
          <DeleteMeetingButton meetingId={meeting.id} />
        </div>
        <h1 style={{ fontFamily: '"DM Serif Display", serif', fontSize: '2rem', fontWeight: 400, color: '#f0ede8', margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>
          {meeting.title}
        </h1>
        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: '#444', flexWrap: 'wrap' }}>
          <span>{new Date(meeting.created_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          {meeting.duration_secs && <span>{Math.round(meeting.duration_secs / 60)} minutes</span>}
          {meeting.participants?.length && <span>{meeting.participants.join(', ')}</span>}
        </div>
      </div>

      {meeting.status !== 'done' && (
        <div style={{ background: '#1a150a', border: '1px solid #c9a96e33', borderRadius: '10px', padding: '1.5rem', marginBottom: '2rem', color: '#c9a96e', fontSize: '0.9rem' }}>
          {meeting.status === 'error'
            ? `⚠ Processing failed: ${meeting.error_message}`
            : `⏳ ${meeting.status === 'transcribing' ? 'Transcribing audio…' : meeting.status === 'analyzing' ? 'Analyzing content with AI…' : 'Queued for processing…'}`}
        </div>
      )}

      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Main summary */}
          <div>
            {/* TL;DR */}
            <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '10px', padding: '1.5rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', marginBottom: '0.75rem' }}>TL;DR</div>
              <p style={{ color: '#f0ede8', fontSize: '1rem', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>
                {summary.tldr}
              </p>
            </div>

            {/* Full summary */}
            <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '10px', padding: '1.5rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', marginBottom: '0.75rem' }}>Summary</div>
              <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: 1.8, margin: 0 }}>{summary.body}</p>
            </div>

            {/* Key decisions */}
            {summary.key_decisions?.length > 0 && (
              <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '10px', padding: '1.5rem' }}>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', marginBottom: '0.75rem' }}>Key decisions</div>
                <ul style={{ margin: 0, padding: '0 0 0 1rem' }}>
                  {summary.key_decisions.map((d: string, i: number) => (
                    <li key={i} style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: 1.7 }}>{d}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Sentiment */}
            <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '10px', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', marginBottom: '0.75rem' }}>Meeting sentiment</div>
              <SentimentBar score={summary.sentiment_score ?? 0} />
              {summary.speaker_sentiment && Object.entries(summary.speaker_sentiment as Record<string, any>).map(([speaker, s]) => (
                <div key={speaker} style={{ marginTop: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#555', marginBottom: '0.25rem' }}>{speaker}</div>
                  <SentimentBar score={s.score} />
                </div>
              ))}
            </div>

            {/* Topics */}
            {summary.topics?.length > 0 && (
              <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '10px', padding: '1.25rem' }}>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', marginBottom: '0.75rem' }}>Topics</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {summary.topics.map((t: string, i: number) => (
                    <span key={i} style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#888', fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action items progress */}
            {totalActions > 0 && (
              <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '10px', padding: '1.25rem' }}>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', marginBottom: '0.5rem' }}>Action items</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f0ede8', letterSpacing: '-0.02em' }}>
                  {completedActions} / {totalActions}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#444', marginBottom: '0.5rem' }}>completed</div>
                <div style={{ background: '#1a1a1a', borderRadius: '4px', height: '4px' }}>
                  <div style={{ width: `${totalActions ? (completedActions / totalActions) * 100 : 0}%`, height: '100%', background: '#6ec98a', borderRadius: '4px' }} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action items — interactive client component */}
      <ActionItemsList items={actions} />

      {/* Transcript */}
      {transcript && (
        <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '10px', padding: '1.5rem' }}>
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', marginBottom: '1rem' }}>Transcript</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '500px', overflowY: 'auto' }}>
            {(transcript.segments ?? []).map((seg: any, i: number) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '1rem', alignItems: 'start' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: '#c9a96e', fontWeight: 600 }}>{seg.speaker}</div>
                  <div style={{ fontSize: '0.65rem', color: '#333' }}>{Math.floor(seg.start / 60)}:{String(Math.floor(seg.start % 60)).padStart(2, '0')}</div>
                </div>
                <div style={{ fontSize: '0.875rem', color: '#888', lineHeight: 1.7 }}>{seg.text}</div>
              </div>
            ))}
            {!transcript.segments?.length && (
              <p style={{ color: '#555', fontSize: '0.875rem', lineHeight: 1.8 }}>{transcript.full_text}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
