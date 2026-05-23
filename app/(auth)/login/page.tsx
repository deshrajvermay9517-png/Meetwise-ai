'use client'
import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const isSupabaseConfigured = !!(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.startsWith('https://your-') &&
  supabaseAnonKey !== 'your-anon-key'
)

const supabase = isSupabaseConfigured
  ? createBrowserClient(supabaseUrl, supabaseAnonKey)
  : null

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const err = params.get('error')
      const message = params.get('message')
      if (err) {
        setError(decodeURIComponent(err))
      }
      if (message) {
        setInfo(decodeURIComponent(message))
      }
    }
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase) {
      setError('Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable authentication.')
      return
    }
    setLoading(true)
    setError('')
    setInfo('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      // Map standard Firebase/Supabase errors to cleaner user facing text
      let msg = error.message
      if (msg.includes('Invalid login credentials')) {
        msg = 'Invalid email or password. Please verify your credentials and try again.'
      } else if (msg.includes('Email not confirmed')) {
        msg = 'Your email is not confirmed yet. Please check your inbox for the verification link.'
      }
      setError(msg)
      setLoading(false)
    } else {
      setInfo('Login successful! Redirecting to dashboard...')
      setTimeout(() => {
        router.push('/dashboard')
        router.refresh()
      }, 500)
    }
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: '#040404',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"DM Sans", sans-serif',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background ambient glow */}
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201, 169, 110, 0.06) 0%, rgba(0,0,0,0) 70%)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{ width: '100%', maxWidth: '400px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#f0ede8', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#c9a96e' }}>◎</span> meetwise
            </div>
          </Link>
          <div style={{ color: '#666', fontSize: '0.9rem' }}>Sign in to your account to continue</div>
        </div>

        <div style={{
          background: 'rgba(18, 18, 18, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.04)',
          borderRadius: '16px',
          padding: '2.5rem',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
        }}>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', marginBottom: '0.5rem' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={{ width: '100%', background: '#0a0a0a', border: '1px solid #1f1f1f', borderRadius: '8px', padding: '0.75rem 1rem', color: '#f0ede8', fontSize: '0.9rem', fontFamily: '"DM Sans", sans-serif', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = '#c9a96e'}
                onBlur={e => e.target.style.borderColor = '#1f1f1f'}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', marginBottom: '0.5rem' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{ width: '100%', background: '#0a0a0a', border: '1px solid #1f1f1f', borderRadius: '8px', padding: '0.75rem 1rem', color: '#f0ede8', fontSize: '0.9rem', fontFamily: '"DM Sans", sans-serif', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = '#c9a96e'}
                onBlur={e => e.target.style.borderColor = '#1f1f1f'}
              />
            </div>

            {error && (
              <div style={{ background: 'rgba(24, 10, 10, 0.8)', border: '1px solid rgba(201, 110, 110, 0.25)', borderRadius: '8px', padding: '0.75rem 1rem', color: '#c96e6e', fontSize: '0.8rem', lineHeight: 1.5 }}>
                {error}
              </div>
            )}

            {info && (
              <div style={{ background: 'rgba(10, 26, 14, 0.8)', border: '1px solid rgba(110, 201, 138, 0.25)', borderRadius: '8px', padding: '0.75rem 1rem', color: '#6ec98a', fontSize: '0.8rem', lineHeight: 1.5 }}>
                {info}
              </div>
            )}

            {!isSupabaseConfigured && (
              <div style={{ background: 'rgba(24, 10, 10, 0.8)', border: '1px solid rgba(201, 110, 110, 0.25)', borderRadius: '8px', padding: '0.75rem 1rem', color: '#c96e6e', fontSize: '0.8rem', lineHeight: 1.5 }}>
                Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable authentication.
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !isSupabaseConfigured}
              style={{
                marginTop: '0.5rem',
                width: '100%',
                padding: '0.875rem',
                background: (loading || !isSupabaseConfigured) ? '#1a1a1a' : 'linear-gradient(135deg, #c9a96e 0%, #a4844b 100%)',
                color: (loading || !isSupabaseConfigured) ? '#666' : '#0a0a0a',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.9rem',
                fontFamily: '"DM Sans", sans-serif',
                cursor: (loading || !isSupabaseConfigured) ? 'not-allowed' : 'pointer',
                boxShadow: (loading || !isSupabaseConfigured) ? 'none' : '0 4px 12px rgba(201, 169, 110, 0.15)',
                transition: 'all 0.2s'
              }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#666' }}>
            Don't have an account?{' '}
            <Link href="/signup" style={{ color: '#c9a96e', textDecoration: 'none', fontWeight: 600 }}>Sign up free</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
