'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    // Simulate API call
    setTimeout(() => {
      setSending(false)
      setSuccess(true)
      setName('')
      setEmail('')
      setMessage('')
    }, 1200)
  }

  return (
    <main style={{
      background: '#0a0a0a',
      color: '#c8c6c2',
      fontFamily: '"DM Sans", sans-serif',
      minHeight: '100vh',
      padding: '4rem 2rem'
    }}>
      <div style={{ maxWidth: '650px', margin: '0 auto' }}>
        <header style={{ marginBottom: '3rem', borderBottom: '1px solid #1a1a1a', paddingBottom: '1.5rem' }}>
          <Link href="/" style={{ color: '#c9a96e', textDecoration: 'none', fontSize: '0.9rem', display: 'inline-block', marginBottom: '1rem' }}>
            ← Back to Home
          </Link>
          <h1 style={{ color: '#f0ede8', fontSize: '2.5rem', fontWeight: 500, letterSpacing: '-0.02em', margin: 0 }}>
            Contact Us
          </h1>
          <p style={{ color: '#555', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Have questions about billing, plans, or technical integrations? Let us know.
          </p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          {success ? (
            <div style={{ background: '#0a1a0e', border: '1px solid #6ec98a33', borderRadius: '12px', padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', color: '#6ec98a', marginBottom: '0.5rem' }}>✓</div>
              <h3 style={{ color: '#f0ede8', margin: '0 0 0.5rem' }}>Message Sent</h3>
              <p style={{ color: '#aaa', margin: 0, fontSize: '0.9rem' }}>
                Thank you for contacting us! We usually reply within 24 hours.
              </p>
              <button onClick={() => setSuccess(false)} style={{ background: 'transparent', border: '1px solid #333', color: '#888', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', marginTop: '1rem' }}>
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#555', marginBottom: '0.4rem' }}>
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  placeholder="John Doe"
                  style={{ width: '100%', background: '#0d0d0d', border: '1px solid #2a2a2a', borderRadius: '6px', padding: '0.75rem', color: '#f0ede8', fontSize: '0.9rem', fontFamily: '"DM Sans", sans-serif', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#555', marginBottom: '0.4rem' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@company.com"
                  style={{ width: '100%', background: '#0d0d0d', border: '1px solid #2a2a2a', borderRadius: '6px', padding: '0.75rem', color: '#f0ede8', fontSize: '0.9rem', fontFamily: '"DM Sans", sans-serif', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#555', marginBottom: '0.4rem' }}>
                  Message / Request
                </label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                  rows={5}
                  placeholder="Describe your question or request..."
                  style={{ width: '100%', background: '#0d0d0d', border: '1px solid #2a2a2a', borderRadius: '6px', padding: '0.75rem', color: '#f0ede8', fontSize: '0.9rem', fontFamily: '"DM Sans", sans-serif', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                style={{
                  marginTop: '0.5rem',
                  padding: '0.875rem',
                  background: sending ? '#1a1a1a' : '#c9a96e',
                  color: sending ? '#333' : '#0a0a0a',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: sending ? 'not-allowed' : 'pointer',
                  fontFamily: '"DM Sans", sans-serif'
                }}
              >
                {sending ? 'Sending message...' : 'Send Message'}
              </button>
            </form>
          )}

          <div style={{ background: '#0e0e0e', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 0.5rem', color: '#f0ede8', fontWeight: 500 }}>Direct Contact</h4>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#888' }}>
              Email us directly at: <a href="mailto:support@meetwise.app" style={{ color: '#c9a96e', textDecoration: 'none' }}>support@meetwise.app</a>
            </p>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', color: '#444' }}>
              Our operations are based in Bangalore, India.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
