-- Phase 2 hardening: enforce "verified members only" on the member portal.
--
-- Closes the exploit where ANY email could receive a magic link and, via the
-- own-row RLS policy on public.members, self-create a row that then appeared
-- in the brods-only directory.
--
-- The 490-person roster (birthdates, addresses, phones, emergency contacts)
-- is NEVER imported here. Only an HMAC-SHA256 of a verified email plus their
-- batch ever enters the database — zero raw PII, per PRIVACY.md.
--
-- Design (per the 26 Aug council):
--   * Deny at the auth boundary: self-service sign-up is OFF and the OTP call
--     uses shouldCreateUser:false (see sign-in-form.tsx), so only board-issued
--     invites (auth.admin.inviteUserByEmail) can ever create an auth user.
--   * BEFORE_USER_CREATED hook: even if sign-up were re-enabled, it aborts any
--     email not on the approved allowlist. Fail-closed.
--   * CUSTOM_ACCESS_TOKEN hook: ENRICHMENT only — stamps `is_member` + batch
--     into the JWT. An access-token hook is documented to FAIL OPEN, so this
--     must never be the only deny control; RLS is the actual lock.
--   * Deny-by-default RLS on public.members, gated on the is_member claim.
--
-- The shared HMAC secret lives in public.portal_config (single row, id=1), NOT
-- in a Postgres GUC — Supabase restricts ALTER DATABASE ... SET on custom
-- app.* parameters, so a table is the portable place. The secret itself is
-- provisioned separately (owner step): INSERT ... ON CONFLICT. If it is unset,
-- every affected function fails closed (refuse).
--
-- ONE-TIME SETUP (required before this migration protects anything):
--   1. Provision the secret (see the provisioning_SQL at the bottom, or the
--      /admin + README). If unset, the hooks fail closed.
--   2. Dashboard → Authentication → Providers: turn OFF "Email / OTP" sign-up
--      (or disable "Allow new users to sign up").
--   3. Dashboard → Authentication → Hooks:
--        * Before User Created -> SQL -> public.before_user_created_hook
--        * Custom Access Token   -> SQL -> public.custom_access_token_hook
--   4. Invite the board cohort via the /admin "Grant a brother" tool (service
--      role), which adds their email_hash to member_allowlist and calls
--      auth.admin.inviteUserByEmail.

-- ---------------------------------------------------------------------------
-- 1) Hash-only membership allowlist + the config table that holds the secret.
-- ---------------------------------------------------------------------------
create extension if not exists pgcrypto;

create table if not exists public.member_allowlist (
  email_hash text primary key,          -- hmac_sha256(lower(trim(email)), portal_config.app_secret)
  label      text,                       -- masked email, e.g. "jo***@g***.com" — helps the board recognize a row without storing the raw email
  batch      text,
  status     text not null default 'approved'
             check (status in ('approved','revoked')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.member_allowlist enable row level security;

-- Single-row config. Holds the HMAC secret used to hash emails. No raw PII.
create table if not exists public.portal_config (
  id         int primary key default 1 check (id = 1),
  app_secret text not null default '',
  updated_at timestamptz not null default now()
);
alter table public.portal_config enable row level security;
-- No anon/authenticated policies: only the security-definer functions and the
-- service-role admin tool may read/write it.

create index if not exists member_allowlist_batch_idx on public.member_allowlist (batch);

create or replace function public.touch_allowlist_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;
drop trigger if exists member_allowlist_touch on public.member_allowlist;
create trigger member_allowlist_touch
  before update on public.member_allowlist
  for each row execute function public.touch_allowlist_updated_at();

-- ---------------------------------------------------------------------------
-- 2) Shared-secret hashing helper. Reads portal_config.app_secret; if unset,
--    hashes with '' (so callers can detect "not provisioned" and refuse).
-- ---------------------------------------------------------------------------
create or replace function public.allowlist_hash(email text)
returns text language sql stable as $$
  select encode(
    hmac(
      lower(trim(coalesce(email, ''))),
      coalesce((select app_secret from public.portal_config where id = 1), ''),
      'sha256'
    ),
    'hex');
$$;

-- ---------------------------------------------------------------------------
-- 3) BEFORE USER CREATED hook — the real deny control at the auth boundary.
--    Fail-closed: if the secret is unprovisioned or the email is not on the
--    approved allowlist, abort creation.
-- ---------------------------------------------------------------------------
create or replace function public.before_user_created_hook(event jsonb)
returns jsonb language plpgsql security definer as $$
declare
  secret text := (select app_secret from public.portal_config where id = 1);
  h text;
