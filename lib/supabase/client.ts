// lib/supabase/client.ts — browser client for 'use client' components
import { createBrowserClient } from '@supabase/ssr'

// Singleton so we don't create a new client on every render
let client: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key || url.startsWith('https://your-') || key === 'your-anon-key') {
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        signInWithPassword: async () => ({ error: new Error('Supabase is not configured') }),
        signUp: async () => ({ error: new Error('Supabase is not configured') }),
        signOut: async () => ({ error: null }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: null }),
          }),
        }),
      }),
    } as any
  }

  if (!client) {
    client = createBrowserClient(url, key)
  }
  return client
}
