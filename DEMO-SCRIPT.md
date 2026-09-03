# Demo script — Friday 4 September 2026, for the president

Twelve minutes of screen, eight minutes of plan, then the asks. The site is the hook; the
playbook is the pitch. Everything below is rehearsable in twenty minutes the night before.

## Before you walk in (checklist)

- [ ] `git push` and confirm the Vercel deployment is **READY** (`up-emc2-fraternity` in the
      Hype Kidz team). A paused Supabase database fails the build in under a second — open the
      Supabase dashboard first and make sure the project is not paused.
- [ ] In Vercel env: `ADMIN_PASSWORD` set; `NEXT_PUBLIC_DEMO_CONTENT` **unset or `on`** (the
      synthetic citations and gallery are labelled and you will say so); the Supabase anon
      key present.
- [ ] Grant yourself Portal access from `/admin` and sign in once on the laptop you will
      present with, so the signed-in Portal view ("Your Record", directory, dues) is one tab
      away. Grant one more brod the president knows so the directory is not empty.
- [ ] Put one real RSVP and one real pledge through the forms so the admin queue has rows.
- [ ] Open these tabs in order: `/`, `/anniversary`, `/portal` (signed in), `/admin`,
      `/roadmap`, the Content Log sheet in Drive, this playbook.
- [ ] Phone on the table with the site open — hand it over when he asks "does it work on mobile".
- [ ] Screen-record the whole walkthrough once tonight as the fallback if the venue Wi-Fi fails.

## Minute by minute

**0:00 — Land on the homepage and say nothing for five seconds.** Let the wordmark engrave,
the rule draw, the light pass. Then: *"This is the fraternity's first official home online.
Everything you'll see is either from the Association's own record or clearly marked as a
preview."*

**0:30 — Scroll slowly.** The marquee ("Quantum Leaps Since 1969"), the stat band (57 years,
490 brods on record), the Credo at full size. *"The design language is an archive — a hall
of records. Numbered entries, figure captions, gold used only for honour and action."*

**1:30 — The campus sequence.** Scroll through the pinned video. *"Rendered from real
photographs of Diliman, so the campus is the actual campus. The technique is scroll-scrubbing:
your scroll is the timeline."*

**2:30 — The Ledger and the Citations.** Point at Engr. Ison and Brod Salanguit (real), then at
the "Demo — AI-generated" badge on the others. *"Two real citations. The other four are
placeholders so you can see what a full register looks like. They come down with one switch
the day we launch publicly; what replaces them is the board's nominations."*

**3:30 — The Bulletin.** *"Two notices: the 58th, and the Portal opening. This is where the
brotherhood's news lives; it is fed by residents, not by me."*

**4:00 — `/anniversary`.** Let the showcase turn through two slides. The plate (When / Where /
Who), the three 55th photographs, the RSVP. Submit nothing; point at the interest checkboxes.
*"This page exists six months early for one reason: the list. Someone who ticks
'sponsorship' in September is a warm call in October."*

**5:30 — `/portal`, signed out first.** Type a made-up email, send. Show the refusal:
*"That address isn't on the invite list."* *"The Portal is invitation-only. A board member
verifies each brod against the roster — which never enters the system; only a hash does —
and grants access. This is the Data Privacy Act done properly."* Then switch to the
signed-in tab: Your Record, the visibility control (private by default), the directory, dues.

**7:30 — `/admin`.** The 58th list with headcount and the interest tally. Contributions
queue. Pledges → Roll of Patrons. Dues acknowledgement. **Download CSV** — *"one click and
the events committee has it in Google Sheets. Nobody on the committee needs an account here."*
Portal access: grant + revoke.

**9:30 — `/roadmap`.** Shipped / Committed / Direction. *"Said plainly, so nothing reads as a
promise it isn't. Checkout waits on the Association's PayMongo verification, not on us."*

**10:30 — The Content Log in Drive.** One sheet, one row per piece, `Draft → Ready → Approved
→ Published`. *"Residents write in Google Docs and log it here. I run one publishing session
a week and it lands on the site. No one learns a new tool."*

**12:00 — Close the laptop. Open the playbook.** Three things, one minute each:

1. **The pipeline** (§2): Google Workspace in, archive out, weekly. Five residents to start.
2. **The money** (§5): souvenir ads, sponsorship packages, standing-order giving, tickets,
   pre-order merch, the business directory. All received by the Association; all reconciled
   in the admin queue; totals published in the ledger (§6) so alumni give twice.
3. **The engine behind every event** (§7): page → RSVP → sponsor wall → tickets → the day →
   the record. The 58th proves the shape; Kalye Tunes, Mathrix, Pautakan, and Kanalan reuse it.

**16:00 — The asks** (§10, read them as a list):
mandate · six names · the Association's email and accounts · one roster-verification hour ·
twenty sponsor doors · his goals for the term written into the roadmap.

**18:00 — Stop talking.** Let him ask.

## What not to claim

- Not "the Portal has members" — it has a gate and a first cohort to invite.
- Not "checkout" — manual reconciliation until KYB clears.
- Not "the founding history" — pending from the Association; the page says so.
- Not "tax-deductible" — never, until donee-institution status exists.
- Not "the venue is booked" — held, not contracted, and the page says so.

## Likely questions and the honest answer

- *"How much does this cost?"* — ₱0 a month today; ~₱1,500 a month when the Portal has real
  use (Supabase Pro), ~₱1,000 a year for the domain. The expensive part is people's time,
  and the pipeline is designed so that is thirty minutes a week.
- *"Who maintains it when you're busy?"* — §9. Accounts move to the Association; a keeper is
  named yearly; the skills and playbook are the memory; a new keeper with Claude Code
  publishes on day one.
- *"Can we sell things on it?"* — Intent capture today, on-site checkout the day PayMongo
  approves the Association. Nothing is lost by waiting: the list is what sells.
- *"What about the residents' events — Kalye Tunes?"* — The same event engine, and the
  transparency ledger is what will make the alumni board comfortable underwriting a
  seven-figure festival run by students.
- *"Is our members' data safe?"* — The roster has never been uploaded and never will be.
  The Portal stores only what a brod types about himself, private by default, and only a
  hash of his email. Security review and hardening were done this week (REVIEW-2026-09-03.md).
