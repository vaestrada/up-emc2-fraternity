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

Fonts: Playfair Display (display) + Geist (body).

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

**One-time setup before this works in production:**

1. In Vercel → Project Settings → Environment Variables, confirm
   `NEXT_PUBLIC_emc2fraternity_SUPABASE_ANON_KEY` is set (the Supabase integration may
   have only populated the URL and service-role key so far — the anon key is what the
   Portal's browser-side sign-in needs, and it's safe to expose: real access is enforced
   by `members` table Row Level Security, not by keeping this key secret).
2. In Supabase Dashboard → Authentication → URL Configuration → Redirect URLs, add
   `<production domain>/auth/callback` — magic links redirect nowhere useful without it.

Until both are done, `/portal` degrades gracefully to a "not configured yet, use Contact"
message rather than a broken sign-in form — it will not error for visitors either way.

Dues checkout is manual-reconciliation for the same reason `/donate`'s pledge form is:
see `dues_payments` in `supabase/migrations/0003_member_portal.sql`.

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
for t in contributions pledges messages members dues_payments anniversary_rsvps; do
  auth="Authorization: Bearer $SUPABASE_SECRET_KEY"
  code=$(curl -s -o /dev/null -w '%{http_code}' -H "apikey: $SUPABASE_SECRET_KEY" -H "$auth" "$SUPABASE_URL/rest/v1/$t?select=id&limit=1")
  [ "$code" = 200 ] && echo "$t EXISTS" || echo "$t MISSING ($code)"
done
```

All six should read `EXISTS`. A `404` with `PGRST205` means the table genuinely is not
there, not that permissions are wrong.

Note also that this Supabase project is on the **free plan, which auto-pauses after
~7 days of inactivity**. A paused database fails Vercel's resource-provisioning step,
so deploys die in under a second with `BUILD_FAILED: Resource provisioning failed` and
no build logs at all. That has happened twice (see commit `0816a2d`). If a deploy fails
that way, unpause the database first, then redeploy — the code is not the problem.
