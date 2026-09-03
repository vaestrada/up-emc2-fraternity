# UP EMC² Fraternity Website

Official website of the **EMC² Fraternity, University of the Philippines** — U.P. College of
Engineering, founded 1969. Built with Next.js 15 (App Router), Tailwind CSS v4, and TypeScript.

> **⚠️ Before anything else: read [PRIVACY.md](./PRIVACY.md).** The `assets/` folder contains
> the real member roster (490 people, with PII) and is deliberately git-ignored.

## Development

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## Structure

- `app/page.tsx` — homepage (hero, stats, credo, projects, prominent brods, donate CTA)
- `app/history` — founding story, credo, milestones timeline
- `app/projects` — the 8 documented projects & campaigns
- `app/brods` — prominent brods gallery
- `app/donate` — donation channels (placeholders pending BOT account details) + pledge form
- `app/contact` — contact info + form
- `app/portal` — Member Portal: magic-link sign-in + self-service profile (see below)
- `app/portal/directory` — login-gated directory, visible per-member opt-in
- `app/portal/dues` — membership dues, recorded for manual reconciliation (same pattern as `/donate`'s pledge form — see "Member Portal" below for why)
- `app/roadmap` — what's shipped, what's committed, what's still just a direction
- `components/site/*` — navbar, footer, cards, forms
- `components/portal/*` — sign-in, profile, and dues forms for the Member Portal
- `lib/content.ts` — all site copy and structured content in one place
- `public/logo`, `public/photos` — web-ready brand assets (copied from `assets/`, which stays private)

## Brand

Colors sampled from the official crest:

- Green `#0C3E06` (`--frat-green`)
- Gold `#C38F0E` (`--frat-gold`)
- Cream `#FAF8F3` (background)

Fonts: Cinzel (display — the Trajan-style capitals of the lockup), Cormorant (serif italics for
mottos and credo lines), Geist (body), Geist Mono (eyebrows, captions, annotations). The full
visual system is in [DESIGN.md](./DESIGN.md); the vocabulary behind it is in
[GLOSSARY.md](./GLOSSARY.md).

## Member Portal (Phase 2)

> **Live as of 2026-08-24.** `0003_member_portal` and `0004_anniversary_rsvp`
> are applied; all six tables exist with RLS enabled. Until that date the Portal
> had never actually worked, because `0003` contained a syntax error: the column
> was declared `current_role text`, and `current_role` is a reserved word in
> Postgres, so the file failed with `42601` every time it was run. The column is
> now quoted, which keeps the name identical for PostgREST and the Portal's
> client code. Verify with the table check in "Verifying the schema" below.

The code, once those migrations are applied: sign in at `/portal` with a magic link,
edit your own record, opt into the `/portal/directory`, record a `/portal/dues` payment. Built entirely on self-service —
no bulk import of `members_master.csv` happens here, on purpose. Per [PRIVACY.md](./PRIVACY.md),
that 490-row roster (birthdates, home addresses, emergency contacts) never goes through
an AI coding session and never becomes a bulk `INSERT`. A brod's Portal record only ever
holds what they typed into their own profile after signing in with their own email.

**Membership is invite-gated.** Since the roster is never imported, the portal can't
self-verify membership, so a board member verifies each brod against the roster held
offline and then grants access from `/admin` (adds the email to a hash-only allowlist and
sends an invite). Only those invited members can sign in — `signInWithOtp` now sends
`shouldCreateUser: false`, so a stranger's email yields no account. This closes the earlier
hole where any email could self-create a member row and appear in the private directory.

**One-time setup before this works in production:**

1. In Vercel → Project Settings → Environment Variables, confirm
   `NEXT_PUBLIC_emc2fraternity_SUPABASE_ANON_KEY` is set (the Supabase integration may
   have only populated the URL and service-role key so far — the anon key is what the
   Portal's browser-side sign-in needs, and it's safe to expose: real access is enforced
   by `members` table Row Level Security, not by keeping this key secret).
2. In Supabase Dashboard → Authentication → URL Configuration → Redirect URLs, add
   `<production domain>/auth/callback` — magic links redirect nowhere useful without it.
3. Apply the gate migration, then provision the allowlist secret in the config table
   (run in the Supabase SQL Editor — Supabase restricts `alter database set` on custom
   `app.*` params, so it lives in a table instead):
   `insert into public.portal_config (id, app_secret) values (1, '<strong random>') on conflict (id) do update set app_secret = excluded.app_secret, updated_at = now();`
   — if unset, the hooks fail closed. Use the same value in any offline seeding tool.
4. In Supabase Dashboard → Authentication → Providers, disable self-service sign-up so the
   only way to create an account is a board-issued invite.
5. In Supabase Dashboard → Authentication → Hooks, register as SQL: **Before User Created →
   `public.before_user_created_hook`** and **Custom Access Token → `public.custom_access_token_hook`**.
6. Grant a first cohort from `/admin` (adds the email hash + batch and sends the invite).

Until both are done, `/portal` degrades gracefully to a "not configured yet, use Contact"
message rather than a broken sign-in form — it will not error for visitors either way.

Dues checkout is manual-reconciliation for the same reason `/donate`'s pledge form is:
see `dues_payments` in `supabase/migrations/0003_member_portal.sql`.

## The board's tools — `/admin`

Password-gated (`ADMIN_PASSWORD`), board only. It shows the 58th Anniversary save-the-date
list with headcount and interest tallies, the contributions queue (approve → `/history`),
pledges (acknowledge → Roll of Patrons if consented), dues records (acknowledge after matching
the reference), contact messages, and Portal access (grant + invite, revoke). Every list has a
**Download CSV** link (`/admin/export?table=…`) — the one-click bridge into Google Sheets for
the committees, who never need an account here. The exports contain names and emails, so they
fall under [PRIVACY.md](./PRIVACY.md) rule 2.

## Demo content switch

`lib/content.ts` carries four AI-generated "prominent brods", two demo donor quotes, a demo
gallery on `/history`, and a demo register video on `/brods`, all labelled in the UI. They are
gated by `NEXT_PUBLIC_DEMO_CONTENT` (see `lib/demo.ts`): shown by default for walkthroughs,
and **set it to `off` in Vercel for the public launch** so every synthetic item disappears and
the pages fall back to their honest "entry pending" states.

## Publishing content from Google Drive

The brotherhood writes in Google Docs and logs each piece in the **EMC² Content Log** sheet.
The `emc2-publish` skill in `.claude/skills/` turns an `Approved` row into a change here, with
the consent and privacy gates applied. The whole operating model — roles, cadence, revenue
lines, the transparency ledger, continuity — is in
[OPERATING-PLAYBOOK.md](./OPERATING-PLAYBOOK.md); the board walkthrough is in
[DEMO-SCRIPT.md](./DEMO-SCRIPT.md).

## Content still pending from the BOT

- Full written founding history (the ten scholars, early years)
- Official donation account details (GCash/Maya QR, bank account, PayPal)
- Official Alumni Association email address
- More prominent-brod nominations (name, batch, one-line achievement, photo)
- Domain ownership answer for `upemc2fraternity.org`

## Roadmap

See **[/roadmap](https://up-emc2-fraternity.vercel.app/roadmap)** on the live site for the
member-facing version of this list.

1. **Phase 1 — shipped:** public site.
2. **Phase 2 — shipped:** member portal (Supabase auth, magic links), login-gated
   directory with per-member opt-in visibility, RLS policies. Migration applied to
   production 2026-08-24 — see the note under "Member Portal" above for why it had
   silently never been applied before then. Bulk `members_master.csv` import
   deliberately **not** part of this.
3. **Phase 3 — in progress:** newsletter (Resend + subscribers table), donation campaign
   tracking, PayMongo checkout once KYB is approved.
4. **Future — direction, not commitment:** a companion mobile app, an AI-native copilot
   over the archive. See `/roadmap` for how these are framed to members — as a direction
   the site is built to grow into, not a promised feature.

## Verifying the schema

The app degrades gracefully when a table is missing, which means a broken schema looks
identical to a quiet week. Check it explicitly rather than inferring it from the UI —
with the Supabase URL and secret key in `.env.local`:

```bash
set -a && . ./.env.local && set +a
for t in contributions pledges messages members dues_payments anniversary_rsvps member_allowlist portal_access_log portal_config; do
  auth="Authorization: Bearer $SUPABASE_SECRET_KEY"
  code=$(curl -s -o /dev/null -w '%{http_code}' -H "apikey: $SUPABASE_SECRET_KEY" -H "$auth" "$SUPABASE_URL/rest/v1/$t?select=id&limit=1")
  [ "$code" = 200 ] && echo "$t EXISTS" || echo "$t MISSING ($code)"
done
```

All nine should read `EXISTS`. A `404` with `PGRST205` means the table genuinely is not
there, not that permissions are wrong. Migrations `0005` and `0006` (the invite gate and its
hardening) were applied on 2026-08-26 and 2026-09-03 respectively; `0006` is the one that
revokes PUBLIC execute on the security-definer functions — without it an anonymous caller
could add themselves to the allowlist through the REST RPC endpoint.

The browser needs to reach Supabase directly for the Portal (magic-link sign-in, the profile
save) and for contributed photos (signed Storage URLs). `next.config.ts` allow-lists the
Supabase origin in the Content Security Policy from `NEXT_PUBLIC_emc2fraternity_SUPABASE_URL`;
if that env is missing at build time the CSP falls back to same-origin and the Portal will
fail silently in the browser console.

Note also that this Supabase project is on the **free plan, which auto-pauses after
~7 days of inactivity**. A paused database fails Vercel's resource-provisioning step,
so deploys die in under a second with `BUILD_FAILED: Resource provisioning failed` and
no build logs at all. That has happened twice (see commit `0816a2d`). If a deploy fails
that way, unpause the database first, then redeploy — the code is not the problem.
