'use client'
// app/(dashboard)/upload/page.tsx
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

const ACCEPTED = ['.mp3', '.mp4', '.m4a', '.wav', '.webm', '.ogg']

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  function handleFile(f: File) {
    setError('')
    if (f.size > 100 * 1024 * 1024) {
      setError('File too large. Max 100 MB.')
      return
    }
    setFile(f)
    if (!title) setTitle(f.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '))
  }

  async function handleUpload() {
    if (!file) return
    setUploading(true)
    setError('')

    try {
      const fd = new FormData()
      fd.append('audio', file)
      fd.append('title', title || file.name)

      const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd })
      const uploadData = await uploadRes.json()

      if (!uploadRes.ok) {
        setError(uploadData.error ?? 'Upload failed')
        return
      }

      const { meeting_id } = uploadData

      // Trigger processing. keepalive: true ensures the request survives
      // if the user navigates away before the server responds.
      fetch('/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meeting_id }),
        keepalive: true,
      })

      router.push(`/meetings/${meeting_id}`)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', padding: '3rem', maxWidth: '680px', margin: '0 auto' }}>
      <a href="/dashboard" style={{ fontSize: '0.8rem', color: '#444', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '2rem' }}>
        ← Back
      </a>

      <h1 style={{ fontFamily: '"DM Serif Display", serif', fontSize: '2rem', fontWeight: 400, color: '#f0ede8', margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>
        Upload a recording
      </h1>
      <p style={{ color: '#555', fontSize: '0.9rem', margin: '0 0 2.5rem' }}>
        Supports MP3, MP4, M4A, WAV, WebM, OGG — up to 100 MB
      </p>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? '#c9a96e' : file ? '#6ec98a' : '#2a2a2a'}`,
          borderRadius: '12px',
          padding: '3rem 2rem',
          textAlign: 'center',
          cursor: 'pointer',
          marginBottom: '1.5rem',
          background: dragging ? '#1a150a' : file ? '#0a180e' : '#111',
          transition: 'all 0.15s',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(',')}
          style={{ display: 'none' }}
          onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        {file ? (
          <div>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✓</div>
            <div style={{ color: '#6ec98a', fontWeight: 600 }}>{file.name}</div>
            <div style={{ color: '#444', fontSize: '0.8rem', marginTop: '0.25rem' }}>
              {(file.size / 1024 / 1024).toFixed(1)} MB — click to change
            </div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '2rem', color: '#333', marginBottom: '0.75rem' }}>◎</div>
            <div style={{ color: '#888', fontWeight: 500 }}>Drop your audio file here</div>
            <div style={{ color: '#444', fontSize: '0.8rem', marginTop: '0.25rem' }}>or click to browse</div>
          </div>
        )}
      </div>

      {/* Title input */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#555', marginBottom: '0.5rem' }}>
          Meeting title
        </label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="e.g. Q3 planning call"
          style={{
            width: '100%',
            background: '#111',
            border: '1px solid #2a2a2a',
            borderRadius: '8px',
            padding: '0.875rem 1rem',
            color: '#f0ede8',
            fontSize: '0.95rem',
            fontFamily: '"DM Sans", sans-serif',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {error && (
        <div style={{ background: '#180a0a', border: '1px solid #c96e6e33', borderRadius: '8px', padding: '1rem', color: '#c96e6e', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        style={{
          width: '100%',
          padding: '1rem',
          background: file && !uploading ? '#c9a96e' : '#1a1a1a',
          color: file && !uploading ? '#0a0a0a' : '#333',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: 700,
          fontFamily: '"DM Sans", sans-serif',
          cursor: file && !uploading ? 'pointer' : 'not-allowed',
          transition: 'all 0.15s',
        }}
      >
        {uploading ? 'Uploading…' : 'Upload & analyze →'}
      </button>

      <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#0d0d0d', borderRadius: '8px', border: '1px solid #1a1a1a', fontSize: '0.8rem', color: '#444' }}>
        <strong style={{ color: '#555' }}>Processing takes 1–3 minutes</strong> depending on length.
        You'll be taken to the meeting page. We'll run transcription, summary, action items, sentiment, and search indexing in the background.
      </div>
    </div>
  )
}
