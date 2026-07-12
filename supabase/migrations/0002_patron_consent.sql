-- Opt-in consent to be listed publicly as a patron (name only, never amount).
-- Default false; the public "Roll of Patrons" shows only rows where this is
-- true AND the pledge has been acknowledged (transfer verified) by an admin.
alter table public.pledges
  add column if not exists consent_public boolean not null default false;
