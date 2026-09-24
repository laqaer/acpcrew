#!/usr/bin/env python3
"""Build Junction's brand kit from one geometry and one palette.

The mark is a "J" whose stem throws a track switch: the letter for Junction,
and a route splitting off a trunk line, which is what the product does for
agents and models. Everything below derives from ``GLYPH`` (drawn on a 64-unit
grid) and ``PALETTE``, so a change here reaches every surface in one run:

* ``assets/brand/*.svg``: the mark, the bare glyph, the wordmark and lockups
* ``assets/banner.svg``: the README banner
* ``site/public/junction-mark.svg`` and ``site/src/logo.svg``: marketing site
* ``website/src/assets/junction-glyph.svg``: the dashboard's masked glyph
* ``website/electron``: ``icon.png``/``.ico``/``.icns`` (plus nightly), the
  Linux ``build/icons`` set and the macOS menu-bar ``trayTemplate`` images
* ``website/public``: PWA icons
* ``src/junction/static/junction-logo*.png``: the gateway's ``/logo.png``
* ``packaging/installer-assets``: the DMG background and the NSIS header and
  sidebar, as editable SVG plus the TIFF/BMP rasters the installers consume

The wordmark and tagline are outlined from the bundled Overpass variable font
(``website/public/fonts/overpass``), so no SVG depends on an installed font.

Requires Pillow, fontTools and brotli (``pip install pillow fonttools brotli``),
plus ``npm ci`` in ``website/`` for the Playwright rasterizer. Set ``CHROME`` to
a Chromium binary if Playwright's own browser is not installed. Run from the
repository root::

    python3 assets/brand/build.py
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
BRAND = ROOT / "assets" / "brand"
FONT = ROOT / "website" / "public" / "fonts" / "overpass" / "overpass-latin-wght-normal.woff2"

TAGLINE = "Where coding agents meet the models you want."

PALETTE = {
    # Signal blue: the plate colour and the light-mode accent.
    "signal": "#1f55ec",
    "signal_top": "#3a6df7",
    "signal_bottom": "#1843c9",
    # The dark-mode accent: signal blue lifted to pass contrast on asphalt.
    "signal_bright": "#5c8dff",
    # Asphalt (dark neutrals) and paper (light neutrals).
    "asphalt": "#0b0e13",
    "asphalt_raised": "#161b24",
    "asphalt_line": "#2a3342",
    "paper": "#f4f6f9",
    "ink": "#0e1521",
    "white": "#ffffff",
    "muted": "#8591a3",
}

# The glyph on a 64-unit grid. Stem, bowl, then the branch that leaves the stem
# tangentially and rises beside it, like a turnout. Round caps everywhere.
GLYPH = (
    "M34 13v25a11 11 0 0 1-22 0",
    "M34 36c0-11 16-10 16-21v-2",
)
GLYPH_STROKE = 7.0
# Below ~48px a 7-unit stroke renders under 2px and the branch smears into the
# stem, so small raster sizes draw a heavier line.
GLYPH_STROKE_SMALL = 8.5
PLATE = {"x": 2, "y": 2, "size": 60, "radius": 15}


def glyph(color: str, stroke: float = GLYPH_STROKE) -> str:
    return "".join(
        f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{stroke}"'
        ' stroke-linecap="round"/>'
        for d in GLYPH
    )


def svg(view_box: str, body: str, label: str = "Junction") -> str:
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view_box}" role="img"'
        f' aria-label="{label}"><title>{label}</title>{body}</svg>\n'
    )


def plate_mark(stroke: float = GLYPH_STROKE, fill: str | None = None, ink: str | None = None) -> str:
    p = PLATE
    return svg(
        "0 0 64 64",
        f'<rect x="{p["x"]}" y="{p["y"]}" width="{p["size"]}" height="{p["size"]}"'
        f' rx="{p["radius"]}" fill="{fill or PALETTE["signal"]}"/>'
        + glyph(ink or PALETTE["white"], stroke),
    )


def app_icon(nightly: bool = False, stroke: float = GLYPH_STROKE) -> str:
    """The 1024px desktop icon: a plate inset by the platform margin, with depth."""
    body_origin, body_size, radius = 100, 824, 185
    scale = body_size / PLATE["size"]
    offset = body_origin - PLATE["x"] * scale
    if nightly:
        top, bottom = PALETTE["asphalt_raised"], PALETTE["asphalt"]
        ink = PALETTE["signal_bright"]
        rim = (
            f'<rect x="{body_origin + 6}" y="{body_origin + 6}" width="{body_size - 12}"'
            f' height="{body_size - 12}" rx="{radius - 6}" fill="none"'
            f' stroke="{PALETTE["asphalt_line"]}" stroke-width="12"/>'
        )
    else:
        top, bottom = PALETTE["signal_top"], PALETTE["signal_bottom"]
        ink = PALETTE["white"]
        rim = ""
    return svg(
        "0 0 1024 1024",
        "<defs>"
        f'<linearGradient id="plate" x1="0" y1="0" x2="0" y2="1">'
        f'<stop offset="0" stop-color="{top}"/><stop offset="1" stop-color="{bottom}"/>'
        "</linearGradient>"
        '<linearGradient id="sheen" x1="0" y1="0" x2="0" y2="1">'
        '<stop offset="0" stop-color="#fff" stop-opacity="0.1"/>'
        '<stop offset="0.5" stop-color="#fff" stop-opacity="0"/>'
        "</linearGradient>"
        '<filter id="drop" x="-10%" y="-10%" width="120%" height="125%">'
        '<feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="#000" flood-opacity="0.3"/>'
        "</filter>"
        "</defs>"
        f'<rect x="{body_origin}" y="{body_origin}" width="{body_size}" height="{body_size}"'
        f' rx="{radius}" fill="url(#plate)" filter="url(#drop)"/>'
        f'<rect x="{body_origin}" y="{body_origin}" width="{body_size}" height="{body_size}"'
        f' rx="{radius}" fill="url(#sheen)"/>'
        + rim
        # The glyph draws at 88% of its plate size: a desktop icon sits among
        # others at a glance, and a full-size glyph crowds the rounded corners.
        + f'<g transform="translate({offset:.3f} {offset:.3f}) scale({scale:.5f})">'
        f'<g transform="translate(31 31) scale(0.88) translate(-31 -31)">{glyph(ink, stroke)}</g></g>',
    )


def tray_template() -> str:
    # macOS template image: black on transparent, cropped to the glyph so it
    # fills the menu-bar slot. The OS recolours it for light and dark bars.
    return svg("7 7 48 48", glyph("#000", GLYPH_STROKE_SMALL))


_FONT_CACHE: dict[int, TTFont] = {}


def outline(text: str, weight: int, tracking: float = 0.0) -> tuple[str, float, int]:
    """Outline *text* in Overpass at *weight*. Returns (path d, advance, cap height)."""
    if weight not in _FONT_CACHE:
        _FONT_CACHE[weight] = instancer.instantiateVariableFont(TTFont(FONT), {"wght": weight})
    font = _FONT_CACHE[weight]
    glyph_set, cmap, hmtx = font.getGlyphSet(), font.getBestCmap(), font["hmtx"]
    x, parts = 0.0, []
    for ch in text:
        name = cmap[ord(ch)]
        pen = SVGPathPen(glyph_set, ntos=lambda v: f"{v:.1f}".rstrip("0").rstrip("."))
        glyph_set[name].draw(TransformPen(pen, (1, 0, 0, -1, x, 0)))
        parts.append(pen.getCommands())
        x += hmtx[name][0] + tracking
    return " ".join(p for p in parts if p), x - tracking, font["OS/2"].sCapHeight


# Round letters (the J's bowl, the o, the c) overshoot the baseline slightly, so
# the wordmark's box extends this many font units below it.
WORDMARK_OVERSHOOT = 40


def wordmark(color: str = "currentColor") -> str:
    d, advance, cap = outline("Junction", 800, -10)
    return svg(
        f"0 {-cap} {advance:.0f} {cap + WORDMARK_OVERSHOOT}", f'<path fill="{color}" d="{d}"/>'
    )


def lockup(text_color: str) -> str:
    d, advance, cap = outline("Junction", 800, -10)
    s = 30 / cap
    width = 64 + 18 + advance * s
    return svg(
        f"0 0 {width:.1f} 64",
        plate_mark().split("</title>", 1)[1].rsplit("</svg>", 1)[0]
        + f'<path transform="translate(82 47) scale({s:.5f})" fill="{text_color}" d="{d}"/>',
    )


def banner() -> str:
    """README banner: the lockup on asphalt, with route lines meeting at an interchange."""
    word_d, word_adv, cap = outline("Junction", 800, -10)
    tag_d, tag_adv, tag_cap = outline(TAGLINE, 500, 4)
    word_s = 54 / cap
    tag_s = 15 / tag_cap
    mark_size = 112
    mark_x, mark_y = 96, 64
    text_x = mark_x + mark_size + 34
    node_x, node_y = 1010, 120
    lines = [
        # (entry y at the right edge, colour, opacity)
        (40, PALETTE["signal_bright"], 0.55),
        (120, PALETTE["signal"], 0.9),
        (200, PALETTE["muted"], 0.35),
    ]
    routes = ""
    for entry_y, color, opacity in lines:
        dy = entry_y - node_y
        bend_x = node_x + abs(dy) + 60
        routes += (
            f'<path d="M1280 {entry_y}H{bend_x}L{bend_x - abs(dy)} {node_y}H{node_x}" fill="none"'
            f' stroke="{color}" stroke-opacity="{opacity}" stroke-width="10"'
            ' stroke-linejoin="round"/>'
        )
    trunk = (
        f'<path d="M{node_x} {node_y}H{text_x + word_adv * word_s + 60}" fill="none"'
        f' stroke="url(#trunk)" stroke-width="10"/>'
    )
    node = (
        f'<circle cx="{node_x}" cy="{node_y}" r="17" fill="{PALETTE["asphalt"]}"'
        f' stroke="{PALETTE["white"]}" stroke-width="8"/>'
    )
    mark_body = plate_mark().split("</title>", 1)[1].rsplit("</svg>", 1)[0]
    return svg(
        "0 0 1280 240",
        "<defs>"
        # userSpaceOnUse: a horizontal line has a zero-height bounding box,
        # which makes an objectBoundingBox gradient paint nothing at all.
        f'<linearGradient id="trunk" gradientUnits="userSpaceOnUse" x1="{node_x}" y1="0"'
        f' x2="{text_x + word_adv * word_s + 60:.0f}" y2="0">'
        f'<stop offset="0" stop-color="{PALETTE["signal"]}" stop-opacity="0.9"/>'
        f'<stop offset="1" stop-color="{PALETTE["signal"]}" stop-opacity="0"/>'
        "</linearGradient>"
        "</defs>"
        f'<rect width="1280" height="240" fill="{PALETTE["asphalt"]}"/>'
        + trunk
        + routes
        + node
        + f'<g transform="translate({mark_x} {mark_y}) scale({mark_size / 64})">{mark_body}</g>'
        + f'<path transform="translate({text_x} {mark_y + 64}) scale({word_s:.5f})"'
        f' fill="#f3f6fa" d="{word_d}"/>'
        + f'<path transform="translate({text_x + 2} {mark_y + 104}) scale({tag_s:.5f})"'
        f' fill="{PALETTE["muted"]}" d="{tag_d}"/>',
        label="Junction: where coding agents meet the models you want",
    )


def _text(text: str, weight: int, cap_px: float, x: float, baseline: float, fill: str,
          anchor: str = "start", tracking: float = 0.0) -> str:
    """Outlined text, so installer art never depends on a font the build host has."""
    d, advance, cap = outline(text, weight, tracking)
    scale = cap_px / cap
    if anchor == "middle":
        x -= advance * scale / 2
    elif anchor == "end":
        x -= advance * scale
    return f'<path transform="translate({x:.2f} {baseline:.2f}) scale({scale:.5f})" fill="{fill}" d="{d}"/>'


def _placed_mark(x: float, y: float, size: float) -> str:
    body = plate_mark().split("</title>", 1)[1].rsplit("</svg>", 1)[0]
    return f'<g transform="translate({x:.2f} {y:.2f}) scale({size / 64:.5f})">{body}</g>'


def dmg_background() -> str:
    """660x420 Finder window. The app icon sits at (170, 246), /Applications at
    (490, 246), both 96px: electron/package.json ``build.dmg.contents``."""
    w, h, y = 660, 420, 246
    return svg(
        f"0 0 {w} {h}",
        f'<rect width="{w}" height="{h}" fill="{PALETTE["asphalt"]}"/>'
        # A route from the app to its destination: the install is a switch.
        f'<path d="M238 {y}H412" fill="none" stroke="{PALETTE["signal"]}" stroke-width="6"'
        ' stroke-linecap="round"/>'
        f'<path d="M402 {y - 12}L416 {y}L402 {y + 12}" fill="none" stroke="{PALETTE["signal"]}"'
        ' stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>'
        + _text("Junction", 800, 26, w / 2, 80, "#f3f6fa", "middle", -10)
        + _text("Drag Junction onto the Applications folder", 500, 10.5, w / 2, 112,
                PALETTE["muted"], "middle", 6)
        # A faint trunk line along the foot of the window, with one interchange.
        + f'<path d="M0 378H{w}" stroke="{PALETTE["asphalt_line"]}" stroke-width="3"/>'
        + f'<circle cx="{w / 2}" cy="378" r="7" fill="{PALETTE["asphalt"]}"'
        f' stroke="{PALETTE["asphalt_line"]}" stroke-width="3"/>',
    )


def installer_header() -> str:
    """150x57 NSIS header: wordmark left of the mark, on asphalt."""
    return svg(
        "0 0 150 57",
        f'<rect width="150" height="57" fill="{PALETTE["asphalt"]}"/>'
        f'<path d="M0 56.5H150" stroke="{PALETTE["signal"]}" stroke-opacity="0.6"/>'
        + _text("Junction", 800, 11, 90, 33.5, "#f3f6fa", "end", -10)
        + _placed_mark(98, 10.5, 36),
    )


def installer_sidebar() -> str:
    """164x314 NSIS welcome/finish sidebar."""
    return svg(
        "0 0 164 314",
        f'<rect width="164" height="314" fill="{PALETTE["asphalt"]}"/>'
        + _placed_mark(36, 56, 92)
        + _text("Junction", 800, 16, 82, 196, "#f3f6fa", "middle", -10)
        + f'<path d="M58 238H106" stroke="{PALETTE["signal"]}" stroke-linecap="round"'
        ' stroke-width="3"/>'
        + _text("Quick setup", 600, 8.5, 82, 266, PALETTE["muted"], "middle", 8),
    )


def _icns_rle(data: bytes) -> bytes:
    """Apple's ICNS channel run-length encoding: a control byte below 0x80
    copies the next n+1 bytes, one at or above 0x80 repeats the next byte
    n-0x80+3 times."""
    out, i, n = bytearray(), 0, len(data)
    while i < n:
        run = 1
        while i + run < n and data[i + run] == data[i] and run < 130:
            run += 1
        if run >= 3:
            out += bytes([0x80 + run - 3, data[i]])
            i += run
            continue
        literal = bytearray()
        while i < n and len(literal) < 128:
            ahead = 1
            while i + ahead < n and data[i + ahead] == data[i] and ahead < 3:
                ahead += 1
            if ahead >= 3:
                break
            literal.append(data[i])
            i += 1
        out += bytes([len(literal) - 1]) + literal
    return bytes(out)


# ICNS slot -> pixel size. ic04/ic05 (16pt and 32pt @1x) are decoded by macOS
# as raw ARGB, so they carry run-length-encoded channel planes; a PNG body
# there renders as coloured static. Every other slot carries a PNG.
ICNS_SLOTS = {
    "ic04": 16, "ic05": 32, "ic07": 128, "ic08": 256, "ic09": 512, "ic10": 1024,
    "ic11": 32, "ic12": 64, "ic13": 256, "ic14": 512,
}


def write_icns(path: Path, reps: dict[int, Path]) -> None:
    chunks = b""
    for slot, size in ICNS_SLOTS.items():
        if slot in ("ic04", "ic05"):
            pixels = Image.open(reps[size]).convert("RGBA")
            r, g, b, a = pixels.split()
            body = b"ARGB" + b"".join(_icns_rle(ch.tobytes()) for ch in (a, r, g, b))
        else:
            body = reps[size].read_bytes()
        chunks += slot.encode("ascii") + (len(body) + 8).to_bytes(4, "big") + body
    path.write_bytes(b"icns" + (len(chunks) + 8).to_bytes(4, "big") + chunks)


def write_tiff_hidpi(path: Path, one_x: Path, two_x: Path) -> None:
    """A two-representation TIFF (72 and 144 dpi), which is what Finder reads to
    draw a DMG background sharply on both standard and Retina displays."""
    base = Image.open(one_x).convert("RGBA")
    retina = Image.open(two_x).convert("RGBA")
    retina.encoderinfo = {"dpi": (144, 144)}
    base.save(path, save_all=True, append_images=[retina], dpi=(72, 72), compression="tiff_lzw")


def write_bmp24(path: Path, png: Path) -> None:
    """NSIS takes 24-bit BMPs; the art is opaque, so dropping alpha loses nothing."""
    Image.open(png).convert("RGB").save(path, format="BMP")


def write_template_png(path: Path) -> None:
    """Re-encode a tray template as pure black plus alpha, one filter-0 scanline
    per row. macOS reads only the alpha of a template image; forcing RGB to
    black means antialiased edges can never tint it, and the plain encoding is
    what electron/test/tray-template.test.js decodes without an image library."""
    import struct
    import zlib

    alpha = Image.open(path).convert("RGBA").getchannel("A")
    width, height = alpha.size
    raw = bytearray()
    for y in range(height):
        raw.append(0)
        for x in range(width):
            raw += bytes((0, 0, 0, alpha.getpixel((x, y))))

    def chunk(kind: bytes, data: bytes) -> bytes:
        body = kind + data
        return struct.pack(">I", len(data)) + body + struct.pack(">I", zlib.crc32(body))

    header = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    path.write_bytes(
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", header)
        + chunk(b"IDAT", zlib.compress(bytes(raw), 9))
        + chunk(b"IEND", b"")
    )


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")
    print(f"wrote {path.relative_to(ROOT)}")


def rasterize(jobs: list[dict]) -> None:
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as fh:
        json.dump(jobs, fh)
        job_file = fh.name
    try:
        subprocess.run(["node", str(BRAND / "raster.mjs"), job_file], check=True)
    finally:
        os.unlink(job_file)
    for job in jobs:
        out = Path(job["out"])
        if out.is_relative_to(ROOT):
            print(f"wrote {out.relative_to(ROOT)}")


def main() -> int:
    small_plate = plate_mark(GLYPH_STROKE_SMALL)
    nightly_plate = plate_mark(
        fill=PALETTE["asphalt_raised"], ink=PALETTE["signal_bright"]
    )

    write(BRAND / "mark.svg", plate_mark())
    write(BRAND / "mark-nightly.svg", nightly_plate)
    write(BRAND / "glyph.svg", svg("7 7 48 48", glyph("currentColor")))
    write(BRAND / "wordmark.svg", wordmark())
    write(BRAND / "lockup-dark.svg", lockup("#f3f6fa"))
    write(BRAND / "lockup-light.svg", lockup(PALETTE["ink"]))
    write(BRAND / "app-icon.svg", app_icon())
    write(BRAND / "app-icon-nightly.svg", app_icon(nightly=True))
    write(ROOT / "assets" / "banner.svg", banner())
    write(ROOT / "site" / "public" / "junction-mark.svg", plate_mark())
    write(ROOT / "site" / "src" / "logo.svg", plate_mark())
    # Monochrome glyph for the dashboard, painted as a CSS mask over
    # currentColor by BrandGlyph (components/BrandIcon.tsx).
    write(ROOT / "website" / "src" / "assets" / "junction-glyph.svg", svg("7 7 48 48", glyph("#000")))

    electron = ROOT / "website" / "electron"
    public = ROOT / "website" / "public"
    static = ROOT / "src" / "junction" / "static"
    tmp = Path(tempfile.mkdtemp(prefix="junction-brand-"))

    jobs: list[dict] = []

    def job(svg_text: str, size: int, out: Path) -> None:
        jobs.append({"svg": svg_text, "w": size, "h": size, "out": str(out)})

    job(app_icon(), 1024, electron / "icon.png")
    job(app_icon(nightly=True), 1024, electron / "icon-nightly.png")
    for size in (16, 32, 48):
        job(small_plate, size, electron / "build" / "icons" / f"{size}x{size}.png")
    for size in (64, 128, 256, 512):
        job(app_icon(), size, electron / "build" / "icons" / f"{size}x{size}.png")
    job(tray_template(), 18, electron / "trayTemplate.png")
    job(tray_template(), 36, electron / "trayTemplate@2x.png")
    job(plate_mark(), 192, public / "icon-192.png")
    job(plate_mark(), 512, public / "icon-512.png")
    job(plate_mark(), 512, static / "junction-logo.png")
    job(nightly_plate, 512, static / "junction-logo-nightly.png")
    ico_sizes = (16, 24, 32, 48, 64, 128, 256)
    for size in ico_sizes:
        job(small_plate if size <= 48 else plate_mark(), size, tmp / f"ico-{size}.png")
        job(
            plate_mark(GLYPH_STROKE_SMALL, PALETTE["asphalt_raised"], PALETTE["signal_bright"])
            if size <= 48
            else nightly_plate,
            size,
            tmp / f"ico-nightly-{size}.png",
        )
    icns_sizes = sorted(set(ICNS_SLOTS.values()))
    for size in icns_sizes:
        # The 16 and 32px reps draw the heavier stroke; see GLYPH_STROKE_SMALL.
        stroke = GLYPH_STROKE_SMALL if size <= 32 else GLYPH_STROKE
        job(app_icon(stroke=stroke), size, tmp / f"icns-{size}.png")
        job(app_icon(nightly=True, stroke=stroke), size, tmp / f"icns-nightly-{size}.png")

    installer = ROOT / "packaging" / "installer-assets"
    art = {
        "dmg-background": (dmg_background(), 660, 420),
        "windows-installer-header": (installer_header(), 150, 57),
        "windows-installer-sidebar": (installer_sidebar(), 164, 314),
    }
    for name, (text, w, h) in art.items():
        write(installer / f"{name}.svg", '<?xml version="1.0" encoding="UTF-8"?>\n' + text)
        jobs.append({"svg": text, "w": w, "h": h, "out": str(tmp / f"{name}.png")})
    # The Retina representation is the same SVG rasterized at twice the size.
    dmg_text, dmg_w, dmg_h = art["dmg-background"]
    jobs.append(
        {"svg": dmg_text, "w": dmg_w * 2, "h": dmg_h * 2, "out": str(tmp / "dmg-background@2x.png")}
    )
    rasterize(jobs)

    for stem, prefix in (("icon", "ico"), ("icon-nightly", "ico-nightly")):
        frames = [Image.open(tmp / f"{prefix}-{size}.png") for size in ico_sizes]
        frames[-1].save(
            electron / f"{stem}.ico",
            format="ICO",
            sizes=[(s, s) for s in ico_sizes],
            append_images=frames[:-1],
        )
        print(f"wrote {(electron / f'{stem}.ico').relative_to(ROOT)}")
    write_icns(electron / "icon.icns", {s: tmp / f"icns-{s}.png" for s in icns_sizes})
    write_icns(
        electron / "icon-nightly.icns", {s: tmp / f"icns-nightly-{s}.png" for s in icns_sizes}
    )
    print("wrote website/electron/icon.icns, website/electron/icon-nightly.icns")
    for name in ("trayTemplate.png", "trayTemplate@2x.png"):
        write_template_png(electron / name)
    write_tiff_hidpi(
        installer / "dmg-background.tiff",
        tmp / "dmg-background.png",
        tmp / "dmg-background@2x.png",
    )
    for name in ("windows-installer-header", "windows-installer-sidebar"):
        write_bmp24(installer / f"{name}.bmp", tmp / f"{name}.png")
    print("wrote packaging/installer-assets rasters (.tiff, .bmp)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
