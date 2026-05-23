import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect path, else default to /dashboard
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || origin
      return NextResponse.redirect(`${appUrl}${next}`)
    }
  }

  // return the user to an error page or login with a message
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || origin
  return NextResponse.redirect(`${appUrl}/login?error=Could not verify email. Please try again.`)
}
