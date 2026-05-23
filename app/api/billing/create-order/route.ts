// app/api/billing/create-order/route.ts
// Step 1 of Razorpay checkout — create an order server-side and return
// the order ID + key ID to the frontend so it can open the Razorpay modal.
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createOrder, RAZORPAY_PLANS } from '@/lib/razorpay'

export async function POST(req: NextRequest) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Check if Razorpay is configured
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keyId || !keySecret || keyId.trim() === '' || keySecret.trim() === '') {
    return NextResponse.json({ error: 'payments_not_configured' }, { status: 400 })
  }

  // Only 'pro' plan for now
  const { plan = 'pro' } = await req.json()
  const planConfig = RAZORPAY_PLANS[plan as keyof typeof RAZORPAY_PLANS]
  if (!planConfig) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, email, full_name')
    .eq('id', user.id)
    .single()

  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  if (profile.plan === 'pro') return NextResponse.json({ error: 'Already on Pro' }, { status: 400 })

  // Create Razorpay order
  const receipt = `mw_${user.id.replace(/-/g, '').slice(0, 8)}_${Date.now()}`
  let order: { id: string; amount: number; currency: string; receipt: string }
  try {
    order = await createOrder({
      amount_paise: planConfig.amount_paise,
      currency: planConfig.currency,
      receipt,
      notes: {
        user_id: user.id,
        plan,
        email: profile.email ?? user.email ?? '',
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Razorpay error'
    console.error('[create-order]', message)
    return NextResponse.json({ error: 'Could not create payment order. Please try again.' }, { status: 502 })
  }

  // Store a pending payment record in Supabase
  await supabase.from('payments').insert({
    user_id: user.id,
    razorpay_order_id: order.id,
    plan,
    amount_paise: planConfig.amount_paise,
    currency: planConfig.currency,
    status: 'created',
  })

  return NextResponse.json({
    order_id: order.id,
    amount_paise: order.amount,
    currency: order.currency,
    key_id: process.env.RAZORPAY_KEY_ID,   // safe to expose — it's the public key
    user_name: profile.full_name ?? '',
    user_email: profile.email ?? user.email ?? '',
    plan_name: planConfig.name,
    description: planConfig.description,
  })
}
