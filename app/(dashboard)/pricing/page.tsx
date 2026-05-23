// app/(dashboard)/pricing/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PricingClient } from './PricingClient'

export default async function PricingPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  return <PricingClient currentPlan={profile?.plan ?? 'free'} />
}
