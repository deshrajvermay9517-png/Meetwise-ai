// app/(dashboard)/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Meeting } from '@/lib/types'
import { Greeting } from '@/components/Greeting'
import { MeetingCard } from '@/components/MeetingCard'
import { UpgradeBanner } from '@/components/UpgradeBanner'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: meetings } = await supabase
    .from('meetings')
    .select('*, summaries(tldr, sentiment_label), action_items(id, done)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  const done = (meetings ?? []).filter((m: any) => m.status === 'done').length
  const pending = (meetings ?? []).filter((m: any) => ['pending', 'transcribing', 'analyzing'].includes(m.status)).length
  const openActions = (meetings ?? []).flatMap((m: any) => (m.action_items ?? []).filter((a: any) => !a.done)).length

  // Calculate usage percentage for free plans
  const meetingsLimit = 3
  const meetingsUsed = profile?.meetings_this_month ?? 0
  const usagePercentage = Math.min((meetingsUsed / meetingsLimit) * 100, 100)

  return (
    <div className="dashboard-content" style={{
      fontFamily: '"DM Sans", sans-serif',
      padding: '3rem',
      maxWidth: '1000px',
      margin: '0 auto',
      background: '#0a0a0a',
      minHeight: '100vh',
      color: '#f0ede8'
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .dash-card {
          background: rgba(18, 18, 18, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          padding: 1.5rem;
          backdrop-filter: blur(8px);
          transition: all 0.2s ease;
        }
        .dash-card:hover {
          border-color: rgba(201, 169, 110, 0.15);
          background: rgba(22, 22, 22, 0.8);
        }
        .search-trigger {
          background: rgba(18, 18, 18, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.03);
          transition: all 0.2s ease;
        }
        .search-trigger:hover {
          border-color: rgba(255, 255, 255, 0.08);
          background: rgba(25, 25, 25, 0.8);
        }
        .btn-new-meeting {
          background: linear-gradient(135deg, #c9a96e 0%, #a4844b 100%);
          color: #0a0a0a;
          box-shadow: 0 4px 12px rgba(201, 169, 110, 0.15);
          transition: all 0.2s ease;
        }
        .btn-new-meeting:hover {
          transform: scale(1.02);
          box-shadow: 0 6px 16px rgba(201, 169, 110, 0.3);
        }
        @media (max-width: 768px) {
          .dashboard-content {
            padding: 2rem 1.5rem !important;
          }
          .stats-grid {
            grid-template-columns: 1fr !important;
          }
          .header-row {
            flex-direction: column;
            gap: 1.5rem;
            align-items: stretch !important;
          }
          .btn-new-meeting {
            text-align: center;
          }
        }
      ` }} />

      <UpgradeBanner />

      {/* Header */}
      <div className="header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <Greeting name={profile?.full_name} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', background: profile?.plan === 'pro' ? 'rgba(201,169,110,0.1)' : 'rgba(255,255,255,0.05)', color: profile?.plan === 'pro' ? '#c9a96e' : '#888', border: profile?.plan === 'pro' ? '1px solid rgba(201,169,110,0.2)' : '1px solid rgba(255,255,255,0.1)', padding: '0.15rem 0.5rem', borderRadius: '4px', textTransform: 'capitalize', fontWeight: 600 }}>
              {profile?.plan === 'pro' ? 'Pro Plan' : 'Free Plan'}
            </span>
            <span style={{ color: '#333' }}>•</span>
            <span style={{ color: '#666', fontSize: '0.85rem' }}>
              {profile?.plan === 'free' ? `${meetingsUsed} of ${meetingsLimit} monthly meetings used` : 'Unlimited meetings'}
            </span>
          </div>

          {/* Usage progress bar for Free users */}
          {profile?.plan === 'free' && (
            <div style={{ marginTop: '0.75rem', width: '200px' }}>
              <div style={{ background: '#1a1a1a', height: '4px', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${usagePercentage}%`, height: '100%', background: usagePercentage >= 100 ? '#c96e6e' : '#c9a96e', borderRadius: '2px' }} />
              </div>
            </div>
          )}
        </div>

        <Link href="/upload" className="btn-new-meeting" style={{
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 700,
          fontSize: '0.9rem',
        }}>
          + New Meeting
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {[
          { label: 'Meetings Processed', value: done },
          { label: 'Processing Now', value: pending },
          { label: 'Open Action Items', value: openActions },
        ].map((s, i) => (
          <div key={i} className="dash-card">
            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#f0ede8', letterSpacing: '-0.03em', fontFamily: 'Outfit, sans-serif' }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search trigger */}
      <div style={{ marginBottom: '2.5rem' }}>
        <Link href="/search" className="search-trigger" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          borderRadius: '10px',
          padding: '0.875rem 1.25rem',
          textDecoration: 'none',
          color: '#555',
          fontSize: '0.9rem',
        }}>
          <span style={{ fontSize: '1.1rem', color: '#c9a96e' }}>⌕</span>
          Search across all your meetings…
          <span style={{ marginLeft: 'auto', fontSize: '0.7rem', background: 'rgba(255,255,255,0.03)', color: '#888', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)' }}>
            {profile?.plan === 'free' ? '⚡ Pro Feature' : '⌘K'}
          </span>
        </Link>
      </div>

      {/* Meetings List Header */}
      <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.1rem', fontWeight: 600, color: '#f0ede8', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '0.5rem' }}>
        Recent Meetings
      </h3>

      {/* Meetings list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {(!meetings || meetings.length === 0) && (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', color: '#444', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '12px', background: 'rgba(18,18,18,0.2)' }}>
            <div style={{ fontSize: '2.5rem', color: 'rgba(201,169,110,0.3)', marginBottom: '1.25rem' }}>◎</div>
            <h4 style={{ fontSize: '1.05rem', margin: '0 0 0.5rem', color: '#888', fontWeight: 600 }}>No meetings yet</h4>
            <p style={{ fontSize: '0.85rem', color: '#555', margin: '0 0 2rem', maxWidth: '300px', marginInline: 'auto' }}>
              Upload your first recording or meeting notes to unlock transcripts, summaries, and action items.
            </p>
            <Link href="/upload" className="btn-new-meeting" style={{
              display: 'inline-block',
              padding: '0.6rem 1.5rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
            }}>
              Upload Meeting
            </Link>
          </div>
        )}

        {(meetings ?? []).map((meeting: any) => (
          <MeetingCard
            key={meeting.id}
            id={meeting.id}
            title={meeting.title}
            status={meeting.status}
            tldr={meeting.summaries?.[0]?.tldr}
            sentimentLabel={meeting.summaries?.[0]?.sentiment_label}
            openActions={(meeting.action_items ?? []).filter((a: any) => !a.done).length}
            durationSecs={meeting.duration_secs}
            createdAt={meeting.created_at}
          />
        ))}
      </div>
    </div>
  )
}
