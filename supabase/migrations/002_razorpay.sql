-- 002_razorpay.sql
-- Adds payments audit table (razorpay_customer_id and razorpay_subscription_id
-- are already on profiles from 001_init.sql)

-- ─── PAYMENTS TABLE ───────────────────────────────────────────────────────────
-- Every successful payment is recorded here for audit / refund reference
create table if not exists public.payments (
  id                   uuid primary key default uuid_generate_v4(),
  user_id              uuid references public.profiles(id) on delete cascade not null,
  razorpay_order_id    text not null unique,
  razorpay_payment_id  text unique,          -- filled after verification
  razorpay_signature   text,                 -- filled after verification
  plan                 text not null,         -- 'pro'
  amount_paise         int not null,          -- amount in paise (₹×100)
  currency             text not null default 'INR',
  status               text not null default 'created'
                         check (status in ('created','paid','failed')),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

alter table public.payments enable row level security;

create policy "Users view own payments"
  on public.payments for select
  using (user_id = auth.uid());

create policy "Users insert own payments"
  on public.payments for insert
  with check (user_id = auth.uid());

create policy "Users update own payments"
  on public.payments for update
  using (user_id = auth.uid());

create trigger set_payments_updated_at
  before update on public.payments
  for each row execute procedure public.set_updated_at();

-- Index for quick lookup by order ID (used during webhook verification)
create index payments_order_id_idx on public.payments(razorpay_order_id);
create index payments_user_id_idx  on public.payments(user_id);
