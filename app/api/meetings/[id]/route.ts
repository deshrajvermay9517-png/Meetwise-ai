// app/api/meetings/[id]/route.ts
// DELETE /api/meetings/:id — delete a meeting and all its data
// (cascade handles transcripts, summaries, action_items, embeddings via FK)
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type Params = { params: { id: string } }

export async function DELETE(_req: NextRequest, { params }: Params) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Fetch first to get the audio_url for storage cleanup
  const { data: meeting } = await supabase
    .from('meetings')
    .select('id, audio_url, user_id')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!meeting) return NextResponse.json({ error: 'Meeting not found' }, { status: 404 })

  // Delete audio file from storage (best effort — don't fail if missing)
  if (meeting.audio_url) {
    await supabase.storage.from('audio').remove([meeting.audio_url])
  }

  // Also delete embedding chunks (not FK-cascaded from meetings in all setups)
  await supabase.from('meeting_embeddings').delete().eq('meeting_id', params.id)

  // Delete the meeting row — cascades to transcripts, summaries, action_items
  const { error } = await supabase
    .from('meetings')
    .delete()
    .eq('id', params.id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
