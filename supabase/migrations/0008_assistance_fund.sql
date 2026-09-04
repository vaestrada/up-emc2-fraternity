-- The Brotherhood Assistance Fund.
--
-- PLAN.md §3 and decision D1. Three layers, deliberately separated, and the
-- separation is the whole design:
--
--   Layer 1  a PUBLIC PROGRAMME page. It describes the programme — never a
--            case. No names, no diagnoses, no photographs of anyone's family.
--            That is what makes this lawful and dignified at once: we publish
--            a promise, not a sick person.
--   Layer 2  PRIVATE INTAKE (this file). A request from a signed-in brod goes
--            to the board and to nobody else. RLS on, no policies, so not even
--            the brod who filed it can read it back through the API.
--   Layer 3  PRIVATE GIVING, PUBLIC HONOUR. Giving happens off-platform
--            (D3); a giver who opts in joins the Roll of Patrons by name and
--            batch, never amount. That already exists — lib/patrons.ts and
--            pledges.consent_public — and is reused rather than rebuilt.
--
-- Why not the obvious build. A public case page with a progress bar raises
-- more per case and is a real liability: health information about a brod, and
-- especially about a brod's spouse or parent, is SENSITIVE personal
-- information under RA 10173, and a case page processes it about a third
-- party who never consented. Hence D1: requests never appear publicly.

-- ---------------------------------------------------------------------------
-- 1) Private intake.
-- ---------------------------------------------------------------------------
create table if not exists public.assistance_requests (
  id           uuid primary key default gen_random_uuid(),
  -- Set when the request comes from a signed-in brod, which is the only way
  -- the form is reachable. Null tolerated so a board member can log a request
  -- that arrived by phone.
  member_id    uuid references auth.users (id) on delete set null,
  name         text not null,
  batch        text,
  email        text not null,
  phone        text,
  -- Who the request is for. "self" or a relation; never a named third party.
  relation     text not null default 'self',
  kind         text not null,           -- hospitalisation, bereavement, calamity, other
  summary      text not null,
  amount_needed text,
  urgency      text,
  status       text not null default 'received'
               check (status in ('received', 'reviewing', 'assisted', 'declined', 'closed')),
  board_note   text,
  decided_at   timestamptz,
  ip           text,
  created_at   timestamptz not null default now()
);

alter table public.assistance_requests enable row level security;
-- No policies at all. Deliberate, and stricter than the other intake tables:
-- a request may name a brod's illness or a death in their family, so it is
-- readable only by the service role behind the /admin password.

create index if not exists assistance_requests_status_idx
  on public.assistance_requests (status, created_at desc);
create index if not exists assistance_requests_member_idx
  on public.assistance_requests (member_id);

-- ---------------------------------------------------------------------------
-- 2) The transparency ledger.
--
-- Published on the programme page: raised, disbursed, balance, brods assisted.
-- PLAN.md §3 is blunt about why this earns its place — it is the single thing
-- that determines whether someone gives a SECOND time.
--
-- No names on either side, enforced by the shape of the table: there is no
-- column for one. A note says "hospitalisation assistance", never who.
-- ---------------------------------------------------------------------------
create table if not exists public.assistance_ledger (
  id          uuid primary key default gen_random_uuid(),
  entry_date  date not null default current_date,
  direction   text not null check (direction in ('raised', 'disbursed')),
  amount      numeric(12, 2) not null check (amount > 0),
  -- Public, and deliberately impersonal. Reviewed by the board before entry.
  note        text,
  -- Counts toward "brods assisted" on the public page. Set on disbursements.
  beneficiaries int not null default 0 check (beneficiaries >= 0),
  created_at  timestamptz not null default now()
);

alter table public.assistance_ledger enable row level security;

-- The ledger is the one assistance table the public may read: that is its
-- entire purpose. It carries no personal data by construction.
drop policy if exists "assistance ledger is public" on public.assistance_ledger;
create policy "assistance ledger is public"
  on public.assistance_ledger
  for select
  to anon, authenticated
  using (true);

create index if not exists assistance_ledger_date_idx
  on public.assistance_ledger (entry_date desc);

-- ---------------------------------------------------------------------------
-- 3) The public totals, as a view, so the page runs one query and no client
--    ever sees individual entries unless it asks for them.
-- ---------------------------------------------------------------------------
create or replace view public.assistance_totals as
  select
    coalesce(sum(amount) filter (where direction = 'raised'), 0)::numeric(12, 2)    as raised,
    coalesce(sum(amount) filter (where direction = 'disbursed'), 0)::numeric(12, 2) as disbursed,
    coalesce(sum(amount) filter (where direction = 'raised'), 0)::numeric(12, 2)
      - coalesce(sum(amount) filter (where direction = 'disbursed'), 0)::numeric(12, 2) as balance,
    coalesce(sum(beneficiaries) filter (where direction = 'disbursed'), 0)::int      as brods_assisted,
    count(*)::int                                                                    as entries
  from public.assistance_ledger;

-- A view runs with the privileges of its owner unless told otherwise; make it
-- respect the caller's RLS so it can never become a way around the policies
-- above. The underlying table is public-select anyway, but the next person to
-- add a table to this view should inherit the safe default.
alter view public.assistance_totals set (security_invoker = on);

grant select on public.assistance_totals to anon, authenticated, service_role;
