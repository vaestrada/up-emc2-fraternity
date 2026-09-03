# Design

## The Charter

The site reads as the official record of a fifty-seven-year-old institution: a university
charter, a hall of records, a society's annual report. One green field carries every page;
cream is the reading colour; gold appears only where honour or action is meant. Real
photographs of real brods, in colour, carry the feeling. Typography carries the rest. The
surface is still.

This replaces "The Archive" theme of August 2026, which layered film grain, a blueprint
grid, a rotating watermark, a light sweep, a breathing frame, Ken Burns drift, a marquee,
monospace uppercase labels with `№ 01 —` numbering, duotone-filtered photographs, and
AI-generated video. Each was defensible alone. Together they were the current AI-default
"tech-luxury" kit, and the site read as generated. The rule now: **if an effect could be
removed and the page would still be correct, remove it.**

## Colour

- `--ink: #04150a` deepest ground, alternating sections and the footer
- `--canvas: #071e0c` page ground
- `--surface: #0b2a12` cards and forms
- `--frat-cream: #f2ecdc` text
- `--frat-gold: #c38f0e` section labels, the short rule beneath them, the accent button
- `--frat-gold-light: #e3b94a` links, honours, hover states
- `--hairline: rgba(242,236,220,0.14)` every rule and border. Hairlines are cream, not gold.

Gold is never a background, never body text, never a border on a box. At most one solid
gold element per view, and it is a button.

## Typography

| Role | Face | Setting |
|---|---|---|
| Page and section titles | Cinzel (`font-display`), weight 400 | `h1` clamp(2.4rem, 5.2vw, 4.25rem); `h2` 1.875–2.25rem; never bold |
| Item titles, lead lines, quotes | Cormorant (`font-serif`), weight 500–600, upright | `.lead` 1.375–1.5rem; item titles 1.5rem |
| Body | Geist (`font-sans`) | 17px / 1.7 on the body; 15px in lists and captions |
| Section label | Cinzel, 11px, uppercase, tracked 0.22em, gold | `.label`, with `.rule` beneath; one per section |
| Captions and metadata | Geist, 13px, cream at 55% | `.caption`, sentence case |
| Reference numbers, exports | Geist Mono | admin only |

Italics are reserved for a quoted motto. No gradient text, no tracked monospace, no
uppercase running text.

## Photography

Photographs are real, from the Association's own record, shown in colour with no filter.
The three 55th Anniversary photographs were cropped out of their printed frames
(`public/photos/anniv55-*.jpg`); portraits were cropped out of their social-card layouts
(`public/photos/brod-*-portrait.jpg`). Every photograph is mounted with a hairline and a
sentence-case caption that says what it is and when.

AI-generated imagery does not appear on the public record. The labelled placeholders in
`lib/content.ts` are off by default (`lib/demo.ts`) and exist only for walkthroughs.

## Components

- **Page hero** (`page-hero.tsx`): label, title, lead; optionally a photograph beside them.
  Left-aligned. The homepage hero is a full-bleed photograph with the same text bottom-left.
- **Section label** (`section-label.tsx`): the one way a section announces itself.
- **Rows, not cards**: lists of projects, milestones, programme items, facts, and officers
  are hairline-separated rows in a two-column editorial grid (label column left, content
  right). Boxes are used only for forms.
- **Pending entries**: a left gold rule (`border-l-2`) with a label and a sentence. Never a
  dashed box.
- **Buttons** (`button.tsx`): rectangular, sans, 12px, tracked 0.14em, uppercase. Accent is
  solid gold; outline is a cream hairline. Hover changes colour only. Nothing lifts.
- **Photographs** (`archive-plates.tsx`, `brod-card.tsx`): hairline mount, caption below.
- **Forms**: surface ground, hairline border, cream inputs on 5% white.
- **Icons**: none in the public pages except the social marks in the footer. No icon circles.

## Layout

- Container `max-w-6xl`, `px-6`.
- Section rhythm `py-20 md:py-28`; the homepage patronage band `py-24 md:py-32`.
- Sections alternate `--canvas` and `--ink`, each closed by a hairline.
- Editorial two-column grid `md:grid-cols-[1fr_1.5fr]` for label + content sections.

## Motion

Two movements exist. The page title rises 10px and fades over 0.7s in CSS on first paint.
Everything below the fold rises 14px and fades over 0.6s once, when it enters the viewport.
Hover states change colour. Nothing loops, drifts, sweeps, scrubs, breathes, or spins.
`prefers-reduced-motion` collapses both movements to nothing.

## Voice

Declarative sentences. No em-dash asides, no self-commentary about honesty, no wordplay in
running copy. The motto is the motto; the rest is the record. See `PRODUCT.md` for the
register and the anti-references.
