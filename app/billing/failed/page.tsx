'use client'
// app/billing/failed/page.tsx — standalone page (no dashboard sidebar)
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { RazorpayCheckout } from '@/components/RazorpayCheckout'

function FailedContent() {
  const params = useSearchParams()
  const reason = params.get('reason') ?? 'Your payment could not be processed.'

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
      <div style={{ textAlign: 'center', maxWidth: '460px', width: '100%' }}>

        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: '#180a0a', border: '2px solid #c96e6e',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2rem', margin: '0 auto 2rem', color: '#c96e6e',
        }}>✕</div>

        <h1 style={{
          fontFamily: '"DM Serif Display", serif',
          fontSize: '2rem', fontWeight: 400, color: '#f0ede8',
          margin: '0 0 1rem', letterSpacing: '-0.02em',
        }}>
          Payment failed
        </h1>

        <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>
          {reason}
        </p>

        <p style={{ color: '#444', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>
          No money was deducted. You can try again below, or contact your bank if the issue persists.
        </p>

        <div style={{ marginBottom: '1rem' }}>
          <RazorpayCheckout plan="pro">Try again →</RazorpayCheckout>
        </div>

        <Link href="/dashboard" style={{
          display: 'inline-block', color: '#444',
          fontSize: '0.875rem', textDecoration: 'none', marginTop: '0.5rem',
        }}>
          ← Back to dashboard
        </Link>
      </div>
    </main>
  )
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={null}>
      <FailedContent />
    </Suspense>
  )
}
