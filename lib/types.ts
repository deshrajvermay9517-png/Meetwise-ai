// lib/types.ts — shared TypeScript types

// ─── Primitive types ──────────────────────────────────────────────────────────
export type Plan          = 'free' | 'pro'
export type MeetingStatus = 'pending' | 'transcribing' | 'analyzing' | 'done' | 'error'
export type Sentiment     = 'positive' | 'neutral' | 'negative'
export type Priority      = 'high' | 'medium' | 'low'
export type Integration   = 'slack' | 'notion'

// ─── Database row types ───────────────────────────────────────────────────────
export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  plan: Plan
  razorpay_customer_id: string | null
  razorpay_subscription_id: string | null
  meetings_this_month: number
  workspace_id: string | null
  created_at: string
  updated_at: string
}

export interface Meeting {
  id: string
  user_id: string
  workspace_id: string | null
  title: string
  audio_url: string | null
  duration_secs: number | null
  language: string
  status: MeetingStatus
  error_message: string | null
  participants: string[] | null
  created_at: string
  updated_at: string
  // joined relations (optional)
  summary?: Summary
  action_items?: ActionItem[]
  transcript?: Transcript
}

export interface Transcript {
  id: string
  meeting_id: string
  full_text: string
  segments: TranscriptSegment[] | null
  created_at: string
}

export interface TranscriptSegment {
  start: number
  end: number
  speaker: string
  text: string
}

export interface Summary {
  id: string
  meeting_id: string
  tldr: string
  body: string
  key_decisions: string[]
  topics: string[]
  sentiment_score: number
  sentiment_label: Sentiment
  speaker_sentiment: Record<string, { score: number; label: Sentiment }> | null
  created_at: string
}

export interface ActionItem {
  id: string
  meeting_id: string
  user_id: string
  text: string
  owner: string | null
  due_date: string | null
  priority: Priority
  done: boolean
  created_at: string
}

export interface Payment {
  id: string
  user_id: string
  razorpay_order_id: string
  razorpay_payment_id: string | null
  razorpay_signature: string | null
  plan: Plan
  amount_paise: number
  currency: string
  status: 'created' | 'paid' | 'failed'
  created_at: string
  updated_at: string
}

// ─── API response envelopes ───────────────────────────────────────────────────
export interface ApiOk<T>  { data: T;    error: null   }
export interface ApiError  { data: null; error: string }
export type ApiResponse<T> = ApiOk<T> | ApiError

// ─── Search ───────────────────────────────────────────────────────────────────
export interface SearchResult {
  meeting_id: string
  chunk_text: string
  similarity: number
  meeting: Pick<Meeting, 'id' | 'title' | 'created_at' | 'status'>
}

// ─── AI pipeline result (Claude output shape) ─────────────────────────────────
export interface AnalysisResult {
  tldr: string
  body: string
  key_decisions: string[]
  topics: string[]
  sentiment_score: number
  sentiment_label: Sentiment
  speaker_sentiment: Record<string, { score: number; label: Sentiment }>
  action_items: Array<{
    text: string
    owner: string | null
    due_date: string | null
    priority: Priority
  }>
}

// ─── Plan limits ──────────────────────────────────────────────────────────────
export const PLAN_LIMITS: Record<Plan, {
  meetings_per_month: number
  features: string[]
}> = {
  free: {
    meetings_per_month: 3,
    features: ['summaries', 'action_items'],
  },
  pro: {
    meetings_per_month: Infinity,
    features: ['summaries', 'action_items', 'sentiment', 'search', 'integrations'],
  },
}

// ─── Plan helpers ─────────────────────────────────────────────────────────────
export function isPro(plan: Plan): boolean {
  return plan === 'pro'
}

export function canUseFeature(plan: Plan, feature: string): boolean {
  return PLAN_LIMITS[plan].features.includes(feature)
}

/** Safely coerce any string to a valid Plan (defaults to 'free') */
export function safePlan(raw: string | null | undefined): Plan {
  return raw === 'pro' ? 'pro' : 'free'
}

// ─── Razorpay types ───────────────────────────────────────────────────────────
export interface RazorpayOrder {
  id: string
  amount: number
  currency: string
  receipt: string
}

export interface RazorpayPaymentVerification {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}
