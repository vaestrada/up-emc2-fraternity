# Glossary — the vocabulary of this site

Every term below is something this repository actually uses. Each entry gives the word,
what it means in plain language, and where to see it in the code, so the code becomes the
flashcard. Read it top to bottom once; after that, search it when a word comes up in a
review, a pull request, or a conversation with an engineer.

---

## 1. The anatomy of a page

| Term | What it means | Where it lives here |
|---|---|---|
| **Hero** | The first full screen a visitor sees. It carries one idea and one action. | `app/page.tsx`, a full-bleed photograph with the name bottom-left; `components/site/page-hero.tsx` for inner pages |
| **Above the fold** | Whatever is visible before scrolling. Borrowed from newspapers. The hero is above the fold. | Same |
| **Eyebrow / section label** | The small line of text *above* a heading that names the section. Ours is small Roman capitals in gold with a short rule beneath. | `.label` in `globals.css`; `components/site/section-label.tsx` |
| **Wordmark** | The organisation's name set as designed text. Distinct from a **logo mark** (the symbol) and a **lockup** (name + symbol locked together). | Hero `h1` is the wordmark; `public/logo/emc2-mark.png` is the mark; `emc2-lockup-white.png` is the lockup |
| **Navbar / header** | The fixed strip at the top with links. | `components/site/navbar.tsx` |
| **Sticky / fixed header** | A header that stays put while the page scrolls. `position: fixed` in CSS. | `navbar.tsx` — `fixed inset-x-0 top-0` |
| **Backdrop blur** | Frosted-glass effect behind a translucent element. | Retired from the navbar; a solid bar reads calmer |
| **CTA (call to action)** | The button you want people to press. A page has one **primary CTA** and at most one secondary. | "Give Back" (primary, gold) and "Read the history" (secondary, a text link) |
| **Marquee** | A strip of text scrolling sideways forever. | Retired 3 Sep 2026; see section 9 |
| **Stat band / stats strip** | A row of big numbers with small labels. | Replaced by the facts list on the homepage; see section 9 |
| **Ledger / register / roll** | The archive's names for lists: a ledger of projects, a register of members, a roll of patrons. | `/projects`, `/brods`, `/donate` |
| **Card** | A bordered box that groups related content. | `components/ui/card.tsx` |
| **Plate / figure** | A photograph mounted with a caption, the way a plate sits in a printed record. `Fig. 01` is a figure caption. | `components/site/archive-plates.tsx` |
| **Timeline** | A vertical list of dated milestones. | `/history` "Milestones" |
| **Bulletin / notices** | Dated announcements, shown only while relevant. | Homepage "Notices" |
| **Footer** | The bottom strip: secondary links, legal line, social links. | `components/site/footer.tsx` |
| **Skip link** | A hidden link that appears on keyboard focus so screen-reader and keyboard users can jump past the navigation. | `app/layout.tsx` — "Skip to content" |
| **Empty state** | What a section shows when it has no data yet. Ours are honest: "Entry pending — the current council". | `/brods` Council, `/history` Founders |
| **Modal / lightbox** | An overlay that takes over the screen, e.g. a photo enlarged with a close button. | `components/site/photo-gallery.tsx` |
| **Carousel / showcase** | Content that advances one slide at a time. | Retired 3 Sep 2026; the programme is a list now |
| **Progress rail** | The thin bars showing which slide you are on and how long until the next. | Retired with the carousel |
| **404 page / not-found** | What renders when a URL does not exist. | `app/not-found.tsx` |

## 2. Design language

