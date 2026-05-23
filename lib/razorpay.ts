// lib/razorpay.ts — Razorpay client and billing helpers
// Uses placeholder env vars — add real keys after Razorpay KYC is complete.
import crypto from 'crypto'

// ─── Plan config ─────────────────────────────────────────────────────────────
export const RAZORPAY_PLANS = {
  pro: {
    name: 'MeetWise Pro',
    amount_paise: 149900,   // ₹1,499/month in paise (100 paise = ₹1)
    currency: 'INR',
    description: 'Unlimited meetings, AI search, sentiment analysis, integrations',
  },
} as const

export type RazorpayPlanKey = keyof typeof RAZORPAY_PLANS

// ─── Razorpay REST API base ───────────────────────────────────────────────────
const RAZORPAY_BASE = 'https://api.razorpay.com/v1'

function authHeader(): string {
  const key = process.env.RAZORPAY_KEY_ID ?? ''
  const secret = process.env.RAZORPAY_KEY_SECRET ?? ''
  return 'Basic ' + Buffer.from(`${key}:${secret}`).toString('base64')
}

// ─── Create an Order (step 1 of Razorpay checkout) ───────────────────────────
// Razorpay doesn't have an official Node SDK we can import without issues in
// Next.js edge/server — we call the REST API directly instead.
export async function createOrder(params: {
  amount_paise: number
  currency: string
  receipt: string         // unique string, e.g. `order_${userId}_${Date.now()}`
  notes?: Record<string, string>
}): Promise<{ id: string; amount: number; currency: string; receipt: string }> {
  const res = await fetch(`${RAZORPAY_BASE}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader(),
    },
    body: JSON.stringify({
      amount: params.amount_paise,
      currency: params.currency,
      receipt: params.receipt,
      notes: params.notes ?? {},
    }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(`Razorpay createOrder failed: ${err?.error?.description ?? res.statusText}`)
  }

  return res.json()
}

// ─── Verify payment signature (step 3 — after user pays) ─────────────────────
// Razorpay signs the response with HMAC-SHA256 using the key secret.
// IMPORTANT: verification must happen SERVER-SIDE — never trust the client alone.
export function verifyPaymentSignature(params: {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET ?? ''
  const body = `${params.razorpay_order_id}|${params.razorpay_payment_id}`
  const expected = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')
  return expected === params.razorpay_signature
}

// ─── Verify webhook signature ─────────────────────────────────────────────────
// Razorpay signs webhook payloads with HMAC-SHA256 using the webhook secret.
// This is different from the key secret — set in Razorpay Dashboard → Webhooks.
export function verifyWebhookSignature(
  rawBody: string,
  signature: string
): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET ?? ''
  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex')
  return expected === signature
}

// ─── Fetch a single payment from Razorpay (for server-side double-check) ──────
export async function fetchPayment(paymentId: string): Promise<{
  id: string
  order_id: string
  status: string   // 'captured' | 'failed' | 'authorized'
  amount: number
  currency: string
}> {
  const res = await fetch(`${RAZORPAY_BASE}/payments/${paymentId}`, {
    headers: { Authorization: authHeader() },
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(`Razorpay fetchPayment failed: ${err?.error?.description ?? res.statusText}`)
  }

  return res.json()
}