begin
  if secret is null or secret = '' then
    return jsonb_build_object('error', jsonb_build_object(
      'http_code', 403,
      'message', 'The member portal is not yet configured. Contact the Alumni Association.'));
  end if;
  h := public.allowlist_hash(event ->> 'email');
  if not exists (select 1 from public.member_allowlist
                 where email_hash = h and status = 'approved') then
    return jsonb_build_object('error', jsonb_build_object(
      'http_code', 403,
      'message', 'This email is not an approved brother. Contact the Alumni Association.'));
  end if;
  insert into public.portal_access_log (actor, action, meta)
  values (null, 'signup_attempt', jsonb_build_object('email_hash', h));
  return event;
end $$;
grant execute on function public.before_user_created_hook(jsonb) to supabase_auth_admin;
grant usage on schema public to supabase_auth_admin;
revoke execute on function public.before_user_created_hook(jsonb) from anon, authenticated;
-- Wire in: Dashboard > Authentication > Hooks > Before User Created (SQL).

-- ---------------------------------------------------------------------------
-- 4) CUSTOM ACCESS TOKEN hook — ENRICHMENT only (fails open, never the gate).
-- ---------------------------------------------------------------------------
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb language plpgsql security definer as $$
declare
  claims jsonb := event -> 'claims';
  meta   jsonb := coalesce(claims -> 'app_metadata', '{}');
  h text; b text;
begin
  if coalesce((select app_secret from public.portal_config where id = 1), '') = '' then
    return jsonb_build_object('claims', claims);
  end if;
  h := public.allowlist_hash(claims ->> 'email');
  select batch into b from public.member_allowlist
    where email_hash = h and status = 'approved';
  if b is not null then
    meta := jsonb_set(meta, '{is_member}', 'true');
    meta := jsonb_set(meta, '{batch}', to_jsonb(b));
    claims := jsonb_set(claims, '{app_metadata}', meta);
  end if;
  return jsonb_build_object('claims', claims);
end $$;
grant execute on function public.custom_access_token_hook(jsonb) to supabase_auth_admin;
grant usage on schema public to supabase_auth_admin;
revoke execute on function public.custom_access_token_hook(jsonb) from anon, authenticated;
-- Wire in: Dashboard > Authentication > Hooks > Custom Access Token (SQL).

-- ---------------------------------------------------------------------------
-- 5) Deny-by-default RLS on public.members, gated on the is_member claim.
-- ---------------------------------------------------------------------------
create or replace function public.is_member()
returns boolean language sql stable as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'is_member', 'false')::boolean;
$$;

-- A member may still create and keep their own record current, but ONLY while
-- carrying the is_member claim. A stranger has no claim, so the exploit upsert
-- is now rejected at the database, not just hidden in the UI.
drop policy if exists "members manage own row" on public.members;
create policy "members manage own row"
  on public.members for all
  using      (auth.uid() = id and public.is_member())
  with check (auth.uid() = id and public.is_member());

-- The brods-only directory is closed to anyone who is not a verified member.
drop policy if exists "members browse brods-visible rows" on public.members;
create policy "members browse brods-visible rows"
  on public.members for select
  to authenticated
  using (public.is_member() and visibility in ('brods','public'));

