'use client'
import Link from 'next/link'

interface MeetingCardProps {
  id: string
  title: string
  status: string
  tldr?: string
  sentimentLabel?: string
  openActions: number
  durationSecs?: number | null
  createdAt: string
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    pending:      { label: 'Pending',      color: '#666',    bg: '#1a1a1a' },
    transcribing: { label: 'Transcribing', color: '#c9a96e', bg: '#1a150a' },
    analyzing:    { label: 'Analyzing',    color: '#6ea8c9', bg: '#0a1318' },
    done:         { label: 'Done',         color: '#6ec98a', bg: '#0a180e' },
    error:        { label: 'Error',        color: '#c96e6e', bg: '#180a0a' },
  }
  const s = map[status] ?? map.pending
  return (
    <span style={{ display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' as const, color: s.color, background: s.bg, border: `1px solid ${s.color}33` }}>
      {s.label}
    </span>
  )
}

function SentimentDot({ label }: { label?: string }) {
  if (!label) return null
  const map: Record<string, string> = { positive: '#6ec98a', neutral: '#888', negative: '#c96e6e' }
  return <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: map[label] ?? '#888', marginRight: '0.4rem', flexShrink: 0 }} />
}

export function MeetingCard({ id, title, status, tldr, sentimentLabel, openActions, durationSecs, createdAt }: MeetingCardProps) {
  return (
    <Link href={`/meetings/${id}`} style={{ textDecoration: 'none' }}>
      <div
        style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '10px', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'border-color 0.15s' }}
        onMouseOver={e => (e.currentTarget.style.borderColor = '#333')}
        onMouseOut={e => (e.currentTarget.style.borderColor = '#1f1f1f')}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
            <span style={{ fontWeight: 600, color: '#f0ede8', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {title}
            </span>
            <StatusBadge status={status} />
          </div>
          {tldr && (
            <p style={{ fontSize: '0.8rem', color: '#555', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>
              <SentimentDot label={sentimentLabel} />
              {tldr}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexShrink: 0 }}>
          {openActions > 0 && (
            <span style={{ fontSize: '0.75rem', color: '#555' }}>{openActions} action{openActions !== 1 ? 's' : ''}</span>
          )}
          {durationSecs && (
            <span style={{ fontSize: '0.75rem', color: '#444' }}>{Math.round(durationSecs / 60)}m</span>
          )}
          <span style={{ fontSize: '0.75rem', color: '#333' }}>
            {new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>
    </Link>
  )
}
