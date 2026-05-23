'use client'
// app/(dashboard)/settings/SettingsClient.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RazorpayCheckout } from '@/components/RazorpayCheckout'

interface Payment {
  id: string
  plan: string
  amount_paise: number
  currency: string
  status: string
  created_at: string
  razorpay_payment_id: string | null
}

interface Props {
  profile: {
    full_name: string | null
    plan: string
    meetings_this_month: number
  } | null
  email: string
  payments: Payment[]
}

export function SettingsClient({ profile, email, payments }: Props) {
  const router = useRouter()
  const [name, setName] = useState(profile?.full_name ?? '')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const plan = profile?.plan ?? 'free'

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaveMsg('')

    const res = await fetch('/api/account', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: name }),
    })

    setSaving(false)
    if (res.ok) {
      setSaveMsg('Saved!')
      router.refresh()
      setTimeout(() => setSaveMsg(''), 3000)
    } else {
      const d = await res.json()
      setSaveMsg(d.error ?? 'Failed to save')
    }
  }

  async function handleDeleteAccount() {
    if (!confirmDelete) { setConfirmDelete(true); return }
    setDeleting(true)

    const res = await fetch('/api/account', { method: 'DELETE' })
    if (res.ok) {
      router.push('/')
    } else {
      setDeleting(false)
      setConfirmDelete(false)
      alert('Failed to delete account. Please try again.')
    }
  }

  const sectionStyle: React.CSSProperties = {
    background: '#111',
    border: '1px solid #1f1f1f',
    borderRadius: '10px',
    padding: '1.5rem',
    marginBottom: '1.25rem',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '0.7rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#555',
    marginBottom: '1rem',
    display: 'block',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#0d0d0d',
    border: '1px solid #2a2a2a',
    borderRadius: '6px',
    padding: '0.75rem 1rem',
    color: '#f0ede8',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', padding: '2rem 3rem', maxWidth: '680px', margin: '0 auto' }}>
      <a href="/dashboard" style={{ fontSize: '0.8rem', color: '#444', textDecoration: 'none', display: 'inline-block', marginBottom: '2rem' }}>
        ← Back
      </a>

      <h1 style={{ fontFamily: '"DM Serif Display", serif', fontSize: '2rem', fontWeight: 400, color: '#f0ede8', margin: '0 0 2rem', letterSpacing: '-0.02em' }}>
        Settings
      </h1>

      {/* Profile */}
      <div style={sectionStyle}>
        <span style={labelStyle}>Profile</span>
        <form onSubmit={handleSaveName} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: '#555', display: 'block', marginBottom: '0.4rem' }}>Full name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: '#555', display: 'block', marginBottom: '0.4rem' }}>Email</label>
            <input
              value={email}
              disabled
              style={{ ...inputStyle, color: '#444', cursor: 'not-allowed' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                background: saving ? '#1a1a1a' : '#c9a96e',
                color: saving ? '#444' : '#0a0a0a',
                border: 'none',
                borderRadius: '6px',
                padding: '0.6rem 1.25rem',
                fontWeight: 700,
                fontSize: '0.875rem',
                fontFamily: 'inherit',
                cursor: saving ? 'not-allowed' : 'pointer',
              }}
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            {saveMsg && (
              <span style={{ fontSize: '0.8rem', color: saveMsg === 'Saved!' ? '#6ec98a' : '#c96e6e' }}>
                {saveMsg}
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Plan */}
      <div style={sectionStyle}>
        <span style={labelStyle}>Plan</span>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: plan === 'free' ? '1.25rem' : 0 }}>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#f0ede8', marginBottom: '0.25rem', textTransform: 'capitalize' }}>
              {plan} plan
            </div>
            <div style={{ fontSize: '0.8rem', color: '#444' }}>
              {plan === 'free'
                ? `${profile?.meetings_this_month ?? 0} / 3 meetings used this month`
                : 'Unlimited meetings · All features unlocked'}
            </div>
          </div>
          <span style={{
            fontSize: '0.75rem',
            padding: '0.25rem 0.75rem',
            borderRadius: '20px',
            background: plan === 'pro' ? '#0a180e' : '#1a1a1a',
            color: plan === 'pro' ? '#6ec98a' : '#555',
            border: `1px solid ${plan === 'pro' ? '#6ec98a33' : '#2a2a2a'}`,
            fontWeight: 600,
            textTransform: 'capitalize',
          }}>
            {plan === 'pro' ? '✓ Active' : 'Free'}
          </span>
        </div>
        {plan === 'free' && <RazorpayCheckout plan="pro" />}
      </div>

      {/* Payment history */}
      {payments.length > 0 && (
        <div style={sectionStyle}>
          <span style={labelStyle}>Payment history</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {payments.map(p => (
              <div key={p.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                background: '#0d0d0d',
                borderRadius: '6px',
                border: '1px solid #1a1a1a',
              }}>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#ccc', textTransform: 'capitalize' }}>
                    MeetWise {p.plan}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#444', marginTop: '0.15rem' }}>
                    {new Date(p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {p.razorpay_payment_id && (
                      <span style={{ marginLeft: '0.5rem', color: '#333' }}>· {p.razorpay_payment_id}</span>
                    )}
                  </div>
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f0ede8' }}>
                  ₹{(p.amount_paise / 100).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Danger zone */}
      <div style={{ ...sectionStyle, borderColor: '#2a1a1a' }}>
        <span style={{ ...labelStyle, color: '#5a3333' }}>Danger zone</span>
        <p style={{ fontSize: '0.875rem', color: '#555', marginBottom: '1rem', lineHeight: 1.6 }}>
          Permanently delete your account and all data — meetings, transcripts, summaries, and recordings. This cannot be undone.
        </p>
        {confirmDelete && (
          <div style={{ background: '#180a0a', border: '1px solid #c96e6e33', borderRadius: '6px', padding: '0.875rem', marginBottom: '0.75rem', fontSize: '0.85rem', color: '#c96e6e' }}>
            Are you sure? Click the button again to permanently delete everything.
          </div>
        )}
        <button
          onClick={handleDeleteAccount}
          disabled={deleting}
          style={{
            background: confirmDelete ? '#c96e6e' : 'transparent',
            color: confirmDelete ? '#fff' : '#555',
            border: '1px solid #2a2a2a',
            borderRadius: '6px',
            padding: '0.6rem 1.25rem',
            fontWeight: 600,
            fontSize: '0.875rem',
            fontFamily: 'inherit',
            cursor: deleting ? 'not-allowed' : 'pointer',
          }}
        >
          {deleting ? 'Deleting…' : confirmDelete ? 'Yes, delete my account' : 'Delete account'}
        </button>
        {confirmDelete && !deleting && (
          <button
            onClick={() => setConfirmDelete(false)}
            style={{ background: 'transparent', border: 'none', color: '#444', cursor: 'pointer', fontSize: '0.8rem', marginLeft: '1rem', fontFamily: 'inherit' }}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}