-- Explicit, versioned consent to be listed + a human-approval escape hatch.
alter table public.members
  add column if not exists verification_status text not null default 'approved'
      check (verification_status in ('pending','approved')),
  add column if not exists consent_listed boolean not null default false,
  add column if not exists consent_version text,
  add column if not exists consent_at timestamptz;

-- ---------------------------------------------------------------------------
-- 6) Access audit log — accountability / breach evidence (RA 10173).
-- ---------------------------------------------------------------------------
create table if not exists public.portal_access_log (
  id         uuid primary key default gen_random_uuid(),
  actor      uuid references auth.users(id) on delete set null,
  action     text not null,   -- signup_attempt | grant | revoke | directory_read
  meta       jsonb,
  created_at timestamptz not null default now()
);
alter table public.portal_access_log enable row level security;
-- service-role only.

-- ---------------------------------------------------------------------------
-- 7) RPCs the /admin tool calls (service role) to grant / revoke a brother.
--    These accept the raw email and hash it inside Postgres, so the raw email
--    never needs to be stored and the Node side never handles the secret.
-- ---------------------------------------------------------------------------
create or replace function public.mask_email(email text)
returns text language sql immutable as $$
  select
    substr(e, 1, 2) || '***@' || substr(d, 1, 1) || '***'
  from (select split_part(lower(trim(email)), '@', 1) e, split_part(lower(trim(email)), '@', 2) d) s
  where position('@' in lower(trim(email))) > 0;
$$;

create or replace function public.grant_member(p_email text, p_batch text default null)
returns text language plpgsql security definer as $$
declare h text; secret text;
begin
  secret := (select app_secret from public.portal_config where id = 1);
  if secret is null or secret = '' then
    raise exception 'portal allowlist secret is not provisioned';
  end if;
  h := public.allowlist_hash(p_email);
  insert into public.member_allowlist (email_hash, label, batch, status)
  values (h, public.mask_email(p_email), nullif(trim(p_batch), ''), 'approved')
  on conflict (email_hash) do update
    set label = excluded.label, batch = excluded.batch, status = 'approved', updated_at = now();
  insert into public.portal_access_log (action, meta)
  values ('grant', jsonb_build_object('email_hash', h, 'batch', nullif(trim(p_batch), '')));
  return h;
end $$;
revoke execute on function public.grant_member(text, text) from anon, authenticated;

create or replace function public.revoke_member(p_email text)
returns text language plpgsql security definer as $$
declare h text;
begin
  h := public.allowlist_hash(p_email);
  update public.member_allowlist set status = 'revoked', updated_at = now()
  where email_hash = h;
  insert into public.portal_access_log (action, meta)
  values ('revoke', jsonb_build_object('email_hash', h));
  return h;
end $$;
revoke execute on function public.revoke_member(text) from anon, authenticated;

create or replace function public.revoke_member_hash(p_hash text)
returns text language plpgsql security definer as $$
begin
  update public.member_allowlist set status = 'revoked', updated_at = now()
  where email_hash = p_hash;
  insert into public.portal_access_log (action, meta)
  values ('revoke', jsonb_build_object('email_hash', p_hash));
  return p_hash;
end $$;
revoke execute on function public.revoke_member_hash(text) from anon, authenticated;

-- The functions above are intended to be called by the /admin server action,
-- which runs with the service-role key (bypasses RLS). For belt-and-suspenders
-- they are also security definer and execute is revoked from anon/authenticated.

-- ───────────────────────────────────────────────────────────────────────────
-- PROVISIONING (owner step, one time — NOT part of the gate's idempotent DDL):
--   INSERT INTO public.portal_config (id, app_secret)
--   VALUES (1, '<your strong random secret>')
--   ON CONFLICT (id) DO UPDATE SET app_secret = excluded.app_secret, updated_at = now();
-- The same value must be used by any offline seeding tool that mints email hashes.
-- Until this runs, before_user_created_hook and grant_member refuse (fail-closed).
-- ───────────────────────────────────────────────────────────────────────────