| Term | What it means | Where it lives here |
|---|---|---|
| **Design system** | The written rules for colour, type, spacing, and components so every page feels like one product. | `DESIGN.md` |
| **Design tokens** | Named values (`--frat-gold`, `--hairline`) used instead of raw numbers, so a change in one place changes everything. | `app/globals.css` `:root` block |
| **Palette** | The set of colours. Ours is **committed**: one green field, scarce gold, cream for reading. | `DESIGN.md` §Color |
| **Hairline** | A very thin (1px) rule or border, usually at low opacity. | `--hairline`; `border-[var(--hairline)]` everywhere |
| **Duotone** | A photo re-coloured into two tones so every image sits in the same world. Done with a CSS `filter`. | Retired 3 Sep 2026; photographs run in colour |
| **Film grain** | A faint noise texture over the whole page to make flat colour feel like paper or film. | Retired 3 Sep 2026 |
| **Blueprint grid** | A faint drafting grid as a background. | Retired 3 Sep 2026 |
| **Display face / body face / mono face** | Fonts by role: display for titles and the section label (Cinzel), serif for lead lines, item titles, and quotes (Cormorant), sans for body and captions (Geist), monospace only for reference numbers in the admin (Geist Mono). | `app/layout.tsx` font loading; roles in `DESIGN.md` |
| **Tracking** | Letter-spacing. The section label is tracked 0.22em; buttons 0.14em. | `.label` in `globals.css` |
| **Leading** | Line height. `leading-tight`, `leading-relaxed`. | Headings vs. paragraphs |
| **Type scale / fluid type** | Sizes that grow with the viewport. `clamp(2.1rem, 6.6vw, 5.2rem)` means "never smaller than 2.1rem, never larger than 5.2rem, otherwise 6.6% of viewport width". | Hero `h1` |
| **Contrast ratio** | How readable text is against its background. WCAG AA wants 4.5:1 for body text. Cream on our green is ~14.8:1. Gold on cream is 2.45:1 and fails, which is why gold is never on cream. | `PRODUCT.md`, `REVIEW-2026-08-26.md` |
| **Anti-references** | Things the design must *not* look like. Naming them is how you keep AI-generated pages from drifting into the same three defaults. | `PRODUCT.md` §Anti-references |
| **Register (of voice)** | The tone of the copy: ours is "a state hall, not a startup". | `PRODUCT.md` |
| **Corner ticks** | The small L-shaped marks at the corners of a certificate frame. | Retired 3 Sep 2026 |
| **Ornament vs. evidence** | Our rule for generated imagery: it may set a mood (ornament) but never depict a real event (evidence). | `ATTRIBUTION.md` |

## 3. Motion and animation

| Term | What it means | Where it lives here |
|---|---|---|
| **Framer Motion** | The React animation library this site uses (`motion.div`, `AnimatePresence`, `useInView`). | `components/motion/*`, `roadmap-mockups.tsx` |
| **Reveal (scroll reveal)** | Content fades and rises into place the first time it scrolls into view. | `components/motion/reveal.tsx` |
| **Variants** | Named animation states ("hidden", "visible") declared once and reused. | `reveal.tsx` `effects` object |
| **Stagger** | Starting sibling animations a little apart so they cascade instead of popping together. | `delay={i * 0.15}` on the credo lines |
| **Easing** | The speed curve of an animation. `cubic-bezier(0.22, 1, 0.36, 1)` is an **ease-out quint**: fast start, long soft landing. "Apple's" curve. | `EASE` constants; `.hero-reveal` |
| **Spring** | Physics-based motion defined by stiffness and damping rather than duration. Used for the success checkmark. | `components/site/form-success.tsx` |
| **Ken Burns** | Slow zoom or pan on a still photo, named after the documentary maker. | Retired 3 Sep 2026 |
| **Engrave (blur-to-sharp)** | A title that resolves from a blur. | Retired 3 Sep 2026; titles rise and fade only |
| **Light sweep** | A single band of light passing across a surface once. | Retired 3 Sep 2026 |
| **Rule draw** | A line that draws itself outward from its centre. | Retired 3 Sep 2026 |
| **Scroll scrubbing / scroll-driven video** | Mapping scroll position to a video's playhead, so scrolling *is* the timeline. | Retired 3 Sep 2026 with the AI-generated sequences |
| **Pinned section / sticky track** | A tall wrapper whose inner screen sticks while you scroll through it. | Retired with scroll scrubbing |
| **Crossfade** | One thing fades out while the next fades in. | Roadmap mockups |
| **Enter / exit animation** | Motion when an element appears or disappears. `AnimatePresence` is what lets React animate something that is leaving. | `programme-showcase.tsx`, `profile-form.tsx` "Saved." |
| **Counter / number tween** | Animating a number from 0 to its value. | `components/motion/counter.tsx`, roadmap mockups only |
| **rAF (requestAnimationFrame)** | Asking the browser to run code right before the next frame; the correct way to drive per-frame animation. | `counter.tsx`, `scroll-cinematic.tsx` |
| **prefers-reduced-motion** | An operating-system setting that says "less animation, please". Every animation here honours it. | `globals.css` bottom; `MotionConfig reducedMotion="user"` |
| **Ambient loop** | A long, slow, low-opacity animation that lives in the background. | Retired 3 Sep 2026 |
| **Stillness** | The motion principle now: two movements exist (title rise, section rise) and nothing loops. | `DESIGN.md`, Motion |

