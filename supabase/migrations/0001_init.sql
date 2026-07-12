-- EMC² site — submission persistence + moderation.
-- RLS is enabled with NO anon/authenticated policies, so the public anon key
-- can neither read nor write these tables. All writes go through server actions
-- using the service-role key (which bypasses RLS). This is defense-in-depth:
-- even if the anon key leaks, submissions stay private.

create table if not exists public.contributions (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  status      text not null default 'pending'
              check (status in ('pending', 'approved', 'rejected')),
  name        text not null,
  batch       text,
  email       text not null,
  kind        text,
  title       text not null,
  details     text not null,
  links       text,
  photo_paths text[] not null default '{}',
  ip          text
);

create table if not exists public.pledges (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  status      text not null default 'pending'
              check (status in ('pending', 'acknowledged')),
  name        text not null,
  batch       text,
  email       text not null,
  cause       text,
  amount      text,
  reference   text,
  message     text,
  ip          text
);

create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  email       text not null,
  topic       text,
  message     text not null,
  ip          text
);

alter table public.contributions enable row level security;
alter table public.pledges       enable row level security;
alter table public.messages      enable row level security;

create index if not exists contributions_status_created_idx
  on public.contributions (status, created_at desc);
create index if not exists pledges_status_created_idx
  on public.pledges (status, created_at desc);
create index if not exists messages_created_idx
  on public.messages (created_at desc);
