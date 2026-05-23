import Link from 'next/link'

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p style={{ color: '#555', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Last updated: May 23, 2026
          </p>
        </header>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', lineHeight: 1.7, fontSize: '0.95rem' }}>
          <div>
            <h2 style={{ color: '#f0ede8', fontSize: '1.25rem', marginBottom: '0.75rem' }}>1. Agreement to Terms</h2>
            <p>
              By accessing and creating an account on Meetwise ("we", "us", "our"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the website.
            </p>
          </div>

          <div>
            <h2 style={{ color: '#f0ede8', fontSize: '1.25rem', marginBottom: '0.75rem' }}>2. Accounts and Subscriptions</h2>
            <p>
              To use Meetwise, you must sign up for an account. You are responsible for keeping your login credentials secure. We offer a Free Plan (limited to 3 meetings per month) and a paid Pro Plan (unlimited meetings and advanced features). Monthly fees for paid plans are processed securely via Razorpay and are billed in advance.
            </p>
          </div>

          <div>
            <h2 style={{ color: '#f0ede8', fontSize: '1.25rem', marginBottom: '0.75rem' }}>3. User Content & License</h2>
            <p>
              You own all intellectual property rights in the recordings, audio files, and text transcripts you upload or generate via Meetwise. We do not claim any ownership of your content. By uploading content, you grant us a temporary, worldwide license solely to process and display it to you.
            </p>
          </div>

          <div>
            <h2 style={{ color: '#f0ede8', fontSize: '1.25rem', marginBottom: '0.75rem' }}>4. Fair Use & Prohibited Conduct</h2>
            <p>
              Meetwise is intended for personal and business meeting transcription. You may not upload malware, infringe on copyrights, record individuals without consent where prohibited by local laws, or spam our system. We reserve the right to suspend accounts violating these usage rules.
            </p>
          </div>

          <div>
            <h2 style={{ color: '#f0ede8', fontSize: '1.25rem', marginBottom: '0.75rem' }}>5. Limitation of Liability</h2>
            <p>
              Meetwise is provided "as is" and "as available". While we strive for absolute accuracy in transcripts and summaries, AI-generated content may occasionally contain errors. We are not liable for business decisions made based on AI-generated summaries or details.
            </p>
          </div>

          <div>
            <h2 style={{ color: '#f0ede8', fontSize: '1.25rem', marginBottom: '0.75rem' }}>6. Service Modifications</h2>
            <p>
              We reserve the right to modify or discontinue features, change subscription pricing with 30 days notice, or update these terms. Continued use of the service constitutes acceptance of any changes.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
