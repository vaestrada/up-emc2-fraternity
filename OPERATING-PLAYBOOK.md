# Operating Playbook — running the EMC² digital home as a company

*Prepared 3 September 2026 for the presentation to the fraternity president. The site is the
face; this document is the body: who does what, how content flows, where money comes from,
how the board sees the numbers, and how it survives the next graduation.*

Read it in this order: §1 for the model on one page, §2 for the content pipeline (the part
that decides whether the site is alive in six months), §5 for money, §8 for the timeline,
§10 for what only people can do.

---

## 1. The model on one page

The website is a landing page. What the fraternity is actually building is an **operating
engine** with five parts, run by a small standing committee:

| Part | What it is | Owner |
|---|---|---|
| **The face** | The public site: history, projects, citations, events, giving. | Site keeper |
| **The record** | The Member Portal and the private data behind it (invite-gated, consent-first). | Site keeper + one board verifier |
| **The pipeline** | Google Drive → review → publish. How residents and alumni contribute without learning a new tool. | Editor + contributors |
| **The engine** | The admin queue, exports to Sheets, the transparency ledger, event pages with RSVP and sponsor walls. | Site keeper + treasurer liaison |
| **The audience** | Residents, alumni, the Association, the College, the University — and the sponsors who fund events for them. | Events lead + sponsorship lead |

Five roles, which three people can hold at first:

1. **Site keeper** (today: Viron). Owns the code, deploys, accounts, the admin password, the
   privacy posture. Trains their successor.
2. **Editor** (a resident). Owns the Content Log, the weekly review, the archive's voice.
   Gate-keeps what gets published.
3. **Board verifier** (an Association officer). Verifies brods against the roster held offline
   and grants Portal invites from `/admin`. Also the treasurer liaison for dues and pledges.
4. **Events lead** (a resident, per event). Owns the event's page, RSVP list, and the
   post-event record.
5. **Sponsorship lead** (an alumnus). Owns the rate card, the sponsor list, the asks.

The president's part is not a role in the table. It is the **mandate**: naming these people,
saying publicly that this is the fraternity's official record, and putting his own goals into
§8 so the roadmap is his roadmap.

---

## 2. The content pipeline — Google Workspace in, archive out

The brotherhood already lives in Google Docs, Sheets, Drive, Viber, and Facebook. The
pipeline uses exactly those and nothing else. Nobody outside the site keeper touches code.

### 2.1 The structure in Drive

```
EMC² Website/
├── Content/
│   ├── EMC² Content Log        (Google Sheet — one row per piece)
│   ├── Content Draft Template  (Google Doc — copy me)
│   ├── Drafts/                 (one Doc per piece, named "YYYY-MM-DD Type — Title")
│   ├── Photos/                 (one folder per piece, same name)
│   └── Published/              (moved here when live)
├── Feedback/
│   └── Site Feedback (responses)  (Google Sheet fed by the Google Form)
├── Events/
│   └── <event name>/           (budget, sponsor tracker, run-of-show, post-event record)
└── Finance/
    └── Transparency Ledger     (Google Sheet — see §6)
```

The Drive folder is owned by the **Association's Google account**, not by any individual, so
it survives graduation. Contributors get edit access to `Drafts/` and `Photos/` only.

Created on 2026-09-03 inside the existing `emc2-fraternity` Drive folder, as the seed:

- **EMC² Content Log** — <https://docs.google.com/spreadsheets/d/1w8RSg9g-Ub_eEIlWZL_HGFbSEg7ieVvxhhcGQK2zMbk/edit>
- **Content Draft Template — copy me** — <https://docs.google.com/document/d/1hYKTNPTsrf73bFTwa90lMiF76OsAN309MQ_euJPE2Kw/edit>

Move both under the Association's account once it exists; the links change, the shape does not.

### 2.2 The Content Log (the sheet)

One row per piece. Columns:

`Date · Contributor · Batch · Type · Title · Draft link · Photo folder link · Status · Reviewer · Notes · Published URL`

`Type` is one of **Citation, Milestone, Project, Bulletin, Story, Officers, In Memoriam,
Correction, Feedback**. `Status` moves in one direction:

```
Draft  →  Ready for review  →  Approved  →  Published
                 ↑ contributor        ↑ editor or board   ↑ site keeper (via the emc2-publish skill)
```

Only a reviewer sets `Approved`. Only the keeper sets `Published`. That is the entire
governance model, and it fits in one column.

### 2.3 The draft (the doc)

