// lib/email.ts — transactional emails via Resend
import { Resend } from 'resend'

let resend: Resend | null = null

function getResend() {
  if (resend) return resend
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey || apiKey === 're_...' || apiKey.trim() === '') {
    console.warn('[email] Resend API key is not configured. Email notifications will be skipped.')
    return null
  }
  resend = new Resend(apiKey)
  return resend
}
const FROM   = process.env.RESEND_FROM_EMAIL ?? 'noreply@meetwise.app'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://meetwise.app'

// ─── Meeting processing complete ─────────────────────────────────────────────
export async function sendMeetingReadyEmail(params: {
  to: string
  userName: string | null
  meetingId: string
  meetingTitle: string
  tldr: string
  actionItemCount: number
}) {
  const { to, userName, meetingId, meetingTitle, tldr, actionItemCount } = params
  const firstName = userName?.split(' ')[0] ?? 'there'
  const meetingUrl = `${APP_URL}/meetings/${meetingId}`

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your meeting is ready</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'DM Sans',system-ui,sans-serif;color:#f0ede8;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:40px auto;padding:0 20px;">
    <tr>
      <td>
        <!-- Logo -->
        <div style="font-size:1.25rem;font-weight:600;letter-spacing:-0.02em;color:#f0ede8;margin-bottom:32px;">
          meetwise
        </div>

        <!-- Card -->
        <div style="background:#111;border:1px solid #1f1f1f;border-radius:12px;padding:32px;">
          <p style="margin:0 0 8px;font-size:0.85rem;color:#555;text-transform:uppercase;letter-spacing:0.1em;">
            Meeting ready
          </p>
          <h1 style="margin:0 0 24px;font-size:1.5rem;font-weight:400;color:#f0ede8;line-height:1.3;">
            Hi ${firstName}, your notes are ready.
          </h1>

          <p style="margin:0 0 8px;font-size:0.75rem;color:#555;text-transform:uppercase;letter-spacing:0.08em;">
            ${meetingTitle}
          </p>

          <!-- TL;DR -->
          <div style="background:#0d0d0d;border:1px solid #1a1a1a;border-radius:8px;padding:16px;margin-bottom:20px;">
            <p style="margin:0;font-size:0.9rem;color:#aaa;line-height:1.7;font-style:italic;">
              ${tldr}
            </p>
          </div>

          ${actionItemCount > 0 ? `
          <p style="margin:0 0 20px;font-size:0.875rem;color:#666;">
            <span style="color:#c9a96e;font-weight:600;">${actionItemCount} action item${actionItemCount !== 1 ? 's' : ''}</span> extracted from this meeting.
          </p>
          ` : ''}

          <!-- CTA -->
          <a href="${meetingUrl}"
             style="display:inline-block;background:#c9a96e;color:#0a0a0a;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:700;font-size:0.9rem;">
            View full notes →
          </a>
        </div>

        <!-- Footer -->
        <p style="margin:24px 0 0;font-size:0.75rem;color:#333;text-align:center;">
          MeetWise · <a href="${APP_URL}/dashboard" style="color:#444;text-decoration:none;">Dashboard</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`

  try {
    const client = getResend()
    if (!client) {
      console.log('[email] Skipping meeting ready email (Resend not configured)')
      return
    }
    await client.emails.send({
      from: `MeetWise <${FROM}>`,
      to,
      subject: `Your notes for "${meetingTitle}" are ready`,
      html,
    })
  } catch (err) {
    // Email is non-critical — log but never throw
    console.error('[email] sendMeetingReadyEmail failed:', err)
  }
}

// ─── Payment confirmation ─────────────────────────────────────────────────────
export async function sendPaymentConfirmationEmail(params: {
  to: string
  userName: string | null
  plan: string
  amountPaise: number
}) {
  const { to, userName, plan, amountPaise } = params
  const firstName = userName?.split(' ')[0] ?? 'there'
  const amount = `₹${(amountPaise / 100).toLocaleString('en-IN')}`

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>Payment confirmed</title></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'DM Sans',system-ui,sans-serif;color:#f0ede8;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:40px auto;padding:0 20px;">
    <tr>
      <td>
        <div style="font-size:1.25rem;font-weight:600;color:#f0ede8;margin-bottom:32px;">meetwise</div>
        <div style="background:#111;border:1px solid #1f1f1f;border-radius:12px;padding:32px;">
          <div style="width:48px;height:48px;border-radius:50%;background:#0a180e;border:2px solid #6ec98a;display:flex;align-items:center;justify-content:center;margin-bottom:20px;">
            <span style="color:#6ec98a;font-size:1.25rem;">✓</span>
          </div>
          <h1 style="margin:0 0 12px;font-size:1.5rem;font-weight:400;color:#f0ede8;">
            Payment confirmed, ${firstName}!
          </h1>
          <p style="margin:0 0 24px;font-size:0.9rem;color:#666;line-height:1.7;">
            You're now on the <strong style="color:#c9a96e;">${plan}</strong> plan (${amount}/month). 
            All Pro features are unlocked.
          </p>
          <a href="${APP_URL}/dashboard"
             style="display:inline-block;background:#c9a96e;color:#0a0a0a;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:700;font-size:0.9rem;">
            Go to dashboard →
          </a>
        </div>
        <p style="margin:24px 0 0;font-size:0.75rem;color:#333;text-align:center;">
          Keep this email as your payment receipt.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`

  try {
    const client = getResend()
    if (!client) {
      console.log('[email] Skipping payment confirmation email (Resend not configured)')
      return
    }
    await client.emails.send({
      from: `MeetWise <${FROM}>`,
      to,
      subject: `Payment confirmed — Welcome to MeetWise ${plan}!`,
      html,
    })
  } catch (err) {
    console.error('[email] sendPaymentConfirmationEmail failed:', err)
  }
}
