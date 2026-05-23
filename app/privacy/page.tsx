import Link from 'next/link'

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p style={{ color: '#555', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Last updated: May 23, 2026
          </p>
        </header>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', lineHeight: 1.7, fontSize: '0.95rem' }}>
          <div>
            <h2 style={{ color: '#f0ede8', fontSize: '1.25rem', marginBottom: '0.75rem' }}>1. Information We Collect</h2>
            <p>
              We collect your email address and full name during sign-up to create your account and manage your active plan. When you use Meetwise, you upload audio files and transcripts. These files are securely stored in our cloud infrastructure (Supabase Storage) and processed through third-party AI APIs (OpenAI and Anthropic) to generate transcripts, summaries, and meeting action items.
            </p>
          </div>

          <div>
            <h2 style={{ color: '#f0ede8', fontSize: '1.25rem', marginBottom: '0.75rem' }}>2. How We Use Your Data</h2>
            <p>
              Your data is strictly used to provide the Meetwise service: generating transcripts, creating AI meeting summaries, analyzing speaker sentiment, and facilitating semantic search across your previous meetings. We do not sell your personal data or utilize your meetings to train AI models.
            </p>
          </div>

          <div>
            <h2 style={{ color: '#f0ede8', fontSize: '1.25rem', marginBottom: '0.75rem' }}>3. Data Storage & Deletion</h2>
            <p>
              Your audio files are stored in private Supabase Storage buckets, and transcripts are recorded in our secure Supabase PostgreSQL database. You retain full ownership and control over your data. You can delete any meeting, recording, or your entire account at any time directly through the dashboard settings. Deletion is instantaneous and permanent.
            </p>
          </div>

          <div>
            <h2 style={{ color: '#f0ede8', fontSize: '1.25rem', marginBottom: '0.75rem' }}>4. Subprocessors</h2>
            <p>
              We partner with OpenAI (for speech-to-text transcription and vector embeddings) and Anthropic (for summarization, topic modeling, and semantic response generation). These services process your text/audio inputs securely and are contractually bound to not retain data for longer than necessary or use it for training.
            </p>
          </div>

          <div>
            <h2 style={{ color: '#f0ede8', fontSize: '1.25rem', marginBottom: '0.75rem' }}>5. Contact Us</h2>
            <p>
              If you have any questions or data concerns, feel free to reach out to us at <a href="mailto:support@meetwise.app" style={{ color: '#c9a96e', textDecoration: 'none' }}>support@meetwise.app</a>.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
