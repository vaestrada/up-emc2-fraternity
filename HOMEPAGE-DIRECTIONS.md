# Homepage directions, explored 3 September 2026

The brief: state of the art, professional, elegant, not generic, no AI-default kit. Six
directions were weighed against three tests: does it belong to a fifty-seven-year-old
engineering brotherhood specifically; would a front-end engineer recognise the technique as
current rather than a template; does it survive a phone, a slow connection, and
`prefers-reduced-motion`.

## A. The Plate (built)

The homepage as a developing print. The hero photograph loads as a green-ink engraving and
resolves to colour over three seconds. Beside the name, the fraternity's seal draws itself as
an engineering line drawing. A timeline rail from 1969 to 2027 sits under the navbar and fills
as the page is scrolled. The record is told as chapters with a sticky year that changes as
each chapter passes, the long-form feature structure newspapers use.

| Effect | Technique | File |
|---|---|---|
| Engraving that develops into colour | Three layers: the image animates `filter: grayscale(1)` to none; a green layer with `mix-blend-mode: color` tints the grey; a hatch of 1px diagonal lines with `mix-blend-mode: multiply`. Both overlays fade. Time-based, so every visitor sees it once. | `.plate-*` in `globals.css` |
| Parallax as the hero leaves | Native CSS scroll-driven animation: `animation-timeline: scroll(root)` with `animation-range: 0 100vh`. No JavaScript; progressive enhancement behind `@supports`. | `.plate-drift` |
| The seal, in metal | The mark's own vector paths, extracted from the 2023 Illustrator master with `pdftocairo` (`.ai` files are PDF inside), are extruded into a solid with three.js: the green plate as enamel, every gold path as gilt standing proud, the outer gold gear as a rim. Lit by three's procedural RoomEnvironment, so nothing is fetched. It enters from behind, turns through a few degrees, tilts toward the pointer, and recedes on scroll. Loaded only in the browser through `next/dynamic`; the flat SVG mark paints first and stays if WebGL is missing or the context is lost. | `components/site/seal.tsx`, `seal-3d.tsx`; `public/logo/emc2-mark.svg` |
| Vector logos everywhere | The navbar and footer lockups are the real SVG (`emc2-lockup-white.svg`), split from the master by path centre, rather than PNGs. | `public/logo/*.svg` |
| Timeline rail | One tick per year, milestone years labelled; a gold line fills across it from framer's `useScroll` progress through a spring, as a `scaleX` transform. Sticky under the navbar. | `components/site/year-scale.tsx` |
| Chapters with a sticky year | A two-column grid; the left column is `position: sticky`. An `IntersectionObserver` with `rootMargin: -45% 0 -50% 0` (a thin band through the viewport) decides the current chapter; the year crossfades with `AnimatePresence`. Small screens put the year inside each chapter. | `components/site/chronicle.tsx` |
| Balanced headlines | `text-wrap: balance` on all headings. | `globals.css` |

Why it won: every device is drawn from the fraternity's own materials (a photograph of the
brothers, the actual seal, the dates in its record) and from the vocabulary of engineering
(a cast object, a scale) rather than from a template. The techniques are 2024–2026 platform
features plus one real-time 3D object built from the brand's own vector, not library effects.

The first version of this direction drew an approximation of the seal as a line drawing
(SVG `pathLength` draw-on). It was replaced the same day, once the Illustrator masters were
available, by the extruded seal: familiar at a glance because it is exactly their mark, and
new because nobody has seen it as a lit object.

## B. The Drawing Office

The whole page as a technical drawing: the seal explodes into parts on scroll and reassembles;
dimension lines and callouts annotate the photographs; a title block in the corner. Technique:
SVG groups transformed by scroll-driven `animation-timeline: view()`.
Not built: the annotations tip into whimsy, and a whole page of line drawing reads as a
theme rather than a record. The seal drawing survives from this direction.

## C. The Roll

A WebGL cylinder of vellum carrying the 490 names, turning slowly, via react-three-fiber and
drei's `Text`. Not built: the roster is private to the Portal, and a 3D scene costs 300 KB of
JavaScript and a GPU the demo laptop may not have.

## D. The Variable

Kinetic typography: a variable serif (Fraunces or Playfair Display) whose weight and optical
size axes are driven by scroll, so the headline "engraves deeper" as you read. Technique:
`font-variation-settings` animated by `animation-timeline: view()`. Not built: Cinzel is the
brand face and is not variable; a second display face would split the identity.

## E. The Dossier

Shared-element page transitions: the photograph on the homepage morphs into the hero of the
page you click through to. Technique: the View Transitions API through Next's
`experimental.viewTransition` and React's `<ViewTransition>`. Deferred: the flag is
experimental in Next 15 and React 19.1, which is the wrong bet the night before a
presentation. First candidate for the week after.

## F. The smooth-scroll stack

Lenis smooth scrolling with GSAP ScrollTrigger pinning, the award-site standard. Not built:
two dependencies to do what native scroll-driven animations and framer's `useScroll` already
do here, and smoothed scrolling fights the browser on trackpads and with assistive technology.

## What to try next, in order

1. The Dossier once `viewTransition` leaves experimental.
2. A scroll-driven text reveal for the credo (`background-clip: text` with the gradient
   position on `animation-timeline: view()`), so the four lines are cut as you pass them.
3. The Drawing Office's title block as the footer's identity panel.