Copy `Content Draft Template`. It has three headings: **Title**, **Body**, and **Facts**.
Facts is the part that matters: names exactly as they should appear, batch, dates, sources,
who took each photo, and **consent** (does the person being written about know and agree;
for a memorial, does the family). A draft without Facts is not reviewed.

### 2.4 The weekly cadence

- **Any day:** a resident writes a draft, drops photos in the folder, adds a row, sets
  `Ready for review`. Ten minutes, tools they already know.
- **Weekly, 30 minutes (Editor):** open the log, read what is ready, check Facts and consent,
  set `Approved` or write a note back. This is also where the archive's voice is protected.
- **Weekly, after the editor (Site keeper):** run the `emc2-publish` skill in Claude Code.
  It reads approved rows, reads the docs, applies the privacy and consent gates, writes the
  change, verifies it in the browser, commits, and updates the row to `Published`. One
  session, one commit per piece, no re-explaining.
- **Monthly:** the editor posts "what was inscribed this month" to the Viber group and the
  Facebook page with links. This is the distribution step; without it the archive is a tree
  falling in an empty forest.

### 2.5 Why not a CMS

A CMS (Sanity, Payload, WordPress) would give contributors a login and a form. It would also
be one more tool nobody asked for, one more password, and one more thing that breaks. The
brotherhood's Google Sheet *is* the CMS. If the pipeline runs for six months and the log has
more than fifty rows, revisit this. Not before.

### 2.6 Canva, CapCut, Premiere

Canva is already connected to this workspace by MCP and is the right tool for social cards,
souvenir-programme pages, and event posters — a brand kit (green, gold, cream, Cinzel,
Cormorant) should be set up there once so every resident's poster looks like the site. Video
stays in CapCut or Premiere; the site only needs the finished MP4 and a poster frame in the
`Photos/` folder. Nothing in the pipeline changes for a video piece.

---

## 3. The feedback loop

- A **Google Form** titled "EMC² website — feedback" with four fields: *What page, What
  happened / what you wish, Your name (optional), Contact (optional)*. Linked from the
  footer and pinned in the Viber group. Responses land in a Sheet automatically; no code.
- **Triage weekly** with the content review. Each row gets one of: *Fixed*, *Planned* (goes
  to the backlog in §8), *Not now* (with a sentence why), *Question* (reply).
- **Close the loop publicly.** Once a month, three lines in the Viber group: what people
  asked for, what shipped, what is next. This is what turns a feedback form from a suggestion
  box nobody trusts into a habit.
- Contributions of *content* also arrive via `/contribute` on the site itself and land in the
  admin queue; the editor treats both queues in the same sitting.

---

## 4. The admin dashboard — what exists, what is next

**Today (`/admin`, password-gated, board only):**

