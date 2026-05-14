#!/usr/bin/env python3
"""
OBSIDIAN — Ghost Ecosystem VII
Génération des icônes PWA (pattern ASH & STEEL)
Couleurs : noir absolu #0a0a0a + or toltèque #d4a843
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Config OBSIDIAN
BG_COLOR = (10, 10, 10)          # #0a0a0a
ACCENT_COLOR = (212, 168, 67)    # #d4a843 or toltèque
TEXT_COLOR = (212, 168, 67)

SIZES = [72, 96, 128, 144, 152, 192, 384, 512]
OUTPUT_DIR = "icons"

os.makedirs(OUTPUT_DIR, exist_ok=True)

def draw_obsidian_icon(size):
    img = Image.new("RGBA", (size, size), BG_COLOR + (255,))
    draw = ImageDraw.Draw(img)

    cx, cy = size // 2, size // 2
    margin = size * 0.08

    # Bordure extérieure dorée fine
    border_w = max(1, int(size * 0.025))
    draw.rectangle(
        [margin, margin, size - margin, size - margin],
        outline=ACCENT_COLOR, width=border_w
    )

    # Losange central (symbole obsidienne/pierre noire)
    lm = size * 0.22
    diamond = [
        (cx, lm),               # top
        (size - lm, cy),        # right
        (cx, size - lm),        # bottom
        (lm, cy),               # left
    ]
    draw.polygon(diamond, outline=ACCENT_COLOR, fill=BG_COLOR + (255,))
    d_border = max(1, int(size * 0.018))
    draw.line(diamond + [diamond[0]], fill=ACCENT_COLOR, width=d_border)

    # Croix intérieure
    inner = size * 0.12
    line_w = max(1, int(size * 0.015))
    draw.line([(cx, cy - inner), (cx, cy + inner)], fill=ACCENT_COLOR, width=line_w)
    draw.line([(cx - inner, cy), (cx + inner, cy)], fill=ACCENT_COLOR, width=line_w)

    # Point central
    dot_r = max(2, int(size * 0.04))
    draw.ellipse(
        [cx - dot_r, cy - dot_r, cx + dot_r, cy + dot_r],
        fill=ACCENT_COLOR
    )

    # Label VII pour grandes tailles
    if size >= 192:
        try:
            font_size = int(size * 0.13)
            font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf", font_size)
        except:
            font = ImageFont.load_default()
        label = "VII"
        bbox = draw.textbbox((0, 0), label, font=font)
        tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
        tx = size - margin - tw - size * 0.04
        ty = size - margin - th - size * 0.04
        draw.text((tx, ty), label, font=font, fill=ACCENT_COLOR)

    return img

print("Génération des icônes OBSIDIAN...")
for size in SIZES:
    icon = draw_obsidian_icon(size)
    path = os.path.join(OUTPUT_DIR, f"icon-{size}.png")
    icon.save(path, "PNG", optimize=True)
    print(f"  ✓ icon-{size}.png")

favicon = draw_obsidian_icon(32)
favicon.save("favicon.png", "PNG")
print("  ✓ favicon.png (32x32)")

print(f"\nDone — {len(SIZES) + 1} fichiers dans ./{OUTPUT_DIR}/")
