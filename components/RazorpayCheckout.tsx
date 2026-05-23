'use client'
// components/RazorpayCheckout.tsx
// Loads the Razorpay JS SDK, creates an order server-side,
// then opens the Razorpay payment modal for the user.
import { useState } from 'react'
import { useRouter } from 'next/navigation'

declare global {
  interface Window {
    Razorpay: any
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise(resolve => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

interface RazorpayCheckoutProps {
  plan?: 'pro'
  children?: React.ReactNode
  style?: React.CSSProperties
}

export function RazorpayCheckout({ plan = 'pro', children, style }: RazorpayCheckoutProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleCheckout() {
    setLoading(true)
    setError('')

    // ── Step 1: Load Razorpay SDK ─────────────────────────────────────────
    const sdkLoaded = await loadRazorpayScript()
    if (!sdkLoaded) {
      setError('Could not load payment SDK. Check your connection.')
      setLoading(false)
      return
    }

    // ── Step 2: Create order server-side ─────────────────────────────────
    let orderData: any
    try {
      const res = await fetch('/api/billing/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      orderData = await res.json()
      if (!res.ok) {
        const errMsg = orderData.error === 'payments_not_configured'
          ? 'Payments are not configured yet.'
          : (orderData.error ?? 'Could not create order.')
        setError(errMsg)
        setLoading(false)
        return
      }
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
      return
    }

    // ── Step 3: Open Razorpay modal ───────────────────────────────────────
    // handlerCalled prevents ondismiss from firing a cancel redirect
    // after the payment handler has already redirected to success.
    let handlerCalled = false

    const options = {
      key: orderData.key_id,
      amount: orderData.amount_paise,
      currency: orderData.currency,
      name: 'MeetWise',
      description: orderData.description,
      order_id: orderData.order_id,
      prefill: {
        name: orderData.user_name,
        email: orderData.user_email,
      },
      theme: { color: '#c9a96e' },
      modal: {
        ondismiss: () => {
          if (handlerCalled) return   // payment succeeded — don't redirect to cancelled
          setLoading(false)
          router.push('/pricing?cancelled=true')
        },
      },

      // ── Step 4: Verify payment server-side after modal closes ─────────
      handler: async (response: {
        razorpay_order_id: string
        razorpay_payment_id: string
        razorpay_signature: string
      }) => {
        handlerCalled = true
        try {
          const verifyRes = await fetch('/api/billing/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          })
          const verifyData = await verifyRes.json()

          if (!verifyRes.ok || !verifyData.success) {
            router.push('/pricing?error=verification_failed')
            return
          }

          // Payment verified ✓ — redirect to success page
          router.push('/billing/success')
        } catch {
          router.push('/pricing?error=network')
        }
      },
    }

    const rzp = new window.Razorpay(options)

    rzp.on('payment.failed', (response: any) => {
      console.error('[razorpay] Payment failed:', response.error)
      setLoading(false)
      router.push(`/billing/failed?reason=${encodeURIComponent(response.error?.description ?? 'Payment failed')}`)
    })

    rzp.open()
  }

  return (
    <div>
      <button
        onClick={handleCheckout}
        disabled={loading}
        style={{
          background: loading ? '#1a1a1a' : '#c9a96e',
          color: loading ? '#444' : '#0a0a0a',
          border: 'none',
          borderRadius: '8px',
          padding: '0.875rem 2rem',
          fontWeight: 700,
          fontSize: '1rem',
          fontFamily: '"DM Sans", sans-serif',
          cursor: loading ? 'not-allowed' : 'pointer',
          width: '100%',
          transition: 'all 0.15s',
          ...style,
        }}
      >
        {loading ? 'Opening payment…' : (children ?? 'Upgrade to Pro — ₹1,499/mo')}
      </button>
      {error && (
        <p style={{ color: '#c96e6e', fontSize: '0.8rem', marginTop: '0.5rem', textAlign: 'center' }}>
          {error}
        </p>
      )}
    </div>
  )
}
