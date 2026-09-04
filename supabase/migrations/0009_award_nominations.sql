-- The 58th Anniversary awards. PLAN.md section 6, decision D6.
--
-- Two rules from the plan are enforced by the shape of this table rather than
-- by anyone remembering them:
--
--   1. "Never let payment status be visible to judges." There is no payment
--      column here at all. If a processing fee is ever charged it is recorded
--      as a pledge, in a different table, and joined by a human — never
--      surfaced beside the nomination.
--   2. Screening precedes judging. `status` walks received -> screening ->
--      shortlisted -> judged, and the screening committee's notes live in a
--      column the judging pack does not select.

create table if not exists public.award_nominations (
  id             uuid primary key default gen_random_uuid(),
  -- The category as published; free text so a re-screened category list does
  -- not orphan existing rows.
  category       text not null,

  -- The nominee. Not necessarily the nominator (PLAN section 6).
  nominee_name   text not null,
  nominee_batch  text,
  nominee_email  text,
  nominee_known  text,                    -- where they are now, in a line

  -- The case for them, which is what judges actually read.
  citation       text not null,
  evidence       text,                    -- links, citations, references

  -- The nominator.
  nominator_name  text not null,
  nominator_batch text,
  nominator_email text not null,

  status         text not null default 'received'
                 check (status in ('received', 'screening', 'shortlisted', 'declined', 'judged')),
  screening_note text,                    -- committee only; never shown to judges
  ip             text,
  created_at     timestamptz not null default now()
);

alter table public.award_nominations enable row level security;
-- No policies: service-role only, like every other intake table. A nomination
-- names a living person and makes a public case for them; it is not readable
-- by anyone but the committee until the committee decides otherwise.

create index if not exists award_nominations_status_idx
  on public.award_nominations (status, created_at desc);
create index if not exists award_nominations_category_idx
  on public.award_nominations (category);
