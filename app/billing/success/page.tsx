// app/billing/success/page.tsx  — standalone page (no dashboard sidebar)
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function PaymentSuccessPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, full_name')
    .eq('id', user.id)
    .single()

  // Guard: must actually be Pro to see this page
  if (profile?.plan !== 'pro') redirect('/pricing')

  const firstName = profile?.full_name?.split(' ')[0]

  return (
    <main style={{
      fontFamily: '"DM Sans", sans-serif',
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{ textAlign: 'center', maxWidth: '500px', width: '100%' }}>

        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: '#0a180e', border: '2px solid #6ec98a',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2rem', margin: '0 auto 2rem', color: '#6ec98a',
        }}>✓</div>

        <h1 style={{
          fontFamily: '"DM Serif Display", serif',
          fontSize: '2.5rem', fontWeight: 400, color: '#f0ede8',
          margin: '0 0 1rem', letterSpacing: '-0.02em',
        }}>
          You're on Pro{firstName ? `, ${firstName}` : ''}!
        </h1>

        <p style={{ color: '#666', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>
          Your payment was verified. All Pro features are now unlocked —
          unlimited meetings, AI search, sentiment analysis, and integrations.
        </p>

        <div style={{
          background: '#111', border: '1px solid #1f1f1f', borderRadius: '10px',
          padding: '1.5rem', marginBottom: '2rem', textAlign: 'left',
        }}>
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', marginBottom: '1rem' }}>
            Now unlocked
          </div>
          {([
            ['⌕', 'Semantic search — ask anything about any meeting'],
            ['◐', 'Sentiment analysis — per speaker, per meeting'],
            ['∞', 'Unlimited meetings per month'],
            ['⟳', 'Slack & Notion integrations'],
          ] as [string, string][]).map(([icon, label], i) => (
            <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: i < 3 ? '0.75rem' : 0 }}>
              <span style={{ color: '#c9a96e', fontSize: '1rem', width: 20, textAlign: 'center' }}>{icon}</span>
              <span style={{ color: '#888', fontSize: '0.875rem' }}>{label}</span>
            </div>
          ))}
        </div>

        <Link href="/dashboard" style={{
          display: 'inline-block', background: '#c9a96e', color: '#0a0a0a',
          padding: '0.875rem 2.5rem', borderRadius: '8px',
          textDecoration: 'none', fontWeight: 700, fontSize: '1rem',
        }}>
          Go to dashboard →
        </Link>

        <p style={{ fontSize: '0.75rem', color: '#333', marginTop: '1.5rem' }}>
          Receipt sent to your email · Questions? Contact support
        </p>
      </div>
    </main>
  )
}
