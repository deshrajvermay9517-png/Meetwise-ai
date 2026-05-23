// app/api/upload/route.ts — audio file upload handler
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PLAN_LIMITS, safePlan } from '@/lib/types'

const MAX_FILE_SIZE_MB = 100
const ALLOWED_TYPES = ['audio/mpeg', 'audio/mp4', 'audio/m4a', 'audio/wav', 'audio/webm', 'audio/ogg', 'video/mp4']

export async function POST(req: NextRequest) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Check plan limits
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, meetings_this_month')
    .eq('id', user.id)
    .single()

  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  const plan = safePlan(profile.plan)
  const limit = PLAN_LIMITS[plan].meetings_per_month
  if (limit !== Infinity && profile.meetings_this_month >= limit) {
    return NextResponse.json({
      error: `You've reached your ${profile.plan} plan limit of ${limit} meetings/month. Upgrade to continue.`,
      upgrade_required: true,
    }, { status: 403 })
  }

  const formData = await req.formData()
  const file = formData.get('audio') as File | null
  const title = (formData.get('title') as string) || 'Untitled Meeting'

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: `Unsupported file type: ${file.type}` }, { status: 400 })
  }

  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return NextResponse.json({ error: `File too large. Max ${MAX_FILE_SIZE_MB}MB.` }, { status: 400 })
  }

  // Create meeting record first
  const { data: meeting, error: meetingError } = await supabase
    .from('meetings')
    .insert({ user_id: user.id, title, status: 'pending' })
    .select()
    .single()

  if (meetingError) return NextResponse.json({ error: meetingError.message }, { status: 500 })

  // Upload to Supabase Storage
  const ext = file.name.split('.').pop() ?? 'mp3'
  const storagePath = `${user.id}/${meeting.id}.${ext}`

  const buffer = Buffer.from(await file.arrayBuffer())
  const { error: uploadError } = await supabase.storage
    .from('audio')
    .upload(storagePath, buffer, { contentType: file.type, upsert: false })

  if (uploadError) {
    await supabase.from('meetings').delete().eq('id', meeting.id)
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  // Update meeting with audio path
  await supabase
    .from('meetings')
    .update({ audio_url: storagePath })
    .eq('id', meeting.id)

  return NextResponse.json({ meeting_id: meeting.id, message: 'Upload successful, processing started.' })
}
