# Attribution

## Reference photographs — U.P. Diliman

The homepage scroll sequence (`public/quantum-leap/upd-journey-scroll.mp4`) is
AI-generated, but it is **grounded in real photographs** of the University of the
Philippines Diliman rather than invented from a text prompt. Earlier versions
hallucinated the campus — the building standing in for Melchor Hall was a generic
tropical block with a tile roof, nothing like the real one — so the shots that
depict real places now use actual photographs as reference input to the image
model.

The photographs below were used **as reference input only**. None of them are
republished on the site; the frames that ship are new renders. They are all from
Wikimedia Commons under CC BY-SA (3.0 or 4.0), and are credited here in keeping
with those licences.

| Subject | Author | Licence |
| --- | --- | --- |
| Melchor Hall (Engineering Building), 2015-01-22 | Patrick Roque | CC BY-SA 4.0 |
| Melchor Hall (side view), 2015-01-22 | Patrickroque01 | CC BY-SA 4.0 |
| UP Diliman — Melchor Hall, 2017-11-21 | Patrickroque01 | CC BY-SA 4.0 |
| Melchor Hall, U.P. Diliman, April 2023 | Ralff Nestor Nacor | CC BY-SA 4.0 |
| Melchor Hall UP Diliman | Oryh | CC BY-SA 4.0 |
| UP Diliman Oblation | Kej Andrés (Ryomaandres) | CC BY-SA 4.0 |
| Quezon Hall, U.P. Diliman, Jan 2024 | Ralff Nestor Nacor | CC BY-SA 4.0 |
| Sunken Garden with Library, 2015-01-22 | Patrick Roque | CC BY-SA 4.0 |

Source files are at `https://commons.wikimedia.org/wiki/File:<name>`.

### A note on the Oblation

The Oblation is a sculpture by Guillermo Tolentino (d. 1976). The Philippines has
no freedom-of-panorama exception, and the Philippine IP Code runs economic rights
for the author's life plus 50 years — so the sculpture itself sits right at the
edge of its term as of 2026, depending on how the term is counted. The photographs
used as reference are separately licensed CC BY-SA as listed above, and the shot
that ships is a new render, not a reproduction of any one photograph. Flagging it
here rather than leaving it undocumented: if the Association would rather not
carry the Oblation at all, that shot can be dropped from the sequence without
touching the other five.

## Fraternity marks

The EMC² seal (`public/logo/emc2-mark.png`) belongs to the EMC² Fraternity. In the
closing shot it is composited into the scene from that file directly, at pixel
accuracy, rather than drawn by the image model — the model garbles fine lettering
around a circular seal, and the seal's wording should never be approximate.

## Anniversary page imagery

Generated 2026-08-24 with Google's Gemini models — stills on
`nano-banana-pro-preview`, the hero clip on `veo-3.1-generate-preview` — then
recompressed before entering the repo.

An earlier set in a candlelit, classical-antique register was rejected by the
owner and is kept, unshipped, in the git-ignored `assets/anniversary-v1-classical/`.
The direction that replaced it: **modern, elegant, alive** — anodised aluminium,
glass, precise geometry, warm gold light lines, the visual world of an advanced
engineering and physical sciences institute rather than a hall of antiquities.
Masters for the shipped set are in `assets/anniversary-v2-modern/`.

| File | What it is | Weight |
|---|---|---|
| `hero.mp4` | Seamless 7.6s loop at full 1080p: a blank sculptural award turning exactly one revolution on a turntable | 1.5MB |
| `hero-poster.jpg` | The loop's own first frame, so playback starts without a jump; also the entire reduced-motion experience | 132KB |
| `ground-foil.jpg` | Anodised deep-green panel with one machined channel of gold light | 71KB |
| `awards.jpg` | A blank machined aluminium-and-glass award | 46KB |
| `sponsorship.jpg` | A blank brushed-steel plate in a precision holder | 55KB |
| `souvenir.jpg` | A book with a blank blind-debossed cover | 96KB |
| `merch.jpg` | Folded apparel with a machined pin, a steel rule, a petri dish | 104KB |
| `reunions.jpg` | A modern banquet room, set and waiting | 150KB |
| `assistance.jpg` | A luminous sphere in an aluminium cradle | 54KB |

Several earlier hero clips were rejected in turn — a candlelit hall, a modern
atrium, a gala crowd, a sixty-strong barong group portrait, a close-up of five
brods. The lesson that stuck: generated **faces** do not survive scrutiny at
hero scale, and the more of them in frame the worse it gets. An object on a
turntable has no such problem, holds up at full 1080p, and rotating it exactly
360 degrees means the clip returns to its own first frame — the loop is exact
by construction rather than patched afterwards. All superseded versions are
kept unshipped under `assets/anniversary-v*/`.

### How the loop is actually seamless

Veo was given the same anchor frame as **both** first and last frame, and asked
for a motion that is intrinsically cyclical — one band of light travelling once
around a ring returns to where it started. That got the endpoints to within
~2% mean pixel difference, which is close but can still read as a flick.

The clip is then rebuilt as `[crossfade(tail → head)] + [body]`: the last 0.8s
dissolves into the first 0.8s, and the result is trimmed to 7.2s. The wrap point
therefore lands on a **continuous one-frame step** rather than a cut, and the
head of the clip is already a dissolve, so there is nothing for the eye to catch.
Measured residual across the wrap: 2.82/255 mean, which is one frame of ordinary
motion.

### The constraint every asset is built on

They depict *objects and spaces*, never the fraternity, never its members,
never the real venue, never the event. The trophy bears no engraving. The
programme has a blank cover. The atrium is not Gimenez Gallery. The page
announces an evening that has not happened, so nothing on it may look like
documentation of one — the imagery sets a mood and the text carries every fact.
All of it is `alt=""`, because none of it says anything a reader needs.

The photographs on the same page (`public/photos/anniv55-*.jpg`) are the
opposite case: real, from the Association's own archive of the **55th**
Anniversary Celebration, and captioned as the 55th so no visitor mistakes them
for a preview of the 58th.

The commemorative seal (`components/site/anniversary-seal.tsx`) is drawn as SVG
rather than generated: image models garble letterforms, and a numeral struck on
a seal should never be approximate. It sets the edition in Arabic numerals, not
Roman — "LVIII" read as antiquarian beside this imagery.
