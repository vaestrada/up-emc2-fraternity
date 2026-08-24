-- Phase 2 (README roadmap): member portal. Supabase Auth (magic links) gives
-- each member a real identity; this table is what they see and edit about
-- themselves. It is deliberately NOT the members_master.csv import target —
-- per PRIVACY.md, that 490-row roster (birthdates, home addresses, emergency
-- contacts) stays out of any AI session and out of this migration entirely.
-- This table only ever holds what a member chooses to type into their own
-- profile after signing in with their own email.

create table if not exists public.members (
  id            uuid primary key references auth.users(id) on delete cascade,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  full_name     text not null,
  nickname      text,
  batch         text,
  course        text,
  -- Quoted because current_role is a reserved word in Postgres (the SQL
  -- standard CURRENT_ROLE function). Unquoted, this file fails outright with
  -- 42601 syntax error — which is exactly why this migration had never been
  -- applied and the Member Portal was never actually live. Quoting keeps the
  -- column name byte-identical for PostgREST and supabase-js, so the eight
  -- references to `current_role` in the Portal's client code are unaffected.
  "current_role" text,
  company       text,
  city          text,
  bio           text,

  -- Portal-internal contact, distinct from their Supabase Auth login email.
  -- Both stay hidden from other members unless the matching show_* flag is on.
  contact_email text,
  contact_phone text,
  show_email    boolean not null default false,
  show_phone    boolean not null default false,

  -- private: only the member themself. brods: any signed-in member. public:
  -- also listed for signed-out visitors on /portal/directory's public teaser.
  -- Default is private — PRIVACY.md rule 3: "private by default."
  visibility    text not null default 'private'
                check (visibility in ('private', 'brods', 'public'))
);

alter table public.members enable row level security;

create index if not exists members_visibility_idx on public.members (visibility);
create index if not exists members_batch_idx on public.members (batch);

-- A member manages only their own row. This is the one table in the schema
-- where the client talks to Postgres directly under the user's own JWT
-- (every other table here goes through a service-role server action) —
-- appropriate specifically because "edit my own profile" is exactly the
-- shape auth.uid() = id RLS is built for, and it removes an unnecessary
-- server round-trip for a page a member may edit repeatedly.
create policy "members manage own row"
  on public.members for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Any signed-in member can browse other members who opted into visibility.
-- No policy grants anon (signed-out) SELECT — the directory is login-gated,
-- full stop, matching PRIVACY.md rule 3.
create policy "members browse brods-visible rows"
  on public.members for select
  to authenticated
  using (visibility in ('brods', 'public'));

-- updated_at maintenance.
create or replace function public.touch_members_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists members_touch_updated_at on public.members;
create trigger members_touch_updated_at
  before update on public.members
  for each row execute function public.touch_members_updated_at();

-- Membership dues / registration fee records. Mirrors the existing pledges
-- table's manual-reconciliation shape (self-reported reference number,
-- admin acknowledges) rather than a live checkout, because automated
-- PayMongo checkout is explicitly gated on KYB approval per the README
-- roadmap — this table is the honest interim, not a placeholder for one.
create table if not exists public.dues_payments (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  member_id    uuid references public.members(id) on delete set null,
  status       text not null default 'pending'
               check (status in ('pending', 'acknowledged')),
  name         text not null,
  batch        text,
  email        text not null,
  period       text not null,          -- e.g. "AY 2026-2027"
  amount       text,
  method       text,                   -- self-reported: GCash / Maya / Bank / Cash
  reference    text,
  message      text,
  ip           text
);

alter table public.dues_payments enable row level security;

create index if not exists dues_payments_status_created_idx
  on public.dues_payments (status, created_at desc);
create index if not exists dues_payments_member_idx
  on public.dues_payments (member_id);

-- No anon/authenticated policies — writes go through the dues server action
-- (service-role key), matching the contributions/pledges/messages pattern.
-- A member CAN read their own dues history directly, though, since that's
-- the same "my own data" shape members already get on the members table.
create policy "members read own dues history"
  on public.dues_payments for select
  to authenticated
  using (member_id = auth.uid());
