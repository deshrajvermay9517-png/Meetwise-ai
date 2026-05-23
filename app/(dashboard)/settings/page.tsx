// app/(dashboard)/settings/page.tsx — server wrapper
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SettingsClient } from './SettingsClient'

export default async function SettingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: payments } = await supabase
    .from('payments')
    .select('id, plan, amount_paise, currency, status, created_at, razorpay_payment_id')
    .eq('user_id', user.id)
    .eq('status', 'paid')
    .order('created_at', { ascending: false })
    .limit(12)

  return (
    <SettingsClient
      profile={profile}
      email={user.email ?? ''}
      payments={payments ?? []}
    />
  )
}
