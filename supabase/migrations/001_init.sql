-- Enable extensions
create extension if not exists "uuid-ossp";
create extension if not exists "vector";

-- ─── USERS (extends Supabase auth.users) ────────────────────────────────────
create table public.profiles (
  id          uuid references auth.users on delete cascade primary key,
  email       text unique not null,
  full_name   text,
  avatar_url  text,
  plan        text not null default 'free' check (plan in ('free','pro')),
  razorpay_customer_id      text unique,
  razorpay_subscription_id  text unique,
  meetings_this_month int not null default 0,
  workspace_id uuid,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── WORKSPACES ──────────────────────────────────────────────────────────────
create table public.workspaces (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  owner_id    uuid references public.profiles(id) on delete cascade,
  created_at  timestamptz not null default now()
);

alter table public.workspaces enable row level security;
create policy "Workspace members can view"
  on public.workspaces for select
  using (owner_id = auth.uid() or id in (
    select workspace_id from public.profiles where id = auth.uid()
  ));

-- ─── MEETINGS ────────────────────────────────────────────────────────────────
create table public.meetings (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references public.profiles(id) on delete cascade not null,
  workspace_id  uuid references public.workspaces(id) on delete set null,
  title         text not null default 'Untitled Meeting',
  audio_url     text,                        -- Supabase Storage path
  duration_secs int,
  language      text not null default 'en',
  status        text not null default 'pending'
                  check (status in ('pending','transcribing','analyzing','done','error')),
  error_message text,
  participants  text[],                      -- detected speaker names
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.meetings enable row level security;
create policy "Users see own meetings"
  on public.meetings for select
  using (user_id = auth.uid() or workspace_id in (
    select workspace_id from public.profiles where id = auth.uid()
  ));
create policy "Users insert own meetings"
  on public.meetings for insert with check (user_id = auth.uid());
create policy "Users update own meetings"
  on public.meetings for update using (user_id = auth.uid());
create policy "Users delete own meetings"
  on public.meetings for delete using (user_id = auth.uid());

create index meetings_user_id_idx on public.meetings(user_id);
create index meetings_status_idx on public.meetings(status);

-- ─── TRANSCRIPTS ─────────────────────────────────────────────────────────────
create table public.transcripts (
  id          uuid primary key default uuid_generate_v4(),
  meeting_id  uuid references public.meetings(id) on delete cascade not null unique,
  full_text   text not null,
  segments    jsonb,   -- [{start, end, speaker, text}]
  created_at  timestamptz not null default now()
);

alter table public.transcripts enable row level security;
create policy "Users see own transcripts"
  on public.transcripts for select
  using (meeting_id in (select id from public.meetings where user_id = auth.uid()));
create policy "Users insert own transcripts"
  on public.transcripts for insert
  with check (meeting_id in (select id from public.meetings where user_id = auth.uid()));
create policy "Users update own transcripts"
  on public.transcripts for update
  using (meeting_id in (select id from public.meetings where user_id = auth.uid()));

-- ─── SUMMARIES ───────────────────────────────────────────────────────────────
create table public.summaries (
  id              uuid primary key default uuid_generate_v4(),
  meeting_id      uuid references public.meetings(id) on delete cascade not null unique,
  tldr            text not null,             -- 1–2 sentence TL;DR
  body            text not null,             -- full summary
  key_decisions   text[],
  topics          text[],
  sentiment_score float check (sentiment_score between -1 and 1),
  sentiment_label text check (sentiment_label in ('positive','neutral','negative')),
  speaker_sentiment jsonb,  -- {speaker_name: {score, label}}
  created_at      timestamptz not null default now()
);

alter table public.summaries enable row level security;
create policy "Users see own summaries"
  on public.summaries for select
  using (meeting_id in (select id from public.meetings where user_id = auth.uid()));
create policy "Users insert own summaries"
  on public.summaries for insert
  with check (meeting_id in (select id from public.meetings where user_id = auth.uid()));
create policy "Users update own summaries"
  on public.summaries for update
  using (meeting_id in (select id from public.meetings where user_id = auth.uid()));

-- ─── ACTION ITEMS ────────────────────────────────────────────────────────────
create table public.action_items (
  id          uuid primary key default uuid_generate_v4(),
  meeting_id  uuid references public.meetings(id) on delete cascade not null,
  user_id     uuid references public.profiles(id) on delete cascade not null,
  text        text not null,
  owner       text,                          -- person name extracted from transcript
  due_date    date,
  priority    text default 'medium' check (priority in ('high','medium','low')),
  done        boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table public.action_items enable row level security;
create policy "Users see own action items"
  on public.action_items for select
  using (user_id = auth.uid() or meeting_id in (
    select id from public.meetings where workspace_id in (
      select workspace_id from public.profiles where id = auth.uid()
    )
  ));
create policy "Users insert own action items"
  on public.action_items for insert
  with check (user_id = auth.uid());
create policy "Users update own action items"
  on public.action_items for update using (user_id = auth.uid());
create policy "Users delete own action items"
  on public.action_items for delete using (user_id = auth.uid());

create index action_items_meeting_id_idx on public.action_items(meeting_id);
create index action_items_done_idx on public.action_items(done);

-- ─── EMBEDDINGS (pgvector) ───────────────────────────────────────────────────
create table public.meeting_embeddings (
  id          uuid primary key default uuid_generate_v4(),
  meeting_id  uuid references public.meetings(id) on delete cascade not null,
  chunk_text  text not null,
  chunk_index int not null,
  embedding   vector(1536),                  -- OpenAI text-embedding-3-small
  created_at  timestamptz not null default now()
);

alter table public.meeting_embeddings enable row level security;
create policy "Users see own embeddings"
  on public.meeting_embeddings for select
  using (meeting_id in (select id from public.meetings where user_id = auth.uid()));
create policy "Users insert own embeddings"
  on public.meeting_embeddings for insert
  with check (meeting_id in (select id from public.meetings where user_id = auth.uid()));
create policy "Users delete own embeddings"
  on public.meeting_embeddings for delete
  using (meeting_id in (select id from public.meetings where user_id = auth.uid()));

create index meeting_embeddings_vector_idx
  on public.meeting_embeddings
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- ─── INTEGRATIONS ────────────────────────────────────────────────────────────
create table public.integrations (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references public.profiles(id) on delete cascade not null,
  provider    text not null check (provider in ('slack','notion')),
  access_token text not null,
  metadata    jsonb,
  created_at  timestamptz not null default now(),
  unique (user_id, provider)
);

alter table public.integrations enable row level security;
create policy "Users select own integrations"
  on public.integrations for select using (user_id = auth.uid());
create policy "Users insert own integrations"
  on public.integrations for insert with check (user_id = auth.uid());
create policy "Users update own integrations"
  on public.integrations for update using (user_id = auth.uid());
create policy "Users delete own integrations"
  on public.integrations for delete using (user_id = auth.uid());

-- ─── UPDATED_AT TRIGGER ──────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger set_meetings_updated_at
  before update on public.meetings
  for each row execute procedure public.set_updated_at();

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- ─── STORAGE BUCKET ─────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('audio', 'audio', false)
on conflict (id) do nothing;

-- Only allow authenticated users to upload to their own folder (user_id/*)
create policy "Users upload own audio"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'audio' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users read own audio"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'audio' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users delete own audio"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'audio' and (storage.foldername(name))[1] = auth.uid()::text);

-- ─── RPC: INCREMENT MEETING COUNT ────────────────────────────────────────────
create or replace function public.increment_meeting_count(user_id_param uuid)
returns void language sql security definer set search_path = public as $$
  update profiles
  set meetings_this_month = meetings_this_month + 1
  where id = user_id_param;
$$;

-- ─── RPC: RESET MONTHLY MEETING COUNT (run via pg_cron on 1st of month) ──────
create or replace function public.reset_monthly_meeting_counts()
returns void language sql security definer set search_path = public as $$
  update profiles set meetings_this_month = 0;
$$;

-- ─── RPC: SEMANTIC SEARCH (pgvector cosine similarity) ───────────────────────
create or replace function public.search_meetings(
  query_embedding vector(1536),
  user_id_filter  uuid,
  match_count     int     default 5,
  match_threshold float   default 0.5
)
returns table (
  meeting_id  uuid,
  chunk_text  text,
  similarity  float,
  meeting     jsonb
)
language plpgsql security definer set search_path = public as $$
begin
  return query
  select
    me.meeting_id,
    me.chunk_text,
    1 - (me.embedding <=> query_embedding) as similarity,
    jsonb_build_object(
      'id',         m.id,
      'title',      m.title,
      'created_at', m.created_at
    ) as meeting
  from public.meeting_embeddings me
  join public.meetings m on m.id = me.meeting_id
  where m.user_id = user_id_filter
    and 1 - (me.embedding <=> query_embedding) > match_threshold
  order by me.embedding <=> query_embedding
  limit match_count;
end;
$$;