- 58th Anniversary save-the-date list with headcount (coming / likely / can't) and a tally of
  interests (sponsorship, awards, souvenir ad, merch, volunteer, batch reunion) — the warm
  list the sponsorship lead calls first.
- Contributions queue (approve → appears on `/history`), pledges (acknowledge → name joins
  the Roll of Patrons if consented), dues records (acknowledge after matching the reference),
  contact messages.
- Portal access: grant a verified brod (email is hashed, never stored raw), revoke.
- **Download CSV** on every list — one click to Google Sheets. This is the bridge to the
  committees; they never need an account here.

**Next, in order of value per hour of work:**

1. A scheduled export that writes the same CSVs into the Drive `Finance/` and `Events/`
   folders nightly, so the Sheets are always current without anyone clicking.
2. Email acknowledgements sent from the queue (Resend is already wired for inbound; the
   outbound template is the missing piece).
3. Per-member giving and attendance history in the Portal ("my record"), so next year does
   not start blind.
4. A read-only "board view" of the transparency ledger (§6) rendered on the site.

---

## 5. Revenue — ranked by money per hour of volunteer effort

Everything below is received and receipted by the **Alumni Association** (PLAN.md D2), and
none of it needs on-site checkout while PayMongo is parked (D7): the site captures intent
and the Association collects by GCash or bank transfer, reconciled in `/admin`.

| # | Line | Mechanic | First step, this month |
|---|---|---|---|
| 1 | **Souvenir-programme ads** (58th) | Rate card (full / half / quarter page; printed + digital + sponsor wall on `/anniversary`). Sold to alumni-led firms. | Publish the rate card as a PDF and a page; the RSVP form already collects "souvenir-ad" interest. |
| 2 | **Event sponsorship packages** | One rate card reused across the 58th, Quantum Leap, golf, basketball, Kalye Tunes. Tiers by visibility: naming, court/stage branding, socials, programme, site sponsor wall. Cash before commitment. | Write the one-page prospectus; list twenty alumni-connected companies; assign each to a brod who knows the door. |
| 3 | **Recurring giving — "the Standing Order"** | ₱500 or ₱1,000 monthly, framed as endowing the Brotherhood Assistance Fund and scholarships permanently instead of case by case. Public honour by opt-in only, never amounts. | Add a "monthly" option to the pledge form's cause list; ask the first ten givers personally at the demo's follow-up. |
| 4 | **Tickets** (58th; Kalye Tunes; Quantum Leap) | Tiered: brod, brod + family, patron table, student. Payment confirms registration. | Decide tiers with the events committee in October; the RSVP list is the pre-sale audience. |
| 5 | **Merchandise** | Pre-order-and-produce only. Jerseys were 23% of the 2025 Sportsfest spend; never produce on hope. | Canva mock-ups; a pre-order form; produce only what is paid. |
| 6 | **Alumni business directory** | A listing on the site for brod-owned companies — logo, one line, link — for an annual fee. This is the honest version of "pay to be featured": a **directory listing** is visibly commercial; a **citation** must never be. | Add a "Brod-owned businesses" page; ten founding listings at ₱5,000/year. |
| 7 | **Sponsored spotlight content** | A resident writes a profile of a brod's company or career; the company pays for the production and the promotion (site + Facebook + LinkedIn). Labelled "In partnership with" so the Citations register stays pure. | Pilot with two willing alumni after the 58th prospectus goes out. |
| 8 | **Awards processing fee / donation in honour** | Small line; keep fee and outcome visibly separate (PLAN.md §6). | Only after the panel and criteria are published. |
| 9 | **Pautakan as software** | The buzzer quiz-show system with "Atras" powers is already built for one event. Packaged, it is a product other engineering orgs and schools would rent for their own quiz nights. | Document it; run it for one other org's event for a fee; decide afterwards. |

**Cash discipline** carried from the 2025 Sportsfest (₱294,050 reported vs ₱136,050
collected; −₱71,960 before receivables): payment confirms registration; sponsor cash before
commitment; catering and merch released only after break-even.

---

## 6. The transparency ledger — what makes alumni give a second time

A Google Sheet in `Finance/`, one tab per event or fund, four lines each: **raised, spent,
balance, beneficiaries** (a count, never names). After every event the treasurer liaison
fills it; the site keeper publishes the four numbers on the event's page and on
`/donate`. The Association's officers see every row; members see the totals.

This is also the token of accountability the residents give the alumni board: the same
numbers the board would ask for, published before they ask.

---

## 7. Events as products

Every fraternity event follows one shape on the site, so the second event costs a tenth of
the first:

**page (facts that are certain only) → RSVP / interest capture → sponsor wall → tickets or
transfer instructions → the day → post-event record (photos, numbers, thanks) within two weeks.**

| Event | What it is | Status | Next on the site |
|---|---|---|---|
| **58th Anniversary** | Feb 2027, Gimenez Gallery | Page live, RSVP live | Rate card, awards nominations page (Nov), sponsor wall |
| **Quantum Leap Sports Series** | Pickleball, 22 Aug 2026 | Page live; first edition passed | Post-event record and photos; edition two facts when certain |
| **Kalye Tunes: UP Fair** | Flagship music festival; four months of planning, seven figures in and out | Ledger entry only | Its own page with sponsor tiers and the transparency ledger — the biggest single revenue and reputation lever the residents hold |
| **Mathrix** | Freshman math quiz bee | Ledger entry only | Registration page; the recruitment funnel for freshmen |
| **Pautakan** | Inter-org quiz show with buzzer software and Atras powers | Ledger entry only | Page + the software as a product (§5 #9) |
| **Kanalan** | Bowling for engineering orgs | Ledger entry only | Registration page |
| **Golf, basketball** | Alumni fundraisers | Not on site | One page each, sponsor wall, ledger |

---

## 8. Roadmap and timeline

**This week (demo):** the site as it stands, this playbook, the asks in §10.

**September 2026 — the list-building month**
- Board verifies the first cohort (20–30 brods) and grants Portal invites from `/admin`.
- Drive structure and Content Log created; five residents named as first contributors;
  first weekly review held.
- Feedback form live; pinned in Viber.
- Sponsor prospectus and souvenir-ad rate card drafted.
- Domain decision (`upemc2fraternity.org`) and the Association email address.

**October 2026 — the asking month**
- Sponsor asks go out (corporate budgets close Dec–Jan).
- Rate card published on `/anniversary`; awards categories screened; panel named.
- Kalye Tunes page with tiers, if the residents run it this year.

**November–December 2026**
- Awards nominations open (needs 8–10 weeks end to end).
- Tickets open; ad slots sold; merch pre-order.
- First "what was inscribed" monthly post.

**January 2027**
- Judging closes; merch ordered against paid pre-orders; final push.

**February 2027 — the 58th.**

**March 2027 — the close-out**
- Post-event record, sponsor fulfilment report, financial statement in the ledger,
  certificates of patronage (the Vibe Coders PH credentialing system is reusable).
- Handover review: who is keeper next year (§9).

**Platform backlog, ranked (after the above):** nightly Sheet export · outbound
acknowledgement emails · newsletter (Resend + subscribers table) · per-member history ·
alumni business directory page · assistance-fund intake behind the Portal · PayMongo when
KYB clears · companion app and AI archive (direction, not commitment).

---

## 9. Continuity — surviving the next graduation

- **Accounts belong to the Association, not a person:** Vercel project, Supabase project,
  Google Drive owner, Resend, the domain registrar, the Facebook page. Today most sit under
  Viron; the migration is a one-afternoon task once the Association's email exists.
- **A password manager vault** (Bitwarden, free for organisations at this size) holds the
  admin password, the Portal allowlist secret, and API keys. Two board officers have
  emergency access.
- **The keeper role rotates annually** with a documented handover: this playbook, the README,
  the glossary, and one recorded screen-share of the weekly publish run.
- **Running cost today is ₱0** (Vercel hobby, Supabase free). The free Supabase plan pauses
  after seven idle days and breaks deploys; a scheduled ping or the Pro plan (about ₱1,500 a
  month) removes that risk. Budget line for the Association: domain (~₱1,000/yr), Supabase Pro
  when the Portal has real use, Resend (free tier is enough).
- **Nothing depends on one AI session.** The skills and this document are the memory. A new
  keeper with Claude Code and this repo can publish on day one.

---

## 10. What cannot be coded — the asks for the president

1. **The mandate.** Say, in the Viber group and at the next general assembly, that this is
   the fraternity's official digital record and that contributions are expected from every
   batch. Adoption is a leadership act, not a feature.
2. **Name the people.** One editor, one board verifier, five first contributors, one
   sponsorship lead. First names, this week.
3. **The Association's own email and accounts**, so nothing lives under an individual.
4. **A roster verification session** — one hour with the board verifier to grant the first
   cohort of Portal invites. The roster never leaves the room; only hashes enter the system.
5. **The sponsor list** — twenty companies and which brod opens each door.
6. **His own goals for the term**, written into §8 so the roadmap carries his name as well.

---

## 11. Measures — one number per quarter

| Quarter | The one number | Why this one |
|---|---|---|
| Q4 2026 | Brods on the consented Portal list | The Association has never had a real, consented member list. Everything else is sold to it. |
| Q1 2027 | Pesos committed by sponsors before 31 Jan | Decides whether the 58th is cash-positive before a single table is set. |
| Q2 2027 | Pieces published through the pipeline | Whether the archive is alive without Viron in the loop. |
| Q3 2027 | Standing-order givers | Whether the assistance fund is endowed or case-by-case. |

Vanity numbers (page views, followers) are recorded but never presented as the measure.

---

## 12. Tool map

| Need | Tool the brotherhood knows | Connected to the site today | How |
|---|---|---|---|
| Write, review | Google Docs / Sheets / Drive | Yes — Google Drive MCP; `emc2-publish` skill | Weekly publish run |
| Feedback and contributions | Google Forms; `/contribute` | Forms → Sheet automatically; site → admin queue | Weekly triage |
| Design assets | Canva | Yes — Canva MCP available | Brand kit once, then residents self-serve |
| Video | CapCut, Premiere | Files only | Drop MP4 + poster in `Photos/` |
| Chat / distribution | Viber, Facebook, LinkedIn | Links out | Monthly digest post |
| Data, auth | Supabase | Yes — MCP | Admin queue, Portal |
| Hosting, analytics | Vercel | Yes — MCP | Auto-deploy from `main`; Web Analytics free |
| Email delivery | Resend | Env keys pending | Contact + acknowledgements |
| Decks | Gamma | Yes — MCP | Board decks from this playbook |
