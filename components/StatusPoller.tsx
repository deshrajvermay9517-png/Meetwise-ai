'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface StatusPollerProps {
  status: string
  intervalMs?: number
}

// Refreshes the server component data every `intervalMs` while the meeting
// is still processing. Stops automatically once status is done or error.
export function StatusPoller({ status, intervalMs = 5000 }: StatusPollerProps) {
  const router = useRouter()
  const isProcessing = status === 'pending' || status === 'transcribing' || status === 'analyzing'

  useEffect(() => {
    if (!isProcessing) return
    const id = setInterval(() => router.refresh(), intervalMs)
    return () => clearInterval(id)
  }, [isProcessing, intervalMs, router])

  return null  // purely behavioural, renders nothing
}
