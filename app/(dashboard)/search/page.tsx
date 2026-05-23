// app/(dashboard)/search/page.tsx — server wrapper with Pro gate
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProGate } from '@/components/ProGate'
import { SearchClient } from './SearchClient'

export default async function SearchPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  const plan = profile?.plan ?? 'free'

  return (
    <ProGate plan={plan} feature="AI search">
      <SearchClient />
    </ProGate>
  )
}
