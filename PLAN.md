# Working Plan — Platform Expansion & the 58th Anniversary

Working document for the Board of Trustees. Decisions taken so far are recorded at the top;
everything below the fold is an unscreened idea bank, kept deliberately broad so the board,
the residents, and volunteers can screen it down rather than start from a blank page.

Last updated: 2026-09-03.

---

## 0. Delivery status

Audited against the live site on 3 September 2026. `main` is the deployed branch; the tag
`v1.0-demo` is the verified board-demo build and the restore point.

### Shipped and live

| Area | What exists | Route |
|---|---|---|
| Public record | Home, history, projects, prominent brods, privacy, 404 | `/`, `/history`, `/projects`, `/brods`, `/privacy` |
| Recruitment | Join page: what the brotherhood gives, who it is for, three steps | `/join` |
| 58th Anniversary | Save-the-date page with RSVP capture, programme with honest status lines, archive plates | `/anniversary` |
| Giving | Give Back with the giving gate, impact, pledge form, Roll of Patrons (opt-in, names only) | `/donate` |
| Contribution intake | Submit memories, photographs, citations; published to `/history` after review | `/contribute` |
| Sports series | Quantum Leap, first edition recorded | `/quantum-leap` |
| Member Portal | Magic-link sign-in (invitation only), profile, opt-in directory, dues recording | `/portal/*` |
| Board queue | RSVP list with headcount, contributions, pledges, messages, dues, allowlist, CSV export on every list | `/admin` |
| Roadmap | Nine entries across shipped / committed / direction, each with a visual | `/roadmap` |
| Data | Nine tables, RLS on all, functions hardened (`0006`), zero advisor warnings | Supabase |
| Design | The Modern Charter; seal in metal (WebGL, with fallback); scroll-reveal hero; photographs graded to the brand | — |
| Operations | Google Drive content pipeline, Content Log sheet, draft template, `emc2-publish` skill | — |

### Pending — the September–October critical path

| # | Item | Why it matters | Status |
|---|---|---|---|
| P1 | **Claim-your-record flow** | §4 says the list built in September is what everything is sold to in January. | **Shipped** — `/portal/claim`, queue in `/admin`. A claim is a request; the board still verifies against the offline roster. |
| P2 | **Brotherhood Assistance Fund** | §3. The most emotionally real thing on the list. | **Shipped** — `/assistance`, private intake at `/portal/assistance`, triage and public ledger in `/admin`. The fund itself still needs endowing. |
| P3 | **Awards programme** | D6. | **Shipped** — `/awards` publishes the eight proposed categories, their criteria, and the four-step process; screening queue in `/admin`. Nominations open when the board flips `awards.nominationsOpen`. Panel still to be appointed. |
| P4 | **Sponsorship and souvenir ads** | §5 ranks these the two largest revenue lines. Prospectus, packages, rate card, sponsor wall. Corporate budgets close Dec–Jan. | **Building** |
| P5 | Newsletter | On the roadmap as committed. Needs the member list (P1) to be worth sending. | After P1 |
| P6 | Per-member giving and attendance history | Without it every year restarts blind. | After P1 |
| P7 | Event check-in with QR codes | For the anniversary itself, not for launch. | Feb 2027 |

### Parked, with the reason

| Item | Why parked | Unblocks when |
|---|---|---|
| On-site checkout (tickets, merch, nominations) | D7 — PayMongo merchant account unresolved | Association completes KYB |
| Official receipts for ticket revenue | D8 — owner's call to proceed; treasurer to confirm | Treasurer confirms position |
| Tax-deductibility claims | No donee-institution status | PCNC → BIR accreditation |
| Bulk roster import | `PRIVACY.md` rule 4 forbids it, permanently | Never. Claim-your-record replaces it |
| Public case pages for assistance | D1 — RA 10173 sensitive personal information | Never; the programme model replaces it |
| Instagram link | Handle not confirmed | Set `site.instagram` in `lib/content.ts`; the footer renders it automatically |

### Waiting on the Board — these block real content, not code

