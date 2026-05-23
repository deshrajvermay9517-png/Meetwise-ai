// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.startsWith('https://your-') || supabaseAnonKey === 'your-anon-key') {
    const mockQuery = {
      select: () => mockQuery,
      insert: () => mockQuery,
      update: () => mockQuery,
      delete: () => mockQuery,
      eq: () => mockQuery,
      order: () => mockQuery,
      limit: () => mockQuery,
      single: async () => ({ data: null, error: null }),
    }

    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        signOut: async () => ({ error: null }),
        exchangeCodeForSession: async () => ({ data: {}, error: null }),
      },
      from: () => mockQuery,
      rpc: async () => ({ data: null, error: null }),
    } as any
  }

  const cookieStore = cookies()
  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet: any) {
          try {
            cookiesToSet.forEach(({ name, value, options }: any) => cookieStore.set(name, value, options))
          } catch {}
        },
      },
    }
  )
}
