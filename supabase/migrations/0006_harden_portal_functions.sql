-- Hardening pass on the Phase 2 gate, driven by the Supabase security and
-- performance advisors (run 2026-09-03).
--
-- THE REAL BUG: 0005 revoked EXECUTE on grant_member / revoke_member /
-- revoke_member_hash / the two auth hooks from `anon` and `authenticated`, but
-- Postgres grants EXECUTE on every new function to PUBLIC by default, and a
-- revoke from a named role does not touch the PUBLIC grant. pg_proc showed
-- `=X/postgres` on all of them, so an anonymous caller could hit
-- /rest/v1/rpc/grant_member with their own email and add themselves to the
-- allowlist. This migration revokes from PUBLIC and re-grants only to the
-- roles that genuinely need each function.
--
-- ALSO: every function gets `set search_path = ''` (advisor 0011). With an
-- empty search_path, every reference must be schema-qualified — including
-- pgcrypto's hmac(), which Supabase installs in the `extensions` schema.
--
-- AND: the RLS policies on members / dues_payments wrap auth.uid() and
-- is_member() in (select ...) so Postgres evaluates them once per query
-- instead of once per row (advisor 0003), and portal_access_log.actor gets
-- the covering index its foreign key was missing (advisor 0001).

-- ---------------------------------------------------------------------------
-- 1) Rewrite the functions with a fixed, empty search_path.
-- ---------------------------------------------------------------------------
create or replace function public.allowlist_hash(email text)
returns text
language sql
stable
set search_path = ''
as $$
  select encode(
    extensions.hmac(
      lower(trim(coalesce(email, ''))),
      coalesce((select app_secret from public.portal_config where id = 1), ''),
      'sha256'
    ),
    'hex');
$$;

create or replace function public.before_user_created_hook(event jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
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

create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
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
  if found then
    meta := jsonb_set(meta, '{is_member}', 'true');
    meta := jsonb_set(meta, '{batch}', coalesce(to_jsonb(b), 'null'::jsonb));
    claims := jsonb_set(claims, '{app_metadata}', meta);
  end if;
  return jsonb_build_object('claims', claims);
end $$;

create or replace function public.is_member()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'is_member', 'false')::boolean;
$$;

create or replace function public.mask_email(email text)
returns text
language sql
immutable
set search_path = ''
as $$
  select
    substr(e, 1, 2) || '***@' || substr(d, 1, 1) || '***'
  from (select split_part(lower(trim(email)), '@', 1) e, split_part(lower(trim(email)), '@', 2) d) s
  where position('@' in lower(trim(email))) > 0;
$$;

create or replace function public.grant_member(p_email text, p_batch text default null)
returns text
language plpgsql
security definer
set search_path = ''
as $$
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

create or replace function public.revoke_member(p_email text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare h text;
begin
  h := public.allowlist_hash(p_email);
  update public.member_allowlist set status = 'revoked', updated_at = now()
  where email_hash = h;
  insert into public.portal_access_log (action, meta)
  values ('revoke', jsonb_build_object('email_hash', h));
  return h;
end $$;

create or replace function public.revoke_member_hash(p_hash text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.member_allowlist set status = 'revoked', updated_at = now()
  where email_hash = p_hash;
  insert into public.portal_access_log (action, meta)
  values ('revoke', jsonb_build_object('email_hash', p_hash));
  return p_hash;
end $$;

create or replace function public.touch_members_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end $$;

create or replace function public.touch_allowlist_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------------------------------------------------------------------------
-- 2) Privileges: deny PUBLIC everywhere, then grant only what each caller needs.
--    The /admin server action uses the service_role key; the auth hooks run as
--    supabase_auth_admin; RLS policies and triggers run as the querying role.
-- ---------------------------------------------------------------------------
revoke execute on function public.allowlist_hash(text)                 from public, anon, authenticated;
revoke execute on function public.before_user_created_hook(jsonb)      from public, anon, authenticated;
revoke execute on function public.custom_access_token_hook(jsonb)      from public, anon, authenticated;
revoke execute on function public.grant_member(text, text)             from public, anon, authenticated;
revoke execute on function public.revoke_member(text)                  from public, anon, authenticated;
revoke execute on function public.revoke_member_hash(text)             from public, anon, authenticated;
revoke execute on function public.mask_email(text)                     from public, anon, authenticated;
revoke execute on function public.is_member()                          from public, anon;
revoke execute on function public.touch_members_updated_at()           from public, anon;
revoke execute on function public.touch_allowlist_updated_at()         from public, anon;

grant execute on function public.before_user_created_hook(jsonb) to supabase_auth_admin;
grant execute on function public.custom_access_token_hook(jsonb) to supabase_auth_admin;
grant execute on function public.grant_member(text, text)        to service_role;
grant execute on function public.revoke_member(text)             to service_role;
grant execute on function public.revoke_member_hash(text)        to service_role;
grant execute on function public.allowlist_hash(text)            to service_role, supabase_auth_admin;
grant execute on function public.mask_email(text)                to service_role;
-- RLS on public.members calls is_member() as the signed-in member.
grant execute on function public.is_member()                     to authenticated, service_role;
-- Row triggers fire as whoever performs the write.
grant execute on function public.touch_members_updated_at()      to authenticated, service_role;
grant execute on function public.touch_allowlist_updated_at()    to service_role;

-- supabase_auth_admin needs to read the allowlist + config the hooks consult.
grant select on public.portal_config to supabase_auth_admin;
grant select on public.member_allowlist to supabase_auth_admin;
grant insert on public.portal_access_log to supabase_auth_admin;

-- ---------------------------------------------------------------------------
-- 3) RLS policies: evaluate auth.uid() / is_member() once per statement.
-- ---------------------------------------------------------------------------
drop policy if exists "members manage own row" on public.members;
create policy "members manage own row"
  on public.members for all
  to authenticated
  using      ((select auth.uid()) = id and (select public.is_member()))
  with check ((select auth.uid()) = id and (select public.is_member()));

drop policy if exists "members browse brods-visible rows" on public.members;
create policy "members browse brods-visible rows"
  on public.members for select
  to authenticated
  using ((select public.is_member()) and visibility in ('brods', 'public'));

drop policy if exists "members read own dues history" on public.dues_payments;
create policy "members read own dues history"
  on public.dues_payments for select
  to authenticated
  using (member_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- 4) Covering index for the audit log's foreign key.
-- ---------------------------------------------------------------------------
create index if not exists portal_access_log_actor_idx on public.portal_access_log (actor);
create index if not exists portal_access_log_created_idx on public.portal_access_log (created_at desc);