Each of these has a place in the code already, holding `null` or an empty array, and the page
renders an honest "entry pending" until it is filled.

| What is needed | Where it lands | What it unblocks |
|---|---|---|
| SEC registration number | `association.secRegNo` | The footer and `/donate` legal line |
| The ten founding scholars | `founders` in `lib/content.ts` | `/history` founding section |
| Current council / officers | `officers` | `/brods` council section |
| Brods to remember | `inMemoriam` | `/brods` in memoriam section |
| Official Association email | env + `lib/content.ts` | Receipting, newsletter sender |
| Domain (`upemc2fraternity.org`) | `NEXT_PUBLIC_SITE_URL` | Public launch, sender reputation |
| Exact day in February 2027 | `anniversary.date` | Save-the-date reads "February 2027" until then |
| Instagram handle | `site.instagram` | Footer social row |
| GCash / Maya / bank details | `/donate` | Currently reads "being finalised" |
| Quantum Leap: did 22 Aug run, and where | `/quantum-leap` | The page speaks of it as held |

---

## 1. Decisions taken

| # | Decision | Taken |
|---|---|---|
| D1 | The assistance fund uses **private intake**. Requests never appear publicly. | 2026-08-24 |
| D2 | The **SEC-registered Alumni Association** is the receiving and receipting entity for all funds. | 2026-08-24 |
| D3 | Assistance contributions are **private transactions** (GCash / direct transfer to the Association or an assigned BOT officer), not on-site checkout. | 2026-08-24 |
| D4 | Contributors are recognised publicly **by opt-in only** — name and batch, never amounts. | 2026-08-24 |
| D5 | The 58th Anniversary proceeds in **February 2027**. Venue: **Gimenez Gallery**, College of Fine Arts, U.P. Diliman (111 Roces St.). Held, not contracted. | 2026-08-24 |
| D6 | The **awards programme runs at this anniversary**, with nominations opening Nov–Dec 2026. | 2026-08-24 |
| D7 | **PayMongo is parked.** Payments stay manual-reconciliation until the Association resolves the merchant account. | 2026-08-24 |
| D8 | **Tickets proceed without official receipts** for now (owner's call). Flagged below — the treasurer should confirm before tickets go on sale. | 2026-08-24 |

### Why the 58th, and not the 57th

The Association's own record settles it: the **55th Anniversary was 24 February 2024**
(`lib/content.ts`, milestones). February 2026 was therefore the 57th, and the next
celebration — February 2027 — is the **58th**. That leaves roughly **six months** from today.

---

## 2. Open items and owners

| Item | Owner | Blocks |
|---|---|---|
| Association merchant account / PayMongo feasibility | Viron → Association officers | All on-site checkout: tickets, nominations, merch |
| Official Association email address | BOT | Receipting, newsletter sender domain |
| SEC registration number | BOT | `association.secRegNo` is `null` in `lib/content.ts` |
| Domain ownership for `upemc2fraternity.org` | BOT | Public launch, sender reputation |
| Gimenez Gallery — capacity, rate, available dates, contract | Events committee | Date lock, ticket pricing, break-even |
| Exact day in February 2027 | Events committee | Save-the-date page currently reads "February 2027" |
| Who signs contracts, waivers, and issues receipts | BOT | Sponsors, venue, merch suppliers |
| Receipting position for ticket revenue (see D8) | Association treasurer | Confirm before tickets go on sale |
| Donee-institution status (PCNC → BIR) | BOT | Whether corporate gifts are tax-deductible |
| Counsel check: does a standing members-funded assistance programme need a DSWD solicitation permit? | BOT / counsel | Whether the fund page may solicit beyond members |

---

## 3. The Brotherhood Assistance Fund

The most emotionally real thing on this list, and the one most exposed if built naively.
Hospitalisation, accident, illness, and bereavement are the most frequent asks in the Viber
chats, and they currently get lost because they are spread across multiple group chats with
no record and no follow-through.

### The model — public programme, private transaction, opt-in honour

Three layers, deliberately separated:

**Layer 1 — the public programme page.** A standing initiative of the fraternity with a name,
a purpose, and a standing invitation. It describes *the programme*, never a case. No names, no
diagnoses, no photographs of anyone's family. This is what makes the whole thing lawful and
dignified at once: we are not publishing a sick person, we are publishing a promise.

**Layer 2 — private intake.** A member-only form behind the Portal (`/portal/assistance`).
The request goes to the board and to nobody else. Handled the way `contributions` and
`pledges` already are: server action, service-role key, no anon or authenticated read policy,
so the request is invisible even to other signed-in brods.

**Layer 3 — private giving, public honour.** A brod who wants to help contacts the assigned
officer and transfers directly (GCash, bank, cash). The officer acknowledges it. If — and only
if — the giver opts in, their **name and batch** join a public Roll of Patrons. Amounts never
appear. This is already built: see `lib/patrons.ts` and the `consent_public` column added in
`supabase/migrations/0002_patron_consent.sql`. The assistance fund reuses that exact mechanism
rather than inventing a second one.

### Why this shape and not the obvious one

The obvious build — a public case page with a donate button and a progress bar — raises more
money per case and is a genuine liability. Health information about a brod, and especially
about a brod's spouse or parent, is **sensitive personal information** under RA 10173, a
stricter category than the roster already fenced off in `PRIVACY.md`. A public case page
processes sensitive data about a third party who never consented. The programme-level model
solicits for a fund the brotherhood endows, which is a materially different act.

Open question for counsel (logged above): public solicitation of charitable funds in the
Philippines is regulated (the PD 1564 regime, administered by DSWD). Soliciting from one's own
members is a different posture from soliciting from the general public. The programme page
should be written members-first until counsel says otherwise.

### The token of appreciation

Two forms, both cheap:

- **Digital** — a verifiable certificate of patronage at a public URL. The credentialing
  system already built for Vibe Coders PH (`~/projects/vibe-coder-ph`: `event_certificates`,
  public verification route, revocation, per-recipient OG image, LinkedIn "Add to Profile")
  is directly reusable. A patron shares a link that renders their own certificate.
- **Physical** — a lapel pin or engraved token, handed at the anniversary. Also the natural
  moment to read the Roll of Patrons aloud.

### The transparency ledger

Published on the programme page: raised, disbursed, balance, number of brods assisted. No
names on either side. This is the single thing that determines whether someone gives a
**second** time, and it costs almost nothing given the existing admin tables.

---

## 4. The 58th Anniversary — critical path

Working backwards from late February 2027. The long pole is the merchant account (D7); every
line that takes money on-site waits behind it, which is why the fallback everywhere is the
same manual-reconciliation pattern the Portal already uses.

| Month | Must happen | Why this month |
|---|---|---|
| **Sept 2026** | Save-the-date page live with email capture. Viber → Portal "claim your record" flow. Sponsor prospectus drafted. | The list built in September is what everything is sold to in January. Six months of list-building beats any amount of page polish. |
| **Oct 2026** | Awards nominations open. Sponsor asks go out. Souvenir-programme ad rate card published. | Corporate budgets close in Dec–Jan. A sponsor ask landing in December has already missed. |
| **Nov–Dec 2026** | Nominations build-up and campaigning. Ticket sales open. Ad slots sold. | Nominations need 8–10 weeks end to end: intake → screening → judging → announcement. |
| **Jan 2027** | Judging closes. Winners locked (announced at the event). Merch order placed. Final ticket push. | Merch production runs 4–6 weeks. Ordering in February is ordering too late. |
| **Feb 2027** | The event. | |
| **Mar 2027** | Post-event: sponsor fulfilment report, financial statement to members, certificates issued, ledger published. | Determines whether sponsors renew and whether brods give again next year. |

---

## 5. Revenue lines

Ranked by money-per-unit-of-effort, which is not the order they usually get attention in.

1. **Souvenir-programme advertisements.** Routinely the largest single line at Philippine
   anniversary events — alumni-owned and alumni-led companies buying pages. Sell it twice:
   printed in the programme, and as a sponsor wall on the event page. Needs only a rate card
   and a deadline.
2. **Sponsorship packages.** Reusable inventory across the Quantum Leap Sports Series and the
   anniversary, so the rate card is built once. The 2025 Sportsfest lesson applies directly:
   *do not count unsigned or unpaid pledges as available cash.*
3. **Recurring giving.** A ₱500/month pledge is worth many times a one-off gift, and it is what
   funds the assistance fund permanently instead of case by case. The anniversary is the moment
   to convert one-time givers into monthly ones.
4. **Tickets.** Tiered: brod, brod + family, patron table, student rate.
5. **Merchandise.** Jerseys were 23% of 2025 Sportsfest expenses — merch is a cash risk unless
   it is **pre-order-and-produce**, never produce-and-hope.
6. **Awards nomination / processing fees.** Smallest line. See the caution below.
7. **Memorabilia auction / legacy items.** Low effort, unpredictable, occasionally large.

### Cash discipline, carried over from the 2025 Sportsfest

The 2025 records showed ₱294,050 reported revenue against ₱136,050 actually collected, and a
cash position of roughly **−₱71,960** before receivables. Food was 40% of expenses, jerseys 23%.
The gates that follow from that:

- Payment confirms registration. A reservation is not a registration.
- Sponsor cash is deposited before the commitment it funds is made.
- Catering and merch are released only after break-even is secured.

---

## 6. The awards programme

Confirmed for this anniversary (D6). Nominations open Nov–Dec 2026.

### Structure

- **Nomination intake** — open to any member; nominee need not be the nominator.
- **Screening** — a committee checks eligibility and evidence before anything reaches judges.
- **Judging** — a named panel against published criteria.
- **Announcement** — at the event, not before. The suspense is the build-up.

### Categories — starting set, to be screened

Professional excellence (Engineering), Public Service, Entrepreneurship, Academe & Research,
Young Alumnus (last 10 batches), Service to the Brotherhood, Lifetime Achievement, and a
posthumous honour. Screen down; do not launch with all eight.

### One structural caution on paid nominations

Charging to *be nominated* reads as buying an award, and that directly attacks the positioning
`PRODUCT.md` exists to protect — "engraved, learned, quietly powerful," the voice of a state
hall. Keep the fee and the outcome visibly separate:

- Publish the judging panel and the criteria **before** nominations open.
- Frame any fee as a **processing fee** or as a **donation in the nominee's honour**, and say
  which it is.
- Never let payment status be visible to judges.

Same money collected, no damage to the institution.

---

## 7. Platform work, mapped to the three rings

The public/members split already exists in the codebase; it just was not named. Nothing below
requires a second platform — a separate "membership site" would mean two auth systems, two
deployments, and two places for the 490-row roster to leak.

| Ring | Route | Access | New work |
|---|---|---|---|
| **Public record** | `/`, `/history`, `/projects`, `/donate` | anyone | Assistance-fund programme page + Roll of Patrons + ledger; anniversary save-the-date; awards nomination landing; sponsor wall; Instagram link alongside Facebook (`lib/content.ts`) |
| **Members** | `/portal/*` | magic link | Assistance intake; claim-your-record flow; event RSVP; nomination submission; giving history |
| **Board / admin** | `/admin` | service-role | Assistance triage and disbursement log; nomination screening; acknowledgement queue; ledger figures |

### Viber

Do not try to absorb it. It is where the brotherhood actually lives, and it will beat any forum
built here. Use it as the **distribution channel into** the platform: a pinned link, and a
claim-your-record flow where a brod signs in with the email already on the roster and claims
their own record. That respects `PRIVACY.md` rule 4 — no bulk import ever happens — and yields
the one asset the Association does not currently have: a **real, consented member list**.

Facebook is already wired (`lib/content.ts`). Add Instagram. Viber gets a join link, not an
integration.

---

## 8. Idea bank — unscreened

Deliberately broad. Nothing here is committed; the point is to have more than can be done, so
the board can cut rather than invent under time pressure.

**Fundraising mechanics**
- Batch-vs-batch giving leaderboard (Batch '92 vs Batch '05) — proven alumni-giving mechanic,
  builds on the existing `pledges` table, turns the Viber chats into the engine
- Corporate matching gifts (many senior brods sit where they can authorise this)
- Named endowments — a scholarship or fund carrying a brod's or a batch's name
- "Adopt a resident" — an alumnus underwriting one resident's semester
- Pledge-a-month recurring giving
- Legacy giving and bequests
- Anniversary raffle with donated corporate prizes
- Golf, run, or a second Quantum Leap Sports Series edition as a satellite fundraiser

**Programme ideas beyond crisis assistance**
- Scholarship fund — the non-crisis counterpart, and the truest reading of "Engineered for Service"
- Bereavement assistance (death of a brod, or of a brod's parent) — same intake, and
  `inMemoriam` already exists as an empty type in `lib/content.ts`
- Emergency calamity response (the 2020 COVID relief operation is already a recorded milestone)
- Mentorship pairing: alumni to residents
- Job board and referrals among brods
- Board-exam and licensure review support for residents
- Medical directory: which brods are doctors, and where — the fastest help in a crisis is often
  a phone number, not money

**Anniversary programme**
- Necrology segment
- Founders' recognition — the ten scholars (`founders` is still an empty array in `lib/content.ts`)
- Batch reunions within the main event
- Documentary and oral-history recording of the earliest surviving batches — genuinely urgent;
  the 1967–1975 batches will not be available indefinitely
- Time capsule
- Photo exhibit from the archive
- Souvenir programme as a permanent digital record, not only a printed book

**Platform**
- Per-member giving and attendance history (without it, every year restarts blind)
- Event check-in with QR codes — and *reconcile registration against check-in*; the Gen AI to Z
  event's true show rate was 49.3% of 795, a number most organisers never learn about themselves
- Verifiable digital certificates for patrons, awardees, and volunteers
- Newsletter (already on the roadmap: Resend plus a subscribers table)
- Volunteer and committee module — who owns what, visible
- Email reminders tied to the event calendar
- Member-facing financial statement after every event

**Relationship to Events Brain**
Build the anniversary here, specifically and honestly, and let it serve as the design document
for `events-brain` — not the reverse. A six-month hard deadline with a real association, real
money, and real receipts is the worst possible *first customer* for an unfinished product, and
the best possible *source of requirements* for one. The gaps already identified in
`04_projects/events-brain.md` — sponsor deliverable tracking, PHP payment rails, BIR receipts,
RA 10173 compliance — are exactly the ones this event will force us to solve.

---

## 9. Risk and compliance register

| Risk | Exposure | Mitigation |
|---|---|---|
| Publishing health information about brods or their relatives | RA 10173 sensitive personal information; a third party who never consented | Programme-level page only; private intake; no case pages (D1) |
| Public solicitation without a permit | PD 1564 / DSWD regime | Members-first wording until counsel confirms; logged in §2 |
| Ticket, nomination, or merch revenue without official receipts | BIR exposure sits with the Association as the receiving entity, not with the committee | Owner's call taken (D8) to proceed without them for tickets. Treasurer to confirm the position before tickets go on sale; sponsorship and ad revenue are the larger and more visible exposure and should be looked at separately |
| Donations assumed tax-deductible | They are not, absent donee-institution status | Do not claim deductibility on any page until accredited |
| Roster leak | 490 rows of sensitive PII | `PRIVACY.md` stands; claim-your-record only, no bulk import, ever |
| Cash-negative event | The 2025 Sportsfest precedent: −₱71,960 before receivables | Payment confirms registration; sponsor cash before commitment; pre-order merch |
| Awards seen as purchasable | Direct damage to the positioning in `PRODUCT.md` | Panel and criteria published first; fee separated from outcome |
| Scope beyond volunteer capacity | Six months, five workstreams | Screen this document with the board before building; the idea bank is meant to be cut |