## 4. The framework — Next.js and React

| Term | What it means | Where it lives here |
|---|---|---|
| **Next.js** | The React framework that turns files in `app/` into pages, handles routing, images, fonts, and server code. Version 15 here. | `package.json` |
| **App Router** | Next's file-based routing: `app/history/page.tsx` *is* `/history`. `layout.tsx` wraps every page. | `app/` |
| **Server Component (RSC)** | A React component that runs only on the server. It can read the database directly and ships no JavaScript to the browser. Default in the App Router. | Every `page.tsx` without `"use client"` |
| **Client Component** | A component that runs in the browser because it needs state, effects, or event handlers. Marked with `"use client"`. | All forms, `navbar.tsx`, anything with `useState` |
| **Hydration** | The moment the browser's JavaScript "wakes up" server-rendered HTML and makes it interactive. Animations gated on JS wait for this — which is why the hero now uses CSS. | `globals.css` `.hero-reveal` comment |
| **Server Action** | A function marked `"use server"` that the browser can call like a form submit; it runs on the server with secrets available. Our forms post to these. | `app/actions/submit-form.ts`, `app/admin/actions.ts` |
| **`useActionState`** | The React hook that wires a form to a server action and gives you pending/success/error state. | Every form component |
| **Route Handler** | A file named `route.ts` that answers an HTTP request directly (JSON, CSV, redirects). | `app/auth/callback/route.ts`, `app/admin/export/route.ts` |
| **Middleware** | Code that runs *before* a request reaches a page. Ours refreshes the Supabase session cookie on Portal routes only. | `middleware.ts` |
| **Metadata API** | Exporting `metadata` from a page sets its `<title>`, description, and social card. | Top of every `page.tsx` |
| **Open Graph (OG) image** | The preview picture Facebook, Messenger, and LinkedIn show when a link is shared. Generated per page from a React template. | `lib/og.tsx`, `app/**/opengraph-image.tsx` |
| **ISR / revalidate** | Incremental Static Regeneration: pages are pre-built and rebuilt on a schedule (`revalidate = 86400` = daily) instead of on every request. | `app/layout.tsx` |
| **`force-dynamic`** | Opt a page out of caching so it renders fresh every time. Used for `/admin`. | `app/admin/page.tsx` |
| **`revalidatePath`** | Tell Next to rebuild a cached page now, e.g. `/history` after a contribution is approved. | `app/admin/actions.ts` |
| **`next/image`** | Next's `<Image>`: resizes, lazy-loads, and serves modern formats automatically. `priority` marks above-the-fold images; `sizes` tells it how wide the image will render. | Everywhere images appear |
| **`next/font`** | Loads Google Fonts at build time and self-hosts them, so no request goes to Google at runtime. | `app/layout.tsx` |
| **Tailwind CSS (v4)** | Utility-class styling: `mt-6 font-display text-3xl`. Design tokens are exposed to it through `@theme inline`. | `globals.css`; every `className` |
| **`cn()` / `clsx` / `tailwind-merge`** | Helper that joins class names and resolves conflicts. | `lib/utils.ts` |
| **`cva` (class-variance-authority)** | Declares component *variants* (accent / outline / ghost, sm / lg) as named class bundles. | `components/ui/button.tsx` |
| **Turbopack** | Next's fast bundler used by `next dev --turbopack`. | `package.json` scripts |
| **TypeScript** | JavaScript with types. `pnpm run typecheck` runs the compiler without emitting files. | `tsconfig.json` |
| **ESLint** | The linter — flags likely bugs and style problems. | `eslint.config.mjs` |
| **pnpm** | The package manager (like npm, faster, strict). | `pnpm-lock.yaml` |
| **Environment variable** | Configuration read from the host, not the code. `NEXT_PUBLIC_*` ones are exposed to the browser; everything else stays server-side. | `.env.example` |
| **Feature flag** | An env switch that turns a feature on or off without a code change. | `lib/demo.ts` — `NEXT_PUBLIC_DEMO_CONTENT` |
| **`svh`** | "Small viewport height": 100svh fills the phone screen *under* the browser's address bar, unlike `100vh`. | Hero `min-h-[100svh]` |
| **`clamp()`** | CSS: `clamp(min, preferred, max)`. The basis of fluid type and spacing. | Hero sizes |
| **IntersectionObserver** | Browser API that tells you when an element enters the viewport. Used to lazy-load video and to start the showcase timer. | `scroll-cinematic.tsx`, `programme-showcase.tsx` |

