"""
Generate landing/og-image.png — 1200x630 Telegram/FB/LinkedIn preview card.

Brand palette (per landing/CLAUDE.md):
  bg #0e0e12, card #16161d, border #2a2a35, text #e0e0e8, muted #7a7a90, accent #e8b84b

Run once: python landing/generate_og_image.py
Output: landing/og-image.png
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "og-image.png"

W, H = 1200, 630
BG = "#0e0e12"
CARD = "#16161d"
BORDER = "#2a2a35"
TEXT = "#e0e0e8"
MUTED = "#7a7a90"
ACCENT = "#e8b84b"

# Try multiple font candidates — Windows ships Consolas; fall back to default if absent.
FONT_CANDIDATES_MONO = [
    "C:/Windows/Fonts/JetBrainsMono-Bold.ttf",
    "C:/Windows/Fonts/JetBrainsMono-Regular.ttf",
    "C:/Windows/Fonts/consola.ttf",
    "C:/Windows/Fonts/cour.ttf",
]
FONT_CANDIDATES_SANS = [
    "C:/Windows/Fonts/SpaceGrotesk-Bold.ttf",
    "C:/Windows/Fonts/segoeuib.ttf",
    "C:/Windows/Fonts/arialbd.ttf",
]


def load_font(candidates: list[str], size: int) -> ImageFont.FreeTypeFont:
    for path in candidates:
        if Path(path).exists():
            return ImageFont.truetype(path, size=size)
    return ImageFont.load_default()


def main() -> None:
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    pad = 60
    inner = (pad, pad, W - pad, H - pad)

    # Outer card border
    d.rectangle(inner, outline=BORDER, width=2)

    # Brand label top-left
    f_label = load_font(FONT_CANDIDATES_MONO, 24)
    d.text((pad + 24, pad + 24), "djok.pages.dev", fill=MUTED, font=f_label)

    # Pre-Alpha badge top-right
    f_badge = load_font(FONT_CANDIDATES_MONO, 20)
    badge_text = "PRE-ALPHA"
    bbox = d.textbbox((0, 0), badge_text, font=f_badge)
    bw = bbox[2] - bbox[0]
    bh = bbox[3] - bbox[1]
    bx = W - pad - 24 - bw - 24
    by = pad + 18
    d.rectangle((bx - 12, by - 8, bx + bw + 12, by + bh + 12), outline=ACCENT, width=2)
    d.text((bx, by), badge_text, fill=ACCENT, font=f_badge)

    # Headline (sans-serif bold)
    f_headline = load_font(FONT_CANDIDATES_SANS, 64)
    headline = "Djok"
    d.text((pad + 24, pad + 90), headline, fill=TEXT, font=f_headline)

    f_sub = load_font(FONT_CANDIDATES_SANS, 32)
    sub = "CS2 Reaction Time Analysis"
    d.text((pad + 24, pad + 170), sub, fill=TEXT, font=f_sub)

    # Data row — the anchor number
    f_data_label = load_font(FONT_CANDIDATES_MONO, 24)
    f_data_value = load_font(FONT_CANDIDATES_MONO, 56)

    data_y = pad + 280

    # Card background for data
    d.rectangle((pad + 24, data_y - 16, W - pad - 24, data_y + 200), fill=CARD, outline=BORDER, width=1)

    # Donk row
    d.text((pad + 56, data_y + 16), "donk peek T0→T1", fill=MUTED, font=f_data_label)
    d.text((pad + 56, data_y + 48), "172ms", fill=ACCENT, font=f_data_value)
    d.text((pad + 56, data_y + 132), "n=956 FACEIT peeks", fill=MUTED, font=f_data_label)

    # Vertical separator
    sx = (W // 2) + 80
    d.line((sx, data_y + 16, sx, data_y + 184), fill=BORDER, width=1)

    # Karrigan row
    d.text((sx + 32, data_y + 16), "karrigan peek T0→T1", fill=MUTED, font=f_data_label)
    d.text((sx + 32, data_y + 48), "203ms", fill=TEXT, font=f_data_value)
    d.text((sx + 32, data_y + 132), "n=559 FACEIT peeks", fill=MUTED, font=f_data_label)

    # Tagline at bottom
    f_foot = load_font(FONT_CANDIDATES_MONO, 22)
    foot = "T0→T1 / T1→T2 / crosshair angle — three numbers, three drills"
    d.text((pad + 24, H - pad - 60), foot, fill=MUTED, font=f_foot)

    img.save(OUT, "PNG", optimize=True)
    print(f"og-image written to {OUT} ({W}x{H})")


if __name__ == "__main__":
    main()
