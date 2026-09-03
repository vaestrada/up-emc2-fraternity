"""The EMC² photographic grade.

Every photograph on the site is a real photograph of real brods, so nothing
here invents pixels: no generative "enhancement", no faces repainted, no
objects added or removed. This is the same set of adjustments a colourist
would apply in Lightroom, written down so it is reproducible and identical
across every image on the site.

The grade is the brand, in light:

  shadows lean green   (--frat-green, #0c3e06)
  highlights lean gold (--frat-gold,  #c38f0e)

which is a *split tone*: one colour pushed into the dark end of the range and
another into the light end. It is why the photographs now feel like they
belong to the same site as the seal, without anyone noticing a filter.

Order of operations, the same order a colourist works in:

  1. dehaze / black point  stretch each channel off its own percentiles, so an
                           overcast sky stops washing the whole frame grey
  2. shadow lift           open the dark end so faces under a bright sky read
  3. S-curve               contrast added around a mid pivot, smoothly, so
                           neither the barongs nor the shadows clip
  4. split tone            the green/gold pass described above
  5. vibrance              saturation that spares what is already saturated,
                           so skin does not go orange
  6. clarity               a wide-radius unsharp mask on luminance only:
                           local contrast, not sharpening
  7. vignette              a very slight darkening at the corners

Run:  python scripts/grade-photographs.py           (grades everything listed)
      python scripts/grade-photographs.py --check   (writes before/after pairs)

The untouched original of every graded photograph is kept in
assets/photos-ungraded/ (outside public/, so it is never served). Each run
re-grades from that original, so running this twice never compounds the
effect, and changing an amount above and re-running is always safe.
"""

from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
PHOTOS = ROOT / "public" / "photos"
# Originals live outside public/ so they are never served, only kept.
ORIGINALS = ROOT / "assets" / "photos-ungraded"

# --- the preset ----------------------------------------------------------

SHADOW_TONE = np.array([0.047, 0.243, 0.024])  # --frat-green
HIGHLIGHT_TONE = np.array([0.765, 0.561, 0.055])  # --frat-gold


class Grade:
    """One named set of amounts. `strength` scales the whole grade."""

    def __init__(
        self,
        black_point=0.006,
        white_point=0.999,
        shadow_lift=0.16,
        contrast=0.30,
        pivot=0.46,
        split=0.055,
        vibrance=0.26,
        clarity=0.32,
        vignette=0.16,
        warmth=0.020,
    ):
        self.black_point = black_point
        self.white_point = white_point
        self.shadow_lift = shadow_lift
        self.contrast = contrast
        self.pivot = pivot
        self.split = split
        self.vibrance = vibrance
        self.clarity = clarity
        self.vignette = vignette
        self.warmth = warmth


# The group photographs: flat, overcast, shot from a distance. They take the
# full grade.
GROUP = Grade(split=0.044, warmth=0.012)

# Portraits: skin is the one thing a grade must not shift. Almost no warmth,
# a third of the split tone, gentle everything.
PORTRAIT = Grade(
    shadow_lift=0.08,
    contrast=0.16,
    split=0.016,
    vibrance=0.11,
    clarity=0.16,
    vignette=0.08,
    warmth=0.003,
)

# Only what the site actually serves.
TARGETS: list[tuple[str, Grade]] = [
    ("anniv55-outdoor.jpg", GROUP),
    ("anniv55-gazebo.jpg", GROUP),
    ("anniv55-stage.jpg", GROUP),
    ("brod-ison-portrait.jpg", PORTRAIT),
    ("brod-salanguit-portrait.jpg", PORTRAIT),
    ("projects-campaigns-card.jpg", PORTRAIT),
    ("og-default.jpg", PORTRAIT),
]

# Rec. 709 luminance weights, the standard for "how bright does this look".
LUMA = np.array([0.2126, 0.7152, 0.0722])


def luminance(rgb: np.ndarray) -> np.ndarray:
    return rgb @ LUMA


def smoothstep(x: np.ndarray) -> np.ndarray:
    return x * x * (3.0 - 2.0 * x)