## 5. Data, auth, and the Member Portal — Supabase and Postgres

| Term | What it means | Where it lives here |
|---|---|---|
| **Supabase** | Hosted Postgres plus auth, storage, and an instant REST API. Our backend. | `lib/supabase/*` |
| **Postgres** | The relational database under Supabase. | `supabase/migrations/*.sql` |
| **Migration** | A numbered SQL file that changes the database schema. Applied in order, never edited after it runs. | `0001_init.sql` … `0006_harden_portal_functions.sql` |
| **Schema** | The shape of the data: tables, columns, constraints. | Same |
| **RLS (Row Level Security)** | Postgres rules that decide *which rows* a given user may see or change. The real gate for the Portal. | `0003`, `0005`, `0006` policies on `members` |
| **Policy** | One RLS rule: `using (auth.uid() = id)` = "a member may touch only their own row". | Same |
| **Anon key / service-role key** | Two API keys. The **anon key** is public and limited by RLS; the **service-role key** bypasses RLS and lives only on the server. | `lib/supabase/client.ts` vs `lib/supabase/server.ts` |
| **`server-only`** | A package that makes the build fail if a server file is ever imported into browser code. | `lib/supabase/rsc.ts`, `lib/admin/auth.ts` |
| **Magic link / OTP** | Passwordless sign-in: you get a one-time link (one-time password) by email. | `components/portal/sign-in-form.tsx` `signInWithOtp` |
| **`shouldCreateUser: false`** | Tells Supabase "only sign in existing users, never create one" — so a stranger's email gets nothing. | Same |
| **Invite (`inviteUserByEmail`)** | The admin call that creates a user *and* emails them. The only way a Portal account comes to exist. | `app/admin/actions.ts` `grantMember` |
| **Allowlist** | The list of who is permitted. Ours stores only an **HMAC hash** of the email, never the email. | `member_allowlist` table |
| **HMAC / hash** | A one-way fingerprint of a value using a secret key. You can check a match; you cannot recover the email. | `allowlist_hash()` in `0006` |
| **Auth hook** | A Postgres function Supabase calls during sign-up or token issue. **Before User Created** can refuse; **Custom Access Token** can add claims. | `before_user_created_hook`, `custom_access_token_hook` |
| **JWT / claims** | The signed token a signed-in user carries. **Claims** are the facts inside it (`is_member: true`). RLS reads them. | `is_member()` |
| **`security definer`** | A function that runs with its *owner's* privileges instead of the caller's. Powerful, hence the strict grants in `0006`. | `0005`, `0006` |
| **`search_path`** | Which schemas Postgres looks in for unqualified names. Pinning it to `''` stops a class of privilege-escalation tricks. | `set search_path = ''` in `0006` |
| **Grant / revoke** | Giving or removing a role's permission to run a function or read a table. Postgres grants EXECUTE to PUBLIC by default — the bug `0006` fixes. | `0006` |
| **Session cookie** | The small piece of data the browser sends with each request to prove who you are. | `middleware.ts`, `lib/supabase/rsc.ts` |
| **Upsert** | Insert, or update if the row already exists. The RSVP form upserts so a second submission corrects the first. | `submit-form.ts` rsvp branch |
| **Unique index** | A rule that two rows cannot share a value (one RSVP per email per edition). | `0004` |
| **Signed URL** | A time-limited link to a private file (contributed photos). | `lib/contributions.ts` |
| **Storage bucket** | Supabase's file storage; "contributions" is private. | `CONTRIB_BUCKET` |
| **Advisor / linter** | Supabase's automated checks for security and performance problems. | Run via the Supabase MCP `get_advisors` |
| **Audit log** | A table that records who did what, for accountability and breach evidence. | `portal_access_log` |
| **PII** | Personally identifiable information. The roster is PII and never enters the database. | `PRIVACY.md` |
| **RA 10173** | The Philippine Data Privacy Act of 2012. Consent, purpose limitation, data minimisation, data-subject rights. | `PRIVACY.md`, `/privacy` |

