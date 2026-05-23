// app/api/billing/verify-payment/route.ts
// Step 3 of Razorpay checkout — verify the payment signature SERVER-SIDE.
// Pro access is ONLY granted here after cryptographic verification passes.
// Never trust the client to self-report payment success.
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyPaymentSignature, fetchPayment } from '@/lib/razorpay'
import { sendPaymentConfirmationEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: 'Missing payment fields' }, { status: 400 })
  }

  // ── 1. Verify HMAC signature ──────────────────────────────────────────────
  const signatureValid = verifyPaymentSignature({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  })

  if (!signatureValid) {
    console.error(`[verify] Invalid signature for order ${razorpay_order_id}`)
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
  }

  // ── 2. Double-check payment status directly with Razorpay API ────────────
  // Prevents replay attacks — someone sending a real signature for a different order.
  let payment
  try {
    payment = await fetchPayment(razorpay_payment_id)
  } catch (err) {
    console.error('[verify] Could not fetch payment from Razorpay:', err)
    return NextResponse.json({ error: 'Could not verify payment with Razorpay' }, { status: 502 })
  }

  if (payment.order_id !== razorpay_order_id) {
    console.error(`[verify] order_id mismatch: ${payment.order_id} vs ${razorpay_order_id}`)
    return NextResponse.json({ error: 'Order ID mismatch' }, { status: 400 })
  }

  if (payment.status !== 'captured') {
    console.error(`[verify] Payment not captured: ${payment.status}`)
    return NextResponse.json({ error: `Payment not captured (status: ${payment.status})` }, { status: 400 })
  }

  // ── 3. Confirm this order belongs to this user ────────────────────────────
  const { data: existingPayment } = await supabase
    .from('payments')
    .select('id, user_id, status, plan')
    .eq('razorpay_order_id', razorpay_order_id)
    .single()

  if (!existingPayment) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  if (existingPayment.user_id !== user.id) {
    console.error(`[verify] User mismatch: ${existingPayment.user_id} vs ${user.id}`)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (existingPayment.status === 'paid') {
    // Idempotent — already processed (e.g. user hit back and resubmitted)
    return NextResponse.json({ success: true, already_processed: true })
  }

  // ── 4. All checks passed — grant Pro access ───────────────────────────────
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ plan: existingPayment.plan })
    .eq('id', user.id)

  if (updateError) {
    console.error('[verify] Failed to update profile plan:', updateError)
    return NextResponse.json({ error: 'Failed to activate plan' }, { status: 500 })
  }

  // Mark payment as paid
  await supabase
    .from('payments')
    .update({
      razorpay_payment_id,
      razorpay_signature,
      status: 'paid',
    })
    .eq('razorpay_order_id', razorpay_order_id)

  // Send confirmation email (non-blocking)
  const { data: profile } = await supabase
    .from('profiles')
    .select('email, full_name')
    .eq('id', user.id)
    .single()

  if (profile?.email) {
    await sendPaymentConfirmationEmail({
      to: profile.email,
      userName: profile.full_name,
      plan: existingPayment.plan,
      amountPaise: payment.amount,
    })
  }

  console.log(`[verify] ✓ Payment verified — user ${user.id} → ${existingPayment.plan}`)
  return NextResponse.json({ success: true })
}
