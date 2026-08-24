-- 58th Anniversary — save-the-date interest capture.
--
-- This is deliberately NOT a ticket sale. Per PLAN.md decision D7, the
-- Association's merchant account is unresolved, so nothing here takes money.
-- What it does take is the one asset the Association does not have: a real,
-- consented list of brods who intend to come — built in September, sold to
-- in January, when tickets, sponsorship, and merch actually open.
--
-- The `interests` array is the point of the whole table. Someone who ticks
-- "sponsorship" in September is a warm call in October, when corporate
-- budgets are still open; by December that conversation has already missed.

create table if not exists public.anniversary_rsvps (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),

  -- Which edition this row belongs to, so the table survives the 59th and
  -- the 60th without a migration or a second table.
  edition      integer not null default 58,

  name         text not null,
  batch        text,
  email        text not null,

  -- Intent, not a commitment — no money has changed hands at this stage.
  attending    text not null default 'yes'
               check (attending in ('yes', 'maybe', 'cannot')),
  guests       text,

  -- Warm-list segmentation: awards, sponsorship, souvenir ad, merch,
  -- volunteering. Free-form text[] rather than an enum, because the
  -- committee will add lines to the programme faster than we migrate.
  interests    text[] not null default '{}',

  message      text,

  -- Opt-in to anniversary updates by email. Default false — PRIVACY.md
  -- rule 3, private by default. An RSVP is not consent to be mailed.
  consent_updates boolean not null default false,

  ip           text
);

alter table public.anniversary_rsvps enable row level security;

create index if not exists anniversary_rsvps_edition_created_idx
  on public.anniversary_rsvps (edition, created_at desc);

-- One row per email per edition: a brod who fills the form twice is
-- correcting themselves, not adding a second guest.
--
-- Plain columns, not lower(email), on purpose: PostgREST's on_conflict takes
-- column names and cannot name an expression index, so the upsert in the rsvp
-- server action would not be able to target it. The action lowercases the
-- address before writing instead, which gets the same case-insensitive
-- uniqueness with an index the upsert can actually use.
create unique index if not exists anniversary_rsvps_edition_email_idx
  on public.anniversary_rsvps (edition, email);

-- No anon/authenticated policies, matching contributions/pledges/messages:
-- writes go through the rsvp server action under the service-role key, and
-- nothing here is ever readable with the public anon key.
