'use client'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const router = useRouter()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login?message=Logout successful')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        background: 'transparent',
        border: 'none',
        color: '#666',
        fontSize: '0.75rem',
        cursor: 'pointer',
        padding: '0.25rem 0.25rem',
        textAlign: 'left',
        width: '100%',
        marginTop: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        fontFamily: '"DM Sans", sans-serif',
        transition: 'color 0.2s',
      }}
      onMouseOver={e => e.currentTarget.style.color = '#c96e6e'}
      onMouseOut={e => e.currentTarget.style.color = '#666'}
    >
      <span>⎋</span> Log out
    </button>
  )
}