## 6. Security

| Term | What it means | Where it lives here |
|---|---|---|
| **CSP (Content Security Policy)** | An HTTP header listing which origins the page may load scripts, images, and connections from. Too strict and it blocks your own backend — the bug fixed on 2026-09-03. | `next.config.ts` |
| **`connect-src` / `img-src`** | CSP directives for fetch/XHR/WebSocket targets and for images. | Same |
| **Security headers** | HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy. | Same |
| **Honeypot** | A hidden form field humans never fill; bots do, and are quietly discarded. | `name="website"` in every form |
| **Rate limiting** | Refusing more than N submissions per IP per window. | `submit-form.ts` `isRateLimited` |
| **Brute-force throttle** | Locking out repeated wrong passwords. | `app/admin/actions.ts` `login` |
| **Timing-safe comparison** | Comparing secrets in constant time so response speed leaks nothing. | `lib/admin/auth.ts` `safeEqual` |
| **Open redirect** | Letting a URL parameter send users to any site. Fixed by only honouring same-origin paths. | `app/auth/callback/route.ts` |
| **Formula injection** | A spreadsheet cell starting with `=` that runs when opened. The CSV export prefixes such cells. | `app/admin/export/route.ts` |
| **Defence in depth** | Several independent gates (disabled sign-up, `shouldCreateUser:false`, the before-create hook, RLS) so one failure does not open the door. | `0005` header comment |
| **Fail closed / fail open** | What a control does when it errors. Deny controls must fail closed; Supabase's access-token hook fails open, so it is enrichment only. | Same |

## 7. Performance, SEO, and accessibility

