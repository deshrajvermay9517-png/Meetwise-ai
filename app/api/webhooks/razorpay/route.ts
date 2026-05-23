// app/api/webhooks/razorpay/route.ts
// Razorpay sends signed webhook events here for payment lifecycle events.
// This is a server-to-server backup — Pro is already granted in verify-payment,
// but webhooks catch edge cases like bank delays or direct subscription events.
import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature } from '@/lib/razorpay'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!   // service role — no user session here
  )
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signature = req.headers.get('x-razorpay-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  // ── Verify webhook signature ──────────────────────────────────────────────
  const valid = verifyWebhookSignature(rawBody, signature)
  if (!valid) {
    console.error('[razorpay webhook] Invalid signature')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  let event: any
  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const supabase = getServiceClient()
  const eventType: string = event.event

  console.log(`[razorpay webhook] Received: ${eventType}`)

  try {
    switch (eventType) {

      // ── Payment captured (successful) ──────────────────────────────────────
      case 'payment.captured': {
        const payment = event.payload?.payment?.entity
        if (!payment) break

        const orderId: string = payment.order_id
        const paymentId: string = payment.id

        // Find our payment record by order ID
        const { data: paymentRecord } = await supabase
          .from('payments')
          .select('user_id, plan, status')
          .eq('razorpay_order_id', orderId)
          .single()

        if (!paymentRecord) {
          console.warn(`[webhook] No payment record for order ${orderId}`)
          break
        }

        if (paymentRecord.status === 'paid') {
          console.log(`[webhook] Already processed order ${orderId}`)
          break
        }

        // Grant Pro access
        await supabase
          .from('profiles')
          .update({ plan: paymentRecord.plan })
          .eq('id', paymentRecord.user_id)

        await supabase
          .from('payments')
          .update({ razorpay_payment_id: paymentId, status: 'paid' })
          .eq('razorpay_order_id', orderId)

        console.log(`[webhook] ✓ payment.captured — user ${paymentRecord.user_id} → ${paymentRecord.plan}`)
        break
      }

      // ── Payment failed ──────────────────────────────────────────────────────
      case 'payment.failed': {
        const payment = event.payload?.payment?.entity
        if (!payment) break

        await supabase
          .from('payments')
          .update({ status: 'failed' })
          .eq('razorpay_order_id', payment.order_id)

        console.log(`[webhook] payment.failed — order ${payment.order_id}`)
        break
      }

      // ── Subscription events (for future recurring billing) ─────────────────
      case 'subscription.activated': {
        const sub = event.payload?.subscription?.entity
        if (!sub?.notes?.user_id) break

        await supabase
          .from('profiles')
          .update({ razorpay_subscription_id: sub.id, plan: 'pro' })
          .eq('id', sub.notes.user_id)

        console.log(`[webhook] subscription.activated — user ${sub.notes.user_id}`)
        break
      }

      case 'subscription.cancelled':
      case 'subscription.completed': {
        const sub = event.payload?.subscription?.entity
        if (!sub?.notes?.user_id) break

        await supabase
          .from('profiles')
          .update({ razorpay_subscription_id: null, plan: 'free' })
          .eq('id', sub.notes.user_id)

        console.log(`[webhook] ${eventType} — user ${sub.notes.user_id} → free`)
        break
      }

      default:
        // Acknowledge but ignore other events
        break
    }
  } catch (err) {
    console.error(`[webhook] Handler error for ${eventType}:`, err)
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
