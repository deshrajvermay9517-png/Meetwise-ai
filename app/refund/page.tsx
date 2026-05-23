import Link from 'next/link'

export default function RefundPage() {
  return (
    <main style={{
      background: '#0a0a0a',
      color: '#c8c6c2',
      fontFamily: '"DM Sans", sans-serif',
      minHeight: '100vh',
      padding: '4rem 2rem'
    }}>
      <div style={{ maxWidth: '750px', margin: '0 auto' }}>
        <header style={{ marginBottom: '3rem', borderBottom: '1px solid #1a1a1a', paddingBottom: '1.5rem' }}>
          <Link href="/" style={{ color: '#c9a96e', textDecoration: 'none', fontSize: '0.9rem', display: 'inline-block', marginBottom: '1rem' }}>
            ← Back to Home
          </Link>
          <h1 style={{ color: '#f0ede8', fontSize: '2.5rem', fontWeight: 500, letterSpacing: '-0.02em', margin: 0 }}>
            Refund & Cancellation Policy
          </h1>
          <p style={{ color: '#555', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Last updated: May 23, 2026
          </p>
        </header>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', lineHeight: 1.7, fontSize: '0.95rem' }}>
          <div>
            <h2 style={{ color: '#f0ede8', fontSize: '1.25rem', marginBottom: '0.75rem' }}>1. Subscription Cancellation</h2>
            <p>
              You can cancel your Meetwise Pro subscription at any time directly through the <strong>Settings</strong> page on your dashboard. When you cancel, your access to Pro features will remain active until the end of your current billing cycle, and no further automatic renewals will take place.
            </p>
          </div>

          <div>
            <h2 style={{ color: '#f0ede8', fontSize: '1.25rem', marginBottom: '0.75rem' }}>2. Refund Policy</h2>
            <p>
              We want you to be completely satisfied with Meetwise. If you are unhappy with your subscription, you are eligible for a full refund within **7 days** of your initial signup/upgrade purchase. To request a refund, please contact us at <a href="mailto:support@meetwise.app" style={{ color: '#c9a96e', textDecoration: 'none' }}>support@meetwise.app</a>.
            </p>
          </div>

          <div>
            <h2 style={{ color: '#f0ede8', fontSize: '1.25rem', marginBottom: '0.75rem' }}>3. Eligibility and Limits</h2>
            <p>
              To prevent abuse of our services, refunds are subject to the following criteria:
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Refund requests must be received within 7 calendar days of the payment date.</li>
              <li>You must have uploaded/transcribed fewer than 3 meetings since your billing period started.</li>
              <li>Subsequent upgrades or renewals after your first month of service are non-refundable.</li>
            </ul>
          </div>

          <div>
            <h2 style={{ color: '#f0ede8', fontSize: '1.25rem', marginBottom: '0.75rem' }}>4. Processing Refunds</h2>
            <p>
              Once approved, refunds are processed instantly and returned to your original payment method (via Razorpay). Depending on your bank, it may take 5 to 10 business days for the funds to reflect in your account.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
