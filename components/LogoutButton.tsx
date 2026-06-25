'use client'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'

export function LogoutButton() {
  const dialogRef = useRef<HTMLDialogElement>(null);

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

  const openModal = () => dialogRef.current?.showModal();;

  const closeModal = () => dialogRef.current?.close();

  return (
    <>
      {/* this button triggers the logout modal */}
      <button
        onClick={openModal}
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
          transition: 'color 0.2s'
        }}
        onMouseOver={e => e.currentTarget.style.color = '#c96e6e'}
        onMouseOut={e => e.currentTarget.style.color = '#666'}
      >
        <span>⎋</span> Log out
      </button>

      {/* Custom native dialog for logout */}
      <dialog 
        ref={dialogRef}
        onClose={closeModal}
        aria-labelledby='logout-dialog-title'
        style={{
          border: 'none',
          background: 'transparent',
          padding: 0,
          margin: 'auto', 
          maxWidth: '100vw',
          maxHeight: '100vh',
          overflow: 'visible'
        }}
      >
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(4px)', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            backgroundColor: '#0f0f10', 
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            maxWidth: '320px',
            width: '100%',
            fontFamily: '"DM Sans", sans-serif',
            color: '#fff'
          }}>
            <h3 id='logout-dialog-title' style={{ marginTop: 0, fontSize: '1.1rem' }}>Are you sure?</h3>
            <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '1.5rem', marginTop: '1rem' }}>
              You will be signed out of your Meetwise session.
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button 
                type="button"
                onClick={closeModal}
                style={{
                  background: 'transparent',
                  border: '1px solid #444',
                  color: '#ccc',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  transition: 'all 0.15s ease-in-out',
                }}
                onMouseOver={(e) => {e.currentTarget.style.color = "white"; e.currentTarget.style.transform = 'translateY(-0.2rem)';}}
                onMouseOut={(e) => {e.currentTarget.style.color = "#CCC"; e.currentTarget.style.transform = 'translateY(0rem)';}}
                onMouseDown={(e) => {e.currentTarget.style.color = "#CCC"; e.currentTarget.style.transform = 'translateY(0rem)';}}
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleLogout}
                style={{
                  background: '#e34545',
                  border: 'none',
                  color: '#fff',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  transition: 'all 0.15s ease-in-out',
                }}
                onMouseOver={(e) => {e.currentTarget.style.backgroundColor = '#db3636'; e.currentTarget.style.transform = 'translateY(-0.2rem)'}}
                onMouseOut={(e) => {e.currentTarget.style.backgroundColor = '#e34545'; e.currentTarget.style.transform = 'translateY(0)'}}
                onMouseDown={(e) => {e.currentTarget.style.backgroundColor = '#e34545'; e.currentTarget.style.transform = 'translateY(0)'}}
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  )
}