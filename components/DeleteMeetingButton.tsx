'use client'
// components/DeleteMeetingButton.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function DeleteMeetingButton({ meetingId }: { meetingId: string }) {
  const [confirm, setConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (!confirm) { setConfirm(true); return }
    setDeleting(true)

    const res = await fetch(`/api/meetings/${meetingId}`, { method: 'DELETE' })
    if (res.ok) {
      router.push('/dashboard')
      router.refresh()
    } else {
      setDeleting(false)
      setConfirm(false)
    }
  }

  if (confirm) {
    return (
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.8rem', color: '#c96e6e' }}>Delete this meeting?</span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          style={{ background: '#c96e6e', color: '#fff', border: 'none', borderRadius: '5px', padding: '0.4rem 0.875rem', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          {deleting ? 'Deleting…' : 'Yes, delete'}
        </button>
        <button
          onClick={() => setConfirm(false)}
          style={{ background: 'transparent', border: '1px solid #2a2a2a', color: '#555', borderRadius: '5px', padding: '0.4rem 0.875rem', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleDelete}
      style={{ background: 'transparent', border: '1px solid #2a2a2a', color: '#444', borderRadius: '5px', padding: '0.4rem 0.875rem', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.1s' }}
      onMouseOver={e => { (e.currentTarget).style.borderColor = '#c96e6e'; (e.currentTarget).style.color = '#c96e6e' }}
      onMouseOut={e => { (e.currentTarget).style.borderColor = '#2a2a2a'; (e.currentTarget).style.color = '#444' }}
    >
      Delete meeting
    </button>
  )
}
