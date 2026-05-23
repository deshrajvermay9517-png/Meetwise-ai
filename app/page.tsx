import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="landing-container" style={{
      fontFamily: '"DM Sans", sans-serif',
      background: '#040404',
      color: '#f0ede8',
      minHeight: '100vh',
      overflowX: 'hidden',
      position: 'relative'
    }}>
      {/* Dynamic CSS styles for animations and responsiveness */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Outfit:wght@100..900&display=swap');
        
        .heading-font {
          font-family: 'Outfit', sans-serif;
        }
        
        /* Sticky glass navbar */
        .glass-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(12px);
          background: rgba(10, 10, 10, 0.7);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.3s ease;
        }
        
        /* Ambient background glow */
        .glow-sphere {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(201, 169, 110, 0.08) 0%, rgba(201, 169, 110, 0) 70%);
          top: -200px;
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
          z-index: 0;
        }

        .glow-sphere-2 {
          position: absolute;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(110, 169, 201, 0.05) 0%, rgba(110, 169, 201, 0) 70%);
          bottom: 100px;
          left: 10%;
          pointer-events: none;
          z-index: 0;
        }
        
        /* Card Hover Effects */
        .glass-card {
          background: rgba(18, 18, 18, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 16px;
          padding: 2.5rem;
          backdrop-filter: blur(8px);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
        }
        
        .glass-card:hover {
          transform: translateY(-6px);
          border-color: rgba(201, 169, 110, 0.25);
          background: rgba(22, 22, 22, 0.8);
          box-shadow: 0 10px 40px rgba(201, 169, 110, 0.05);
        }
        
        /* Interactive buttons */
        .btn-primary {
          background: linear-gradient(135deg, #c9a96e 0%, #a4844b 100%);
          color: #050505;
          font-weight: 600;
          transition: all 0.2s ease;
          box-shadow: 0 4px 15px rgba(201, 169, 110, 0.25);
        }
        .btn-primary:hover {
          transform: scale(1.03);
          box-shadow: 0 6px 20px rgba(201, 169, 110, 0.4);
        }
        
        .btn-secondary {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #f0ede8;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.15);
          color: #fff;
        }
        
        /* Pricing highlight */
        .pricing-pro {
          border: 1px solid rgba(201, 169, 110, 0.3) !important;
          background: linear-gradient(180deg, rgba(20, 18, 14, 0.7) 0%, rgba(12, 12, 12, 0.8) 100%) !important;
          position: relative;
        }
        .pricing-pro::before {
          content: 'POPULAR';
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: #c9a96e;
          color: #0a0a0a;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.15em;
          padding: 4px 12px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(201, 169, 110, 0.3);
        }

        /* Responsive Grids */
        @media (max-width: 820px) {
          .nav-links {
            display: none !important;
          }
          .hero-section {
            padding: 6rem 1.5rem 4rem !important;
            text-align: center;
          }
          .hero-cta-container {
            justify-content: center;
            flex-direction: column;
            align-items: center;
            gap: 1.5rem !important;
          }
          .feature-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          .pricing-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .how-it-works-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      ` }} />

      <div className="glow-sphere" />
      <div className="glow-sphere-2" />

      {/* Navigation */}
      <nav className="glass-nav" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.25rem 3rem',
      }}>
        <div className="heading-font" style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#f0ede8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: '#c9a96e' }}>◎</span> meetwise
        </div>
        <div className="nav-links" style={{ display: 'flex', gap: '2rem', alignItems: 'center', fontSize: '0.9rem', color: '#888' }}>
          <a href="#features" style={{ color: '#888', textDecoration: 'none', transition: 'color 0.2s' }}>Features</a>
          <a href="#how-it-works" style={{ color: '#888', textDecoration: 'none', transition: 'color 0.2s' }}>How it works</a>
          <a href="#pricing" style={{ color: '#888', textDecoration: 'none', transition: 'color 0.2s' }}>Pricing</a>
          <Link href="/contact" style={{ color: '#888', textDecoration: 'none', transition: 'color 0.2s' }}>Support</Link>
          <span style={{ color: '#222' }}>|</span>
          <Link href="/login" style={{ color: '#f0ede8', textDecoration: 'none', transition: 'color 0.2s' }}>Log in</Link>
          <Link href="/signup" className="btn-primary" style={{
            padding: '0.5rem 1.25rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '0.875rem',
          }}>
            Get started free
          </Link>
        </div>
        <div className="mobile-only-btn" style={{ display: 'none' }}>
          {/* Fallback for smaller layouts */}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section" style={{ padding: '9rem 3rem 6rem', maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(201, 169, 110, 0.08)',
          border: '1px solid rgba(201, 169, 110, 0.15)',
          padding: '0.4rem 1rem',
          borderRadius: '20px',
          color: '#c9a96e',
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          marginBottom: '2.5rem'
        }}>
          <span>✨</span> Smart meeting summaries in minutes
        </div>
        
        <h1 className="heading-font" style={{
          fontSize: 'clamp(2.5rem, 6.5vw, 4.5rem)',
          lineHeight: 1.1,
          fontWeight: 800,
          letterSpacing: '-0.03em',
          marginBottom: '1.5rem',
          color: '#f0ede8',
        }}>
          Turn every meeting into <br className="nav-links" />
          <span style={{
            background: 'linear-gradient(135deg, #c9a96e 0%, #f0ede8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>searchable knowledge.</span>
        </h1>
        
        <p style={{
          fontSize: 'clamp(1.1rem, 2vw, 1.25rem)',
          color: '#8e8e93',
          maxWidth: '650px',
          lineHeight: 1.6,
          marginBottom: '3rem',
        }}>
          Meetwise is the AI meeting notes platform that transcribes your calls, extracts action items with deadlines, gauges speaker sentiment, and lets you query past meetings instantly.
        </p>

        <div className="hero-cta-container" style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <Link href="/signup" className="btn-primary" style={{
            padding: '0.875rem 2.25rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '1rem',
            display: 'inline-block'
          }}>
            Try Meetwise Free →
          </Link>
          <Link href="#pricing" className="btn-secondary" style={{
            padding: '0.875rem 1.75rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '1rem',
            display: 'inline-block'
          }}>
            View Plans
          </Link>
        </div>

        <div style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: '#555', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>✓ 3 free meetings/month</span>
          <span>•</span>
          <span>✓ No credit card required</span>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" style={{ padding: '6rem 2rem', maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 className="heading-font" style={{ fontSize: '2.25rem', fontWeight: 700, color: '#f0ede8', marginBottom: '1rem' }}>
            Built for modern professional workflows
          </h2>
          <p style={{ color: '#777', maxWidth: '600px', margin: '0 auto', fontSize: '1rem' }}>
            Stop wasting hours taking notes. Let AI handle the minutes so you can focus on the conversation.
          </p>
        </div>

        <div className="feature-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '2rem',
        }}>
          <div className="glass-card">
            <div style={{ fontSize: '1.75rem', color: '#c9a96e', marginBottom: '1rem' }}>◎</div>
            <h3 className="heading-font" style={{ fontSize: '1.25rem', fontWeight: 600, color: '#f0ede8', marginBottom: '0.75rem' }}>
              Accurate Transcripts
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#888', lineHeight: 1.6 }}>
              Whisper-powered audio processing converts voice into precise text. It automatically attributes speech to distinct speaker labels.
            </p>
          </div>

          <div className="glass-card">
            <div style={{ fontSize: '1.75rem', color: '#c9a96e', marginBottom: '1rem' }}>✓</div>
            <h3 className="heading-font" style={{ fontSize: '1.25rem', fontWeight: 600, color: '#f0ede8', marginBottom: '0.75rem' }}>
              Smart Action Items
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#888', lineHeight: 1.6 }}>
              AI extracts explicit and implicit tasks from the transcript, assigning owners, priorities, and deadlines automatically.
            </p>
          </div>

          <div className="glass-card">
            <div style={{ fontSize: '1.75rem', color: '#c9a96e', marginBottom: '1rem' }}>◐</div>
            <h3 className="heading-font" style={{ fontSize: '1.25rem', fontWeight: 600, color: '#f0ede8', marginBottom: '0.75rem' }}>
              Sentiment Analytics
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#888', lineHeight: 1.6 }}>
              Understand the room. Get sentiment scoring per-speaker and across the entire call to keep track of alignments and concerns.
            </p>
          </div>

          <div className="glass-card">
            <div style={{ fontSize: '1.75rem', color: '#c9a96e', marginBottom: '1rem' }}>⌕</div>
            <h3 className="heading-font" style={{ fontSize: '1.25rem', fontWeight: 600, color: '#f0ede8', marginBottom: '0.75rem' }}>
              Semantic Search
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#888', lineHeight: 1.6 }}>
              Don't manually read transcripts. Ask "What did we decide about the launch date?" and search across all meetings instantly.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ padding: '6rem 2rem', background: '#070707', borderTop: '1px solid #111', borderBottom: '1px solid #111' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 className="heading-font" style={{ fontSize: '2.25rem', fontWeight: 700, color: '#f0ede8', marginBottom: '1rem' }}>
              How Meetwise works
            </h2>
            <p style={{ color: '#777', fontSize: '1rem' }}>Three simple steps to unlock your meeting intelligence.</p>
          </div>

          <div className="how-it-works-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3rem' }}>
            {[
              { num: '01', title: 'Upload Meeting', desc: 'Drag and drop any audio recording (MP3, M4A, WAV, etc.) straight into your dashboard.' },
              { num: '02', title: 'AI Notes & Analysis', desc: 'Our transcription and analysis pipelines extract transcripts, summaries, decisions, and action items.' },
              { num: '03', title: 'Search & Action', desc: 'Review transcripts, check sentiment, mark action items as complete, or semantic-search past calls.' }
            ].map((step, idx) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <div className="heading-font" style={{ fontSize: '3rem', fontWeight: 800, color: 'rgba(201, 169, 110, 0.1)', marginBottom: '1rem' }}>
                  {step.num}
                </div>
                <h3 className="heading-font" style={{ fontSize: '1.25rem', color: '#f0ede8', marginBottom: '0.5rem', fontWeight: 600 }}>{step.title}</h3>
                <p style={{ fontSize: '0.875rem', color: '#666', lineHeight: 1.6, maxWidth: '280px', margin: '0 auto' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{ padding: '7rem 2rem', maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 className="heading-font" style={{ fontSize: '2.25rem', fontWeight: 700, color: '#f0ede8', marginBottom: '1rem' }}>
            Sleek plans for any scale
          </h2>
          <p style={{ color: '#777', fontSize: '1rem' }}>Start capturing insights for free, upgrade as your team grows.</p>
        </div>

        <div className="pricing-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '2.5rem',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {/* Free Plan */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f0ede8', marginBottom: '0.5rem' }}>Free Plan</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#f0ede8', marginBottom: '0.25rem' }}>
              ₹0<span style={{ fontSize: '1rem', fontWeight: 400, color: '#666' }}>/month</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#555', marginBottom: '2rem' }}>Up to 3 meetings/month</div>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 3rem', display: 'flex', flexDirection: 'column', gap: '1rem', flexGrow: 1 }}>
              <li style={{ fontSize: '0.875rem', color: '#888', display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: '#c9a96e' }}>✓</span> Complete AI Transcription
              </li>
              <li style={{ fontSize: '0.875rem', color: '#888', display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: '#c9a96e' }}>✓</span> TL;DR & Summaries
              </li>
              <li style={{ fontSize: '0.875rem', color: '#888', display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: '#c9a96e' }}>✓</span> Action Items Extraction
              </li>
              <li style={{ fontSize: '0.875rem', color: '#333', display: 'flex', gap: '0.5rem', textDecoration: 'line-through' }}>
                ✕ Per-speaker Sentiment
              </li>
              <li style={{ fontSize: '0.875rem', color: '#333', display: 'flex', gap: '0.5rem', textDecoration: 'line-through' }}>
                ✕ AI Semantic Search
              </li>
            </ul>

            <Link href="/signup" className="btn-secondary" style={{
              display: 'block',
              textAlign: 'center',
              padding: '0.75rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '0.875rem',
            }}>
              Start Free
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="glass-card pricing-pro" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#c9a96e', marginBottom: '0.5rem' }}>Pro Plan</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#f0ede8', marginBottom: '0.25rem' }}>
              ₹1,499<span style={{ fontSize: '1rem', fontWeight: 400, color: '#666' }}>/month</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#a4844b', marginBottom: '2rem' }}>Unlimited meetings</div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 3rem', display: 'flex', flexDirection: 'column', gap: '1rem', flexGrow: 1 }}>
              <li style={{ fontSize: '0.875rem', color: '#888', display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: '#c9a96e' }}>✓</span> <strong>Unlimited</strong> Audio Uploads
              </li>
              <li style={{ fontSize: '0.875rem', color: '#888', display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: '#c9a96e' }}>✓</span> Deep Claude summaries
              </li>
              <li style={{ fontSize: '0.875rem', color: '#888', display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: '#c9a96e' }}>✓</span> Per-speaker Sentiment score
              </li>
              <li style={{ fontSize: '0.875rem', color: '#888', display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: '#c9a96e' }}>✓</span> <strong>AI Semantic Search</strong> across calls
              </li>
              <li style={{ fontSize: '0.875rem', color: '#888', display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: '#c9a96e' }}>✓</span> Priority processing queue
              </li>
            </ul>

            <Link href="/signup" className="btn-primary" style={{
              display: 'block',
              textAlign: 'center',
              padding: '0.75rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '0.875rem',
            }}>
              Upgrade to Pro
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '6rem 2rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          background: 'radial-gradient(ellipse at center, rgba(201,169,110,0.06) 0%, rgba(0,0,0,0) 70%)',
          padding: '4rem 2rem',
          borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.02)'
        }}>
          <h2 className="heading-font" style={{ fontSize: '2rem', fontWeight: 700, color: '#f0ede8', marginBottom: '1.25rem' }}>
            Ready to reclaim your time?
          </h2>
          <p style={{ color: '#888', maxWidth: '500px', margin: '0 auto 2.5rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Join thousands of product managers, developers, and executives who use Meetwise to stay aligned.
          </p>
          <Link href="/signup" className="btn-primary" style={{
            padding: '0.875rem 2.5rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '1rem',
            display: 'inline-block'
          }}>
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #111',
        padding: '3rem 2rem',
        fontSize: '0.8rem',
        color: '#444',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div className="heading-font" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#888', marginBottom: '0.5rem' }}>
              meetwise
            </div>
            <span>© 2026 MeetWise Inc. All rights reserved.</span>
          </div>
          
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <Link href="/privacy" style={{ color: '#444', textDecoration: 'none', transition: 'color 0.2s' }}>Privacy Policy</Link>
            <Link href="/terms" style={{ color: '#444', textDecoration: 'none', transition: 'color 0.2s' }}>Terms of Service</Link>
            <Link href="/refund" style={{ color: '#444', textDecoration: 'none', transition: 'color 0.2s' }}>Refund & Cancellation</Link>
            <Link href="/contact" style={{ color: '#444', textDecoration: 'none', transition: 'color 0.2s' }}>Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
