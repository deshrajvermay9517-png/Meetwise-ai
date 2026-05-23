'use client'
import { useState } from 'react'
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

export default function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase) {
      setError('Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable authentication.')
      return
    }
    setLoading(true)
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001')}/auth/callback`,
      },
    })

    if (error) {
      // Map standard Firebase/Supabase errors to cleaner user facing text
      let msg = error.message
      if (msg.includes('User already registered')) {
        msg = 'An account with this email already exists. Try signing in instead.'
      }
      setError(msg)
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <main style={{
        minHeight: '100vh',
        background: '#040404',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"DM Sans", sans-serif',
        padding: '2rem',
        position: 'relative'
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(110, 201, 138, 0.05) 0%, rgba(0,0,0,0) 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 0
        }} />
        <div style={{ textAlign: 'center', maxWidth: '400px', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '3rem', color: '#6ec98a', marginBottom: '1.5rem' }}>✓</div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', color: '#f0ede8', marginBottom: '1rem', fontWeight: 600 }}>
            Account Created Successfully!
          </h1>
          <p style={{ color: '#888', lineHeight: 1.7, fontSize: '0.95rem', marginBottom: '2rem' }}>
            We've sent a verification email to <strong style={{ color: '#c9a96e' }}>{email}</strong>.<br />
            Please check your inbox (and spam folder) and click the link to activate your account.
          </p>
          <Link href="/login" style={{
            background: 'linear-gradient(135deg, #c9a96e 0%, #a4844b 100%)',
            color: '#0a0a0a',
            padding: '0.75rem 2rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 700,
            display: 'inline-block'
          }}>
            Proceed to Sign In
          </Link>
        </div>
      </main>
    )
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
          <div style={{ color: '#666', fontSize: '0.9rem' }}>Create your free account to get started</div>
        </div>

        <div style={{
          background: 'rgba(18, 18, 18, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.04)',
          borderRadius: '16px',
          padding: '2.5rem',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
        }}>
          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', marginBottom: '0.5rem' }}>
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                placeholder="Jane Smith"
                style={{ width: '100%', background: '#0a0a0a', border: '1px solid #1f1f1f', borderRadius: '8px', padding: '0.75rem 1rem', color: '#f0ede8', fontSize: '0.9rem', fontFamily: '"DM Sans", sans-serif', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = '#c9a96e'}
                onBlur={e => e.target.style.borderColor = '#1f1f1f'}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', marginBottom: '0.5rem' }}>
                Email Address
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
                placeholder="Min. 8 characters"
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
              {loading ? 'Creating account…' : 'Create free account'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#666' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#c9a96e', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.75rem', color: '#444' }}>
          Free plan includes 3 meetings/month. No credit card required.
        </p>
      </div>
    </main>
  )
}