| Term | What it means | Where it lives here |
|---|---|---|
| **Core Web Vitals** | Google's three page-experience numbers: LCP, INP, CLS. | — |
| **LCP (Largest Contentful Paint)** | When the biggest above-the-fold element finishes painting. Should be the hero wordmark, not a decorative seal. | `globals.css` `.hero-reveal` comment |
| **CLS (Cumulative Layout Shift)** | How much the page jumps around while loading. Reserving image dimensions prevents it. | `width`/`height` on every `<Image>` |
| **Lazy loading** | Not fetching an asset until it is about to be needed. | `scroll-cinematic.tsx` `shouldLoad` |
| **Preload / `priority`** | The opposite: fetch this first. | Hero and page-hero images |
| **Sitemap / robots** | Files that tell search engines what to index. | `app/sitemap.ts`, `app/robots.ts` |
| **Canonical URL** | The one official address for a page, so duplicates do not split ranking. | `alternates: { canonical: "./" }` |
| **JSON-LD / structured data** | Machine-readable facts about the organisation for search engines' knowledge cards. | `organizationJsonLd` in `app/layout.tsx` |
| **WCAG** | The Web Content Accessibility Guidelines. AA is the usual target. | `PRODUCT.md` |
| **`aria-*`** | Attributes that tell assistive technology what an element is or does (`aria-live`, `aria-current`, `aria-label`). | Forms, navbar, showcase |
| **Focus ring** | The visible outline on the focused element for keyboard users. Never remove it; style it. | `focus-visible:ring-2` |
| **Touch target** | The tappable area; 44×44px is the comfortable minimum. | Showcase progress rail |
| **`inert`** | Attribute that removes a hidden region from tab order and the accessibility tree. | Mobile menu in `navbar.tsx` |
| **Semantic HTML** | Using `<nav>`, `<main>`, `<section>`, `<dl>`, `<figure>` for meaning, not just `<div>`. | Everywhere |

## 8. Product, process, and the words the board will use

| Term | What it means | Where it lives here |
|---|---|---|
| **Roadmap** | What is shipped, what is committed, what is a direction. Three honest columns. | `/roadmap`, `lib/content.ts` `roadmap` |
| **MVP** | Minimum viable product: the smallest thing that is genuinely useful. Phase 1 was the MVP. | `README.md` |
| **Phase / milestone** | Named chunks of the plan. | `PLAN.md` |
| **Warm list** | People who have raised a hand (RSVP) and can be approached first. | `anniversary_rsvps.interests` |
| **Moderation queue** | Where submissions wait for a human to approve them. | `/admin` |
| **Manual reconciliation** | Matching a self-reported payment reference against the bank's own records by hand. The honest interim before checkout. | Dues and pledge forms |
| **KYB** | Know Your Business — the verification a payment provider (PayMongo) runs before granting a merchant account. | `roadmap` "Checkout, Once KYB Clears" |
| **Content pipeline** | The path from a resident's Google Doc to a published page, with review in between. | `OPERATING-PLAYBOOK.md` |
| **Feedback loop** | A standing way for members to report problems and suggestions, and see them acted on. | Same |
| **Continuity plan** | Who keeps this running when the current committee graduates. | Same |
| **AI slop** | Generic, default-looking AI output: gradient text, glass cards, icon grids, stock strangers. The anti-references exist to prevent it. | `PRODUCT.md` |
| **Skill (Claude Code)** | A written procedure an AI coding session follows, so a workflow is repeatable without re-explaining it. | `.claude/skills/emc2-publish/SKILL.md` |
| **MCP (Model Context Protocol)** | The standard that lets an AI session talk to tools — Supabase, Vercel, Google Drive — directly. | `.mcp.json` |

## 9. What was removed on 3 September 2026, and why

The August design used a set of devices that are each reasonable and, together, are the
recognisable house style of AI-generated websites. Learning to name them is how you spot
them in a review before a visitor does.

| Device | Why it reads as generated | What replaced it |
|---|---|---|
| Monospace, uppercase, widely tracked labels on everything | The most common default of current design models; it signals "template" the moment it appears on captions and buttons too | One label style: small Roman capitals in the lockup's own face, once per section |
| Section numbering and figure captions in the archive manner | A stylistic tic borrowed from award-site templates, not from any real archive | Plain section names; sentence-case captions |
| Stacked atmosphere: grain, grid, watermark, sweep, breathing frame, Ken Burns | Effects layered to manufacture "premium"; a real institution's site is still | Nothing. The surface is the green field |
| Marquee with star separators | Startup landing-page furniture | Removed |
| Duotone-filtered photographs | A filter hides that the photographs are real, which is the one thing they should show | Colour photographs, cropped out of their printed frames |
| Icons in circles, icon-card grids | The component-library default | Rows with hairlines |
| Dashed "pending" boxes with a tinted fill | A callout pattern from documentation sites | A left gold rule and a sentence |
| Animated counters and a stat band | Metrics theatre | A facts list |
| Scroll-scrubbed and AI-generated video | The single strongest "generated" signal, and a Largest Contentful Paint cost | Removed; the real photographs carry the pages |
| The knowing, em-dash voice ("no checkout yet, so no pretending there is one") | The model's default register when asked to sound honest | Declarative sentences that state the fact |

