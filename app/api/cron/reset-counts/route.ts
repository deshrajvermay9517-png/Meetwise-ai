// app/api/cron/reset-counts/route.ts
// Called by Vercel Cron on the 1st of every month at 00:00 UTC.
// Uses the service role client — no user session exists in cron context.
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET(req: Request) {
  // Verify this is being called by Vercel Cron (or your own cron runner)
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getServiceClient()
  const { error } = await supabase.rpc('reset_monthly_meeting_counts')

  if (error) {
    console.error('[cron] reset_monthly_meeting_counts failed:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  console.log('[cron] Monthly meeting counts reset successfully')
  return NextResponse.json({ success: true, reset_at: new Date().toISOString() })
}
