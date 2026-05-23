'use client'
// components/ProGate.tsx
// Wrap any Pro-only feature with this component.
// If the user is on the free plan, shows an upgrade prompt instead of the feature.
import { RazorpayCheckout } from './RazorpayCheckout'

interface ProGateProps {
  plan: string
  feature?: string          // label shown in the upgrade prompt
  children: React.ReactNode
  inline?: boolean          // if true, shows a compact inline lock instead of full overlay
}

export function ProGate({ plan, feature, children, inline = false }: ProGateProps) {
  if (plan === 'pro') return <>{children}</>

  if (inline) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        background: '#1a150a',
        border: '1px solid #c9a96e22',
        borderRadius: '8px',
        padding: '0.75rem 1rem',
      }}>
        <span style={{ fontSize: '1rem' }}>⚡</span>
        <span style={{ fontSize: '0.85rem', color: '#664e2a' }}>
          {feature ?? 'This feature'} requires Pro.
        </span>
        <a href="/pricing" style={{ marginLeft: 'auto', fontSize: '0.8rem', color: '#c9a96e', textDecoration: 'none', fontWeight: 600, whiteSpace: 'nowrap' }}>
          Upgrade →
        </a>
      </div>
    )
  }

  return (
    <div style={{
      background: '#111',
      border: '1px solid #1f1f1f',
      borderRadius: '12px',
      padding: '3rem 2rem',
      textAlign: 'center',
      maxWidth: '440px',
      margin: '0 auto',
    }}>
      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚡</div>
      <h3 style={{
        fontFamily: '"DM Serif Display", serif',
        fontSize: '1.5rem',
        fontWeight: 400,
        color: '#f0ede8',
        margin: '0 0 0.75rem',
        letterSpacing: '-0.02em',
      }}>
        {feature ? `${feature} is a Pro feature` : 'Pro feature'}
      </h3>
      <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '2rem' }}>
        Upgrade to MeetWise Pro to unlock unlimited meetings, AI search, sentiment analysis, and Slack/Notion integrations.
      </p>

      <div style={{ marginBottom: '1rem' }}>
        <RazorpayCheckout plan="pro" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left', marginTop: '1.5rem' }}>
        {[
          'Unlimited meetings per month',
          'Sentiment analysis per speaker',
          'Semantic search across all meetings',
          'Slack & Notion integrations',
        ].map((f, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: '#555' }}>
            <span style={{ color: '#c9a96e' }}>✓</span> {f}
          </div>
        ))}
      </div>

      <p style={{ fontSize: '0.75rem', color: '#333', marginTop: '1.5rem' }}>
        Secure payment via Razorpay · Cancel anytime
      </p>
    </div>
  )
}
