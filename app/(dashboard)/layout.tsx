// app/(dashboard)/layout.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LogoutButton } from '@/components/LogoutButton'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, full_name, email')
    .eq('id', user.id)
    .single()

  const navItems: { href: string; icon: string; label: string; pro?: boolean }[] = [
    { href: '/dashboard', icon: '◎', label: 'Dashboard' },
    { href: '/upload',    icon: '+', label: 'New meeting' },
    { href: '/search',    icon: '⌕', label: 'Search',   pro: true },
    { href: '/settings',  icon: '⚙', label: 'Settings'  },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a', fontFamily: '"DM Sans", sans-serif' }}>
      {/* Sidebar */}
      <nav style={{
        width: '220px',
        flexShrink: 0,
        background: '#0d0d0d',
        borderRight: '1px solid #1a1a1a',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 1rem',
      }}>
        <div style={{ fontFamily: '"DM Serif Display", serif', fontSize: '1.25rem', color: '#f0ede8', letterSpacing: '-0.02em', marginBottom: '2rem', paddingLeft: '0.5rem' }}>
          meetwise
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
          {navItems.map(item => (
            <Link key={item.href} href={item.href} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.6rem 0.75rem',
              borderRadius: '6px',
              textDecoration: 'none',
              color: '#666',
              fontSize: '0.875rem',
              transition: 'all 0.1s',
            }}>
              <span style={{ fontSize: '0.9rem', color: '#444' }}>{item.icon}</span>
              {item.label}
              {item.pro && profile?.plan === 'free' && (
                <span style={{ marginLeft: 'auto', fontSize: '0.65rem', background: '#1a150a', color: '#c9a96e', border: '1px solid #c9a96e33', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>
                  Pro
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Plan badge */}
        <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '1rem', marginTop: '1rem' }}>
          {profile?.plan === 'free' && (
            <Link href="/pricing" style={{
              display: 'block',
              background: '#1a150a',
              border: '1px solid #c9a96e33',
              borderRadius: '6px',
              padding: '0.75rem',
              textDecoration: 'none',
              marginBottom: '0.75rem',
            }}>
              <div style={{ fontSize: '0.75rem', color: '#c9a96e', fontWeight: 600 }}>Upgrade to Pro</div>
              <div style={{ fontSize: '0.7rem', color: '#664e2a', marginTop: '0.25rem' }}>Unlock search, sentiment & more</div>
            </Link>
          )}
          <div style={{ fontSize: '0.75rem', color: '#666', paddingLeft: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {profile?.email}
          </div>
          <LogoutButton />
        </div>
      </nav>

      {/* Main content */}
      <main style={{ flex: 1, overflowY: 'auto' }}>{children}</main>
    </div>
  )
}
