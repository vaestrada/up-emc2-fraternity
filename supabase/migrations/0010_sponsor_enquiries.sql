-- Sponsorship and souvenir-programme advertising. PLAN.md §5 ranks these the
-- two largest revenue lines, and §5's cash discipline is the reason this is a
-- pipeline table rather than a contact form:
--
--   "Do not count unsigned or unpaid pledges as available cash."
--
-- So `stage` walks enquiry -> proposal_sent -> committed -> paid, and only
-- `paid` means money. The 2025 Sportsfest reported PHP 294,050 of revenue
-- against PHP 136,050 actually collected; that gap is exactly what
-- amount_expected and amount_paid exist to keep visibly apart.

create table if not exists public.sponsor_enquiries (
  id            uuid primary key default gen_random_uuid(),

  organisation  text not null,
  contact_name  text not null,
  email         text not null,
  phone         text,
  -- The brod who opened the door, which is how most of these actually arrive.
  introduced_by text,

  interest      text not null,          -- sponsorship, souvenir ad, or both
  tier          text,
  amount_expected numeric(12, 2),
  amount_paid     numeric(12, 2) not null default 0,

  message       text,
  stage         text not null default 'enquiry'
                check (stage in ('enquiry', 'proposal_sent', 'committed', 'paid', 'declined')),
  committee_note text,
  ip            text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.sponsor_enquiries enable row level security;
-- Service-role only. A sponsor's terms are commercial information and are not
-- public until the sponsor is announced.

create index if not exists sponsor_enquiries_stage_idx
  on public.sponsor_enquiries (stage, created_at desc);

create or replace function public.touch_sponsor_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists sponsor_enquiries_touch on public.sponsor_enquiries;
create trigger sponsor_enquiries_touch
  before update on public.sponsor_enquiries
  for each row execute function public.touch_sponsor_updated_at();

revoke execute on function public.touch_sponsor_updated_at() from public, anon, authenticated;
grant execute on function public.touch_sponsor_updated_at() to service_role;
