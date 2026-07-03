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
- `components/site/*` — navbar, footer, cards, forms
- `lib/content.ts` — all site copy and structured content in one place
- `public/logo`, `public/photos` — web-ready brand assets (copied from `assets/`, which stays private)

## Brand

Colors sampled from the official crest:

- Green `#0C3E06` (`--frat-green`)
- Gold `#C38F0E` (`--frat-gold`)
- Cream `#FAF8F3` (background)

Fonts: Playfair Display (display) + Geist (body).

## Content still pending from the BOT

- Full written founding history (the ten scholars, early years)
- Official donation account details (GCash/Maya QR, bank account, PayPal)
- Official Alumni Association email address
- More prominent-brod nominations (name, batch, one-line achievement, photo)
- Domain ownership answer for `upemc2fraternity.org`

## Roadmap

1. **Phase 1 (this repo, now):** public site — ship to Vercel free tier
2. **Phase 2:** member portal — Supabase auth (magic links), login-gated directory with
   opt-in visibility, RLS policies; import `members_master.csv` then delete local copies
3. **Phase 3:** operations — newsletter (Resend + subscribers table), donation campaign
   tracking, PayMongo checkout once KYB is approved
