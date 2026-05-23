'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'

function UpgradeBannerInner() {
  const params = useSearchParams()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (params.get('upgraded') === 'true') {
      setShow(true)
      const url = new URL(window.location.href)
      url.searchParams.delete('upgraded')
      window.history.replaceState({}, '', url.toString())
      const t = setTimeout(() => setShow(false), 6000)
      return () => clearTimeout(t)
    }
  }, [params])

  if (!show) return null

  return (
    <div style={{
      background: '#0a180e',
      border: '1px solid #6ec98a33',
      borderRadius: '10px',
      padding: '1rem 1.5rem',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ color: '#6ec98a', fontSize: '1.25rem' }}>✓</span>
        <div>
          <div style={{ color: '#6ec98a', fontWeight: 600, fontSize: '0.9rem' }}>You're upgraded!</div>
          <div style={{ color: '#3a6e4a', fontSize: '0.8rem', marginTop: '0.1rem' }}>All Pro features are now unlocked.</div>
        </div>
      </div>
      <button
        onClick={() => setShow(false)}
        style={{ background: 'transparent', border: 'none', color: '#3a6e4a', cursor: 'pointer', fontSize: '1rem', padding: '0.25rem' }}
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  )
}

export function UpgradeBanner() {
  return (
    <Suspense fallback={null}>
      <UpgradeBannerInner />
    </Suspense>
  )
}