def apply_grade(img: Image.Image, g: Grade) -> Image.Image:
    rgb = np.asarray(img.convert("RGB"), dtype=np.float32) / 255.0

    # 1. dehaze / black point. Percentiles per channel remove a colour cast in
    #    the haze as well as the haze itself.
    lo = np.percentile(rgb, g.black_point * 100, axis=(0, 1))
    hi = np.percentile(rgb, g.white_point * 100, axis=(0, 1))
    rgb = np.clip((rgb - lo) / np.maximum(hi - lo, 1e-5), 0.0, 1.0)

    # 2. shadow lift, weighted to the dark end only
    lum = luminance(rgb)[..., None]
    rgb = rgb + (1.0 - rgb) * g.shadow_lift * np.square(1.0 - lum)

    # 3. S-curve around the pivot: blend toward a smoothstep of the range,
    #    which adds contrast without the hard clipping of a linear stretch.
    x = np.clip((rgb - g.pivot) * 0.5 + 0.5, 0.0, 1.0)
    s = (smoothstep(x) - 0.5) * 2.0 + g.pivot
    rgb = np.clip(rgb * (1.0 - g.contrast) + s * g.contrast, 0.0, 1.0)

    # 4. split tone: green into the shadows, gold into the highlights
    lum = luminance(rgb)[..., None]
    shadow_w = np.square(1.0 - lum)
    highlight_w = np.square(lum)
    rgb = rgb + (SHADOW_TONE - 0.5) * shadow_w * g.split * 2.0
    rgb = rgb + (HIGHLIGHT_TONE - 0.5) * highlight_w * g.split * 2.0

    # a touch of overall warmth: the day was grey, the record should not be
    rgb[..., 0] += g.warmth
    rgb[..., 2] -= g.warmth * 0.8
    rgb = np.clip(rgb, 0.0, 1.0)

    # 5. vibrance: saturate least where the pixel is already saturated
    lum = luminance(rgb)[..., None]
    sat = rgb.max(axis=2, keepdims=True) - rgb.min(axis=2, keepdims=True)
    amount = g.vibrance * (1.0 - np.clip(sat * 1.6, 0.0, 1.0))
    rgb = np.clip(lum + (rgb - lum) * (1.0 + amount), 0.0, 1.0)

    # 6. clarity: local contrast from a wide blur of the luminance
    lum = luminance(rgb)
    radius = max(rgb.shape[0], rgb.shape[1]) / 110.0
    blurred = np.asarray(
        Image.fromarray((lum * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius)),
        dtype=np.float32,
    ) / 255.0
    detail = (lum - blurred)[..., None]
    # spare the extremes so skies and shadows do not halo
    mask = (1.0 - np.square(2.0 * lum[..., None] - 1.0))
    rgb = np.clip(rgb + detail * g.clarity * mask * 1.6, 0.0, 1.0)

    # 7. vignette
    h, w = rgb.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w]
    nx = (xx / (w - 1) - 0.5) * 2.0
    ny = (yy / (h - 1) - 0.5) * 2.0
    r = np.sqrt(nx * nx + ny * ny) / np.sqrt(2.0)
    falloff = np.clip((r - 0.55) / 0.45, 0.0, 1.0) ** 2
    rgb = np.clip(rgb * (1.0 - falloff[..., None] * g.vignette), 0.0, 1.0)

    return Image.fromarray((rgb * 255.0 + 0.5).astype(np.uint8), "RGB")


def source_for(path: Path) -> Path:
    """The ungraded original, kept in assets/ on the first run and re-used
    every run after, so grading twice never compounds the effect."""
    ORIGINALS.mkdir(parents=True, exist_ok=True)
    original = ORIGINALS / path.name
    if not original.exists():
        original.write_bytes(path.read_bytes())
    return original


def main() -> int:
    check = "--check" in sys.argv
    out_dir = Path(sys.argv[sys.argv.index("--out") + 1]) if "--out" in sys.argv else None

    for name, g in TARGETS:
        path = PHOTOS / name
        if not path.exists():
            print(f"skip  {name} (not found)")
            continue
        original = source_for(path)
        img = Image.open(original)
        graded = apply_grade(img, g)

        if check and out_dir:
            out_dir.mkdir(parents=True, exist_ok=True)
            pair = Image.new("RGB", (img.width * 2, img.height))
            pair.paste(img.convert("RGB"), (0, 0))
            pair.paste(graded, (img.width, 0))
            pair.thumbnail((1800, 1800))
            pair.save(out_dir / f"{path.stem}-pair.jpg", quality=88)
            print(f"pair  {name}")
        else:
            graded.save(path, quality=88, optimize=True, progressive=True)
            print(f"grade {name}  {path.stat().st_size // 1024} KB")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
