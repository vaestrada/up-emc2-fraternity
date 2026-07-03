# Design

## Visual Theme

"The Archive": a leather-bound dark green hall of records with gold-foil engraving and aged-paper cream. Dark theme is intrinsic (evening hall, brass and bronze under warm light), not a style choice. Color strategy: **Committed** — the green field carries the whole surface; gold is the scarce second voice; cream is the reading color.

## Color Palette

- `--ink: #04150a` — deepest ground (footer, alternating sections)
- `--canvas: #071e0c` — page ground
- `--surface: #0b2a12`, `--surface-raised: #10331a` — cards, forms
- `--frat-gold: #c38f0e` — primary accent, CTAs, hairlines (never wallpaper)
- `--frat-gold-light: #e3b94a` — hover states, fine gold text
- `--frat-cream: #f2ecdc` — foreground text
- `--hairline: rgba(195,143,14,0.25)` — gold hairline borders
- Existing `.gold-foil` gradient-text utility is legacy; prefer solid gold or cream for new headings (gradient text is banned going forward).

## Typography

- Display: Cinzel (`--font-display`) — Trajan-style Roman capitals, matches the official lockup. Headlines, wordmark, year figures.
- Serif: Cormorant (`--font-serif`) — classical italics for mottos, credo lines, figure quotes.
- Sans: Geist (`--font-sans`) — body text.
- Mono: Geist Mono (`--font-mono`) — eyebrows, annotations, coordinates, captions; always uppercase with 0.2–0.45em tracking at 10–11px.
- Hierarchy: clamp()-based display sizes; body max width ~65ch.

## Components & Patterns

- Numbered section eyebrows: `№ 0x — Name` in tracked mono gold.
- Archival plates: photos get the `.duotone` green-grade filter, hairline border, and a `Fig. 0x` mono caption; bloom to color on group hover.
- Engraved-plaque buttons: rectangular, mono uppercase, tracked; gold fill (accent) or gold hairline (outline). No pill radii anywhere.
- Certificate frame: hairline inset border with corner ticks on ceremonial sections.
- Blueprint utility: faint drafting grid background on `blueprint` sections.
- Film grain: fixed 5% noise overlay on body.
- Marquee strip: serif italic phrases separated by ✦.

## Layout

- Container: max-w-6xl, px-6.
- Sections alternate `--canvas` / `--ink` with hairline borders; generous py-24 to py-44.
- Asymmetric two-column grids for editorial sections; full-bleed only for ceremonial moments (hero, patronage).

## Motion

Ceremonial restraint. Reveals: 0.9s ease-out-quint rise-and-fade, once, staggered ≤0.15s. Counters settle with ease-out-quart. One slow light effect maximum per viewport. Long ambient loops (seal rotation ~90s) at ≤6% opacity. Everything honors prefers-reduced-motion. Never animate layout properties.
