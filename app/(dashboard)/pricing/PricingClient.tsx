'use client'
// app/(dashboard)/pricing/PricingClient.tsx
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { RazorpayCheckout } from '@/components/RazorpayCheckout'

const FEATURES = {
  free: [
    '3 meetings per month',
    'AI summaries',
    'Action item extraction',
    'Transcript storage',
  ],
  pro: [
    'Unlimited meetings',
    'Everything in Free',
    'Sentiment analysis per speaker',
    'Semantic search across all meetings',
    'Slack & Notion integrations',
    'Priority processing',
  ],
}

// Inner component that safely uses useSearchParams (must be inside Suspense)
function PricingInner({ currentPlan }: { currentPlan: string }) {
  const params = useSearchParams()
  const cancelled = params.get('cancelled') === 'true'
  const error = params.get('error')

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', padding: '3rem', maxWidth: '760px', margin: '0 auto' }}>
      <a href="/dashboard" style={{ fontSize: '0.8rem', color: '#444', textDecoration: 'none', display: 'inline-block', marginBottom: '2rem' }}>
        ← Back
      </a>

      <h1 style={{ fontFamily: '"DM Serif Display", serif', fontSize: '2.5rem', fontWeight: 400, color: '#f0ede8', margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>
        Simple pricing.
      </h1>
      <p style={{ color: '#555', fontSize: '0.95rem', margin: '0 0 2.5rem' }}>
        You're on the <strong style={{ color: '#888', textTransform: 'capitalize' }}>{currentPlan}</strong> plan.
      </p>

      {/* Status banners */}
      {cancelled && (
        <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '1rem 1.25rem', marginBottom: '1.5rem', color: '#666', fontSize: '0.875rem' }}>
          Payment cancelled — no charge was made. You can upgrade any time below.
        </div>
      )}
      {error === 'verification_failed' && (
        <div style={{ background: '#180a0a', border: '1px solid #c96e6e33', borderRadius: '8px', padding: '1rem 1.25rem', marginBottom: '1.5rem', color: '#c96e6e', fontSize: '0.875rem' }}>
          Payment verification failed. If money was deducted, please contact support — it will be refunded.
        </div>
      )}
      {error === 'network' && (
        <div style={{ background: '#180a0a', border: '1px solid #c96e6e33', borderRadius: '8px', padding: '1rem 1.25rem', marginBottom: '1.5rem', color: '#c96e6e', fontSize: '0.875rem' }}>
          Network error during payment. Please try again.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#1f1f1f', border: '1px solid #1f1f1f', borderRadius: '12px', overflow: 'hidden' }}>

        {/* Free plan */}
        <div style={{ background: '#0f0f0f', padding: '2.5rem 2rem' }}>
          {currentPlan === 'free' && (
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6ec98a', marginBottom: '0.75rem' }}>
              ✓ Current plan
            </div>
          )}
          <div style={{ fontSize: '1rem', fontWeight: 600, color: '#f0ede8', marginBottom: '0.5rem' }}>Free</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#f0ede8', letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>₹0</div>
          <div style={{ fontSize: '0.8rem', color: '#444', marginBottom: '2rem' }}>Forever free</div>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {FEATURES.free.map((f, i) => (
              <li key={i} style={{ fontSize: '0.875rem', color: '#666', display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: '#444' }}>✓</span> {f}
              </li>
            ))}
          </ul>

          <div style={{ padding: '0.875rem', borderRadius: '6px', border: '1px solid #222', color: '#333', textAlign: 'center', fontSize: '0.875rem' }}>
            {currentPlan === 'free' ? 'Current plan' : 'Downgrade'}
          </div>
        </div>

        {/* Pro plan */}
        <div style={{ background: '#141414', padding: '2.5rem 2rem' }}>
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: '0.75rem' }}>
            {currentPlan === 'pro' ? '✓ Current plan' : 'Recommended'}
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: '#f0ede8', marginBottom: '0.5rem' }}>Pro</div>
          <div style={{ marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 700, color: '#f0ede8', letterSpacing: '-0.03em' }}>₹1,499</span>
            <span style={{ fontSize: '1rem', color: '#555' }}>/mo</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#444', marginBottom: '2rem' }}>Billed monthly · Cancel anytime</div>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {FEATURES.pro.map((f, i) => (
              <li key={i} style={{ fontSize: '0.875rem', color: '#888', display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: '#c9a96e' }}>✓</span> {f}
              </li>
            ))}
          </ul>

          {currentPlan === 'pro' ? (
            <div style={{ padding: '0.875rem', borderRadius: '6px', background: '#0a180e', border: '1px solid #6ec98a22', color: '#6ec98a', textAlign: 'center', fontSize: '0.875rem', fontWeight: 600 }}>
              ✓ Active
            </div>
          ) : (
            <RazorpayCheckout plan="pro" />
          )}
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '2rem', fontSize: '0.8rem', color: '#333' }}>
        <span>🔒 Secured by Razorpay</span>
        <span>✓ UPI, cards, net banking, wallets</span>
        <span>₹ INR billing</span>
      </div>
    </div>
  )
}

// Exported component wraps inner in Suspense (required by Next.js 14 for useSearchParams)
export function PricingClient({ currentPlan }: { currentPlan: string }) {
  return (
    <Suspense fallback={null}>
      <PricingInner currentPlan={currentPlan} />
    </Suspense>
  )
}
