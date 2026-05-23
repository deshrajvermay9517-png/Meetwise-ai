'use client'
// app/(dashboard)/search/SearchClient.tsx
import { useState } from 'react'

export function SearchClient() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<{ answer: string; sources: any[] } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Search failed')
      } else {
        setResult(data)
      }
    } catch {
      setError('Search failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const suggestions = [
    'What did we decide about the product roadmap?',
    'Who is responsible for the marketing campaign?',
    'What were the main concerns raised in the last sprint?',
    'When is the Q3 deadline?',
  ]

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', padding: '3rem', maxWidth: '760px', margin: '0 auto' }}>
      <a href="/dashboard" style={{ fontSize: '0.8rem', color: '#444', textDecoration: 'none', marginBottom: '2rem', display: 'inline-block' }}>
        ← Back
      </a>

      <h1 style={{ fontFamily: '"DM Serif Display", serif', fontSize: '2rem', fontWeight: 400, color: '#f0ede8', margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>
        Search your meetings
      </h1>
      <p style={{ color: '#555', fontSize: '0.9rem', margin: '0 0 2.5rem' }}>
        Ask anything — AI searches across all your past recordings and answers in plain English.
      </p>

      <form onSubmit={handleSearch} style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="What did we decide about…"
            style={{
              flex: 1,
              background: '#111',
              border: '1px solid #2a2a2a',
              borderRadius: '8px',
              padding: '0.875rem 1rem',
              color: '#f0ede8',
              fontSize: '0.95rem',
              fontFamily: '"DM Sans", sans-serif',
              outline: 'none',
            }}
          />
          <button type="submit" disabled={loading || !query.trim()} style={{
            padding: '0.875rem 1.5rem',
            background: query.trim() && !loading ? '#c9a96e' : '#1a1a1a',
            color: query.trim() && !loading ? '#0a0a0a' : '#333',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.9rem',
            fontFamily: '"DM Sans", sans-serif',
            cursor: query.trim() && !loading ? 'pointer' : 'not-allowed',
          }}>
            {loading ? '…' : 'Ask'}
          </button>
        </div>
      </form>

      {/* Suggestions */}
      {!result && !loading && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#333', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            Try asking
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => setQuery(s)} style={{
                background: 'transparent',
                border: '1px solid #1f1f1f',
                borderRadius: '6px',
                padding: '0.6rem 1rem',
                color: '#555',
                fontSize: '0.875rem',
                textAlign: 'left',
                cursor: 'pointer',
                fontFamily: '"DM Sans", sans-serif',
              }}>
                "{s}"
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div style={{ background: '#180a0a', border: '1px solid #c96e6e33', borderRadius: '8px', padding: '1rem', color: '#c96e6e', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#444' }}>
          <div style={{ fontSize: '0.9rem' }}>Searching across your meetings…</div>
        </div>
      )}

      {result && (
        <div>
          {/* AI answer */}
          <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '10px', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: '0.75rem' }}>
              AI answer
            </div>
            <p style={{ color: '#d0cdc8', fontSize: '0.95rem', lineHeight: 1.8, margin: 0 }}>{result.answer}</p>
          </div>

          {/* Sources */}
          {result.sources?.length > 0 && (
            <div>
              <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#333', marginBottom: '0.75rem' }}>
                From {result.sources.length} meeting{result.sources.length > 1 ? 's' : ''}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {result.sources.map((source: any, i: number) => (
                  <a key={i} href={`/meetings/${source.meeting_id}`} style={{
                    background: '#0d0d0d',
                    border: '1px solid #1a1a1a',
                    borderRadius: '6px',
                    padding: '0.875rem 1rem',
                    textDecoration: 'none',
                    display: 'block',
                  }}>
                    <div style={{ fontSize: '0.8rem', color: '#c9a96e', marginBottom: '0.25rem' }}>
                      {source.meeting?.title ?? 'Meeting'} · {Math.round(source.similarity * 100)}% match
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#444', lineHeight: 1.6, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {source.chunk_text}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
