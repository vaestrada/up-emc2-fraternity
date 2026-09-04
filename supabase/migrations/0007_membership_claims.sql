-- Claim your record: let a brod ask for Portal access, without ever importing
-- the roster.
--
-- The problem this solves. Portal access today is granted one email at a time
-- by a board member typing into /admin. That is correct and safe, and it does
-- not reach 490 brods. PLAN.md §4 is explicit that the member list built in
-- September is what everything is sold to in January, so the bottleneck is the
-- board's typing speed, which is the wrong thing for growth to depend on.
--
-- What this does NOT do. It does not verify anyone. The 490-row roster stays
-- offline (PRIVACY.md rule 4) and no code here can check a claim against it.
-- A claim is a *request*: the brod supplies what they know, the board matches
-- it against the roster they hold offline, and only then does grant_member run.
-- The work moves from typing to deciding, which is the part only a human with
-- the roster can do.
--
-- Raw email lifetime. A pending claim holds the raw email because the board
-- needs it to send the invite. The moment a claim is decided, the raw email is
-- nulled and only the HMAC and the masked label remain — the same zero-raw-PII
-- posture as member_allowlist. A decided claim can still be recognised (the
-- hash dedupes repeat requests) but no longer stores an address.

-- ---------------------------------------------------------------------------
-- 1) The table. Service-role only, like contributions and pledges.
-- ---------------------------------------------------------------------------
create table if not exists public.membership_claims (
  id           uuid primary key default gen_random_uuid(),
  full_name    text not null,
  batch        text not null,
  -- Present only while pending; nulled by decide_membership_claim.
  email        text,
  -- HMAC of the email, so a decided claim still dedupes without raw PII.
  email_hash   text not null,
  label        text,                    -- masked email, e.g. "jo***@g***"
  nickname     text,                    -- how the roster may list them
  vouch        text,                    -- a brod who can confirm them
  note         text,
  status       text not null default 'pending'
               check (status in ('pending', 'approved', 'rejected')),
  decided_at   timestamptz,
  decided_note text,
  ip           text,
  created_at   timestamptz not null default now()
);

alter table public.membership_claims enable row level security;
-- Deliberately no anon/authenticated policies: a claim is visible only to the
-- service role (the /admin queue). A brod cannot read anyone's claim, not even
-- their own, because there is nothing useful in it for them and everything
-- sensitive in it for someone else.

create unique index if not exists membership_claims_email_hash_key
  on public.membership_claims (email_hash);
create index if not exists membership_claims_status_idx
  on public.membership_claims (status, created_at desc);

-- ---------------------------------------------------------------------------
-- 2) Submit. Hashing and masking happen inside Postgres so the application
--    never sees portal_config.app_secret.
-- ---------------------------------------------------------------------------
create or replace function public.submit_membership_claim(
  p_full_name text,
  p_batch     text,
  p_email     text,
  p_nickname  text default null,
  p_vouch     text default null,
  p_note      text default null,
  p_ip        text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  h      text;
  secret text;
  v_id   uuid;
begin
  secret := (select app_secret from public.portal_config where id = 1);
  if secret is null or secret = '' then
    raise exception 'portal allowlist secret is not provisioned';
  end if;

  h := public.allowlist_hash(p_email);

  -- A brod who submits twice is correcting their details, not queueing twice.
  -- Re-submitting after a rejection reopens the claim, which is the humane
  -- behaviour: people mistype their own batch.
  insert into public.membership_claims
    (full_name, batch, email, email_hash, label, nickname, vouch, note, ip)
  values
    (trim(p_full_name), trim(p_batch), lower(trim(p_email)), h,
     public.mask_email(p_email), nullif(trim(p_nickname), ''),
     nullif(trim(p_vouch), ''), nullif(trim(p_note), ''), p_ip)
  on conflict (email_hash) do update set
    full_name  = excluded.full_name,
    batch      = excluded.batch,
    email      = excluded.email,
    label      = excluded.label,
    nickname   = excluded.nickname,
    vouch      = excluded.vouch,
    note       = excluded.note,
    status     = 'pending',
    decided_at = null,
    created_at = now()
  returning id into v_id;

  return v_id;
end $$;

-- ---------------------------------------------------------------------------
-- 3) Decide. Purges the raw email whichever way the decision goes.
-- ---------------------------------------------------------------------------
create or replace function public.decide_membership_claim(
  p_id     uuid,
  p_status text,
  p_note   text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare h text;
begin
  if p_status not in ('approved', 'rejected') then
    raise exception 'invalid claim status: %', p_status;
  end if;

  update public.membership_claims
     set status       = p_status,
         decided_at   = now(),
         decided_note = nullif(trim(p_note), ''),
         email        = null          -- raw PII does not outlive the decision
   where id = p_id
  returning email_hash into h;

  if h is not null then
    insert into public.portal_access_log (action, meta)
    values ('claim_' || p_status, jsonb_build_object('email_hash', h));
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 4) Grants. Two separate doors have to be shut, which is the lesson 0006
--    learned the hard way:
--      * Postgres grants EXECUTE to PUBLIC on every new function; and
--      * Supabase's ALTER DEFAULT PRIVILEGES grants EXECUTE to anon and
--        authenticated *explicitly*, so revoking from PUBLIC alone leaves the
--        function callable at /rest/v1/rpc/... by anyone with the anon key.
--    Revoke from all three, then grant narrowly. Verified with the security
--    advisor, which flags exactly this (lints 0028 and 0029).
-- ---------------------------------------------------------------------------
revoke execute on function public.submit_membership_claim(text, text, text, text, text, text, text) from public, anon, authenticated;
revoke execute on function public.decide_membership_claim(uuid, text, text)                          from public, anon, authenticated;

grant execute on function public.submit_membership_claim(text, text, text, text, text, text, text) to service_role;
grant execute on function public.decide_membership_claim(uuid, text, text) to service_role;