**How to check a page for it in ten seconds:** count the fonts on screen (should be three at
most), count the effects that move without you (should be zero after the page settles), find
any text set in uppercase that is not a label or a button, and look for any photograph that is
not real. If a section would still be correct without a device, the device is decoration, and
decoration is where the generated look lives.

## 10. The Plate: the techniques on the homepage

Added 3 September 2026 with the new homepage. Each is a platform feature or a named pattern
an engineer will recognise; see `HOMEPAGE-DIRECTIONS.md` for why each was chosen.

| Term | What it means | Where it lives here |
|---|---|---|
| **Scroll-driven animation** | A CSS animation whose progress is tied to scroll position instead of time: `animation-timeline: scroll()` or `view()`. Native, no JavaScript, runs off the main thread. | `.plate-drift` in `globals.css` |
| **`animation-range`** | Which part of the scroll the animation maps onto, e.g. `0 100vh` means "from the top of the page to one viewport down". | Same |
| **Progressive enhancement** | Build the working version first, then add an effect only where the browser supports it, with `@supports (…)`. Nothing breaks elsewhere. | `@supports (animation-timeline: scroll())` |
| **Parallax** | Background moves slower than foreground, giving depth. Ours is 14% over one viewport. | The hero photograph |
| **Blend mode** | How a layer's colours combine with what is beneath: `color` keeps the underlying luminosity and applies the layer's hue; `multiply` darkens. | `.plate-ink`, `.plate-hatch` |
| **Engraving / hatch** | Fine parallel lines that read as an etched plate; here a `repeating-linear-gradient` of 1px lines, multiplied over the photograph. | `.plate-hatch` |
| **`pathLength`** | An SVG attribute that tells the browser to treat a path as if it were exactly that long, so `stroke-dasharray: 1` and `stroke-dashoffset: 1 → 0` draw any path, whatever its real length. | `components/site/seal-drawing.tsx` |
| **Draw-on / line-drawing animation** | Animating dash offset so a stroke appears to be drawn by hand. | `.seal-stroke` |
| **Construction lines** | In draughting, the faint circles and centre lines drawn before the object. Ours draw first at half weight. | `.seal-construction` |
| **Scrollytelling** | Long-form pages where scrolling advances a narrative with a fixed element that updates. | `components/site/chronicle.tsx` |
| **Sticky column** | `position: sticky` on one grid column so it holds while the other scrolls. | Same, `sticky top-44` |
| **`IntersectionObserver`** | A browser API that reports when an element enters or leaves a region of the viewport, without listening to scroll events. | Same |
| **`rootMargin`** | Shrinks or grows the observed region. `-45% 0 -50% 0` leaves a thin band through the middle of the screen. | Same |
| **Crossfade with `AnimatePresence`** | Framer's way of animating an element out while its replacement animates in, keyed by `key`. | The sticky year |
| **`useScroll` / `useSpring`** | Framer hooks: page scroll progress as a motion value from 0 to 1, and a spring that smooths it. | `components/site/year-scale.tsx` |
| **Timeline rail / scale** | A ruler of years with a progress fill; here the fraternity's own chronology as the page's progress bar. | Same |
| **`text-wrap: balance`** | Lets the browser even out the line lengths of a heading so no single word is orphaned on the last line. | `globals.css` |
| **View Transitions API** | Browser-native morph between two page states, including shared elements across navigations. Deferred here; see directions E. | `HOMEPAGE-DIRECTIONS.md` |
| **Variable font axes** | A font with continuous weight, width, or optical-size axes set through `font-variation-settings`. Not used; see directions D. | Same |
