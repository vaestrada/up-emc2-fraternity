# Design

## The Modern Charter

Reference: the layout system of phideltatheta.org as it stands in 2026, rebuilt on the EMC²
brand. The reference is kept for its *structure*: a full-bleed photographic hero with a
centred mark and one tagline, an angled edge into a light page, huge bold headlines with a
short gold dash as the section label, pill buttons, photographs and cards with a 24px
corner, a horizontal card slider with round arrow buttons, a dark rounded call-to-action
panel with a watermark, tinted stat tiles with serif numbers, a four-up portrait grid, and a
dark footer with four columns. What is *ours*: the colours, the faces, the seal, the
photographs, and the words.

The two earlier systems of 3 September (the dark "Charter" and "The Plate") are recorded in
`HOMEPAGE-DIRECTIONS.md`. The metal seal survives from them as the hero's centrepiece.

## Colour

| Token | Value | Role |
|---|---|---|
| `--paper` | `#f7f4ec` | the page (their white) |
| `--tint` | `#e6eee3` | alternating sections and stat tiles (their pale blue) |
| `--card` | `#ffffff` | form fields and cards |
| `--fg` | `#07200c` | text and headlines (their navy) |
| `--fg-muted` | `rgba(7,32,12,.7)` | body copy |
| `--brand` | `#0c3e06` | solid buttons, links |
| `--frat-gold` | `#c38f0e` | the dash on section labels; the navbar's one gold pill |
| `--ink` | `#04150a` | dark panels: the Portal panel, the closing panel, the footer |
| `--hairline` | `rgba(7,32,12,.12)` | rules and borders |

Gold is never body text on paper (2.45:1 fails). It is the dash and the navbar's action.

## Typography

| Role | Face | Setting |
|---|---|---|
| Display headlines | Cinzel 700 (`.display`) | `clamp(2.25rem, 4.5vw, 3.5rem)` for section titles; up to `5.25rem` for "We are EMC²." |
| Card and story titles | Geist 700 | 22–30px |
| Section label | Geist 700, 13px, uppercase, tracked 0.12em, with a 48×3px gold dash (`.label`) | one per section |
| Lead | Geist, 20–22px, muted (`.lead`) | under every headline |
| Body | Geist 17px / 1.6 | |
| Stat numbers | Cormorant 600, 56px (`.stat`) | tinted tiles only |
| Quotes and the credo | Cormorant 500, 28–30px | `/history` |

## Components

- **Island navbar** (`navbar.tsx`): a floating rounded bar over any ground, blurred paper,
  the mark and name at left, the links, the one gold pill at right. Present on every page;
  a rounded panel drops beneath it on phones.
- **Pill buttons** (`button.tsx`): `default` brand fill, `gold`, `outline`, `white`,
  `outline-light` for dark panels. Radius 9999px, 48px tall, bold 15px.
- **Scroll hero** (`scroll-hero.tsx`): the reference's opening, exactly. The page starts on
  the photograph (a video later, same component) with only a scroll cue. Across the first
  screen of scrolling a green panel grows down from the top, its chevron edge leading (a
  `clip-path` polygon written from scroll progress), and the seal in metal, the name,
  "University of the Philippines", "Take the quantum leap", and the Join and Give Back pills
  rise inside it. A 200svh section with a sticky 100svh stage; no scroll hijacking.
- **Page hero** (`page-hero.tsx`): tint ground, dash label, display title, lead, an optional
  rounded photograph.
- **Card slider** (`card-slider.tsx`): native scroll-snap, round arrow buttons, rounded
  images, bold titles, a gold-underlined "Learn more".
- **Dark panel**: `rounded-card bg-[var(--ink)]` with the mark as a large low-opacity
  watermark and centred content; the `on-dark` class flips label colour.
- **Stat tiles**: `rounded-card bg-[var(--tint)]` with a `.stat` number and a caption.
- **Portrait grid** (`brod-card.tsx`): square rounded photograph, uppercase batch, bold
  name, honour.
- **Lists**: hairline-separated rows in a two-column grid, as before.
- **Pending entries**: a left gold rule and a sentence.
- **Forms**: white fields with a 12px radius in a rounded card.

## Layout

- Container `max-w-6xl`; sections `py-20 md:py-28`; sections alternate paper and tint.
- Photographs and cards: `rounded-card` (24px). Small thumbnails: `rounded-2xl`.
- Decorative motif: the mark's diamond, six of them in a 3×2 grid in gold, at a section
  corner, the way the reference repeats its six stars.

## Motion

The seal turns in metal; the scroll cue breathes; sections rise once on entry; images grow
2–3% on hover. Nothing else moves. `prefers-reduced-motion` collapses all of it.

## Voice

Declarative sentences. Headlines are short and end with a full stop, as the reference's do:
"We are EMC²." "Get involved." "Give back."
