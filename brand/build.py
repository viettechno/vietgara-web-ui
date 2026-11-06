"""Derives the web and app logo assets from the master logos (VietGara_{light,dark}_1536x1024.png).

The masters are opaque, on white (light) and on navy (dark). This removes the background to
alpha, cuts the lockup and the glyph (the V and wrench without the car lines) and writes the
sizes the sites and apps need. Run: python3 build.py <masters dir> <out dir>
"""
import sys, os
from PIL import Image
import numpy as np

masters, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)

def to_alpha(img, bg, mode):
    """Colour to alpha: the opaque image becomes a transparent one that looks the same on `bg`."""
    a = np.asarray(img.convert('RGB'), dtype=np.float64)
    bg = np.array(bg, dtype=np.float64)
    # how far each channel is from the background, relative to how far it could go
    # the light master is dark marks on white, the dark master is light marks on navy
    if mode == 'light':
        alpha = np.max(np.where(a < bg, (bg - a) / np.maximum(bg, 1), 0), axis=2)
    else:
        alpha = np.max(np.where(a > bg, (a - bg) / np.maximum(255 - bg, 1), 0), axis=2)
    alpha[alpha < 0.05] = 0
    alpha = np.clip(alpha * 1.0, 0, 1)
    safe = np.maximum(alpha, 1e-6)[..., None]
    rgb = bg + (a - bg) / safe
    rgb = np.clip(rgb, 0, 255)
    rgba = np.dstack([rgb, alpha * 255]).astype(np.uint8)
    return Image.fromarray(rgba, 'RGBA')

def bbox(img, thresh=8):
    return img.getchannel('A').point(lambda v: 255 if v > thresh else 0).getbbox()

def crop(img, box, pad=0):
    l, t, r, b = box
    return img.crop((max(l - pad, 0), max(t - pad, 0), min(r + pad, img.width), min(b + pad, img.height)))

def glyph_of(img):
    """The V and wrench only: the saturated blue shapes, without the grey (light) or white (dark) car lines."""
    from scipy import ndimage
    a = np.asarray(img, dtype=np.float64)
    r, b = a[..., 0], a[..., 2]
    keep = ((b - r) > 100) & (a[..., 3] > 40)
    keep[int(img.height * 0.56):] = False  # the wordmark is below
    labels, n = ndimage.label(keep)
    sizes = ndimage.sum(keep, labels, range(1, n + 1))
    big = np.isin(labels, [i + 1 for i, s in enumerate(sizes) if s > 3000])
    grown = ndimage.binary_dilation(big, iterations=3)
    alpha = np.where(grown, a[..., 3], 0)
    return Image.fromarray(np.dstack([a[..., :3], alpha]).astype(np.uint8), 'RGBA')

variants = {}
for name, bg_xy in (('light', (3, 3)), ('dark', (3, 3))):
    src = Image.open(os.path.join(masters, f'VietGara_{name}_1536x1024.png')).convert('RGB')
    bg = src.getpixel(bg_xy)
    rgba = to_alpha(src, bg, name)
    lock = crop(rgba, bbox(rgba), 8)
    gl_full = glyph_of(rgba)
    gl = crop(gl_full, bbox(gl_full), 4)
    variants[name] = (rgba, lock, gl)
    suffix = '' if name == 'light' else '-dark'
    lock.save(os.path.join(out, f'logo{suffix}.png'), optimize=True)
    gl.save(os.path.join(out, f'mark{suffix}.png'), optimize=True)
    print(name, 'lockup', lock.size, 'glyph', gl.size)


# ---- derived sets --------------------------------------------------------------------------

def paste_center(canvas, im, cx, cy):
    canvas.alpha_composite(im, (int(cx - im.width / 2), int(cy - im.height / 2)))

def fit(im, height=None, width=None):
    if height is not None:
        return im.resize((round(im.width * height / im.height), height), Image.Resampling.LANCZOS)
    return im.resize((width, round(im.height * width / im.width)), Image.Resampling.LANCZOS)

WHITE = (255, 255, 255, 255)
for name in ('light', 'dark'):
    rgba, lock, gl = variants[name]
    suffix = '' if name == 'light' else '-dark'

    # Horizontal lockup: the glyph and, beside it, the wordmark cut from the stacked lockup.
    word = crop(rgba, bbox(rgba.crop((0, int(rgba.height * 0.575), rgba.width, rgba.height))) and
                (lambda b: (b[0], b[1] + int(rgba.height * 0.575), b[2], b[3] + int(rgba.height * 0.575)))(
                    bbox(rgba.crop((0, int(rgba.height * 0.575), rgba.width, rgba.height)))), 4)
    g = fit(gl, height=round(word.height * 1.3))
    gap = round(word.height * 0.38)
    h = max(g.height, word.height)
    horiz = Image.new('RGBA', (g.width + gap + word.width, h), (0, 0, 0, 0))
    horiz.alpha_composite(g, (0, (h - g.height) // 2))
    horiz.alpha_composite(word, (g.width + gap, (h - word.height) // 2))
    horiz.save(os.path.join(out, f'logo-horizontal{suffix}.png'), optimize=True)

# App icon: the glyph, in the light colours, on white. Opaque, as the stores require.
_, _, gl_light = variants['light']
def icon_canvas(size, glyph_share, bg=WHITE):
    c = Image.new('RGBA', (size, size), bg)
    g = fit(gl_light, width=round(size * glyph_share))
    paste_center(c, g, size / 2, size / 2)
    return c

icon_canvas(1024, 0.66).convert('RGB').save(os.path.join(out, 'icon-1024.png'), optimize=True)
# Android adaptive icon: transparent glyph inside the 66 % safe zone of the 108 dp layer
fg = icon_canvas(1024, 0.46, bg=(0, 0, 0, 0))
fg.save(os.path.join(out, 'icon-foreground-1024.png'), optimize=True)
# monochrome (themed icons): the glyph's alpha in a single colour
mono = Image.new('RGBA', fg.size, (0, 0, 0, 0))
mono.putalpha(fg.getchannel('A'))
mono.save(os.path.join(out, 'icon-monochrome-1024.png'), optimize=True)

# Web icons: the glyph large in the square (a favicon is tiny), transparent; the touch icon on white
for size in (16, 32, 48):
    fav = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    paste_center(fav, fit(gl_light, width=size), size / 2, size / 2)
    fav.save(os.path.join(out, f'favicon-{size}.png'), optimize=True)
icon_canvas(180, 0.70).convert('RGB').save(os.path.join(out, 'apple-touch-icon.png'), optimize=True)
icon_canvas(192, 0.70).convert('RGB').save(os.path.join(out, 'icon-192.png'), optimize=True)
icon_canvas(512, 0.70).convert('RGB').save(os.path.join(out, 'icon-512.png'), optimize=True)
ico = [Image.open(os.path.join(out, f'favicon-{s}.png')) for s in (16, 32, 48)]
ico[-1].save(os.path.join(out, 'favicon.ico'), sizes=[(16, 16), (32, 32), (48, 48)], append_images=ico[:-1])

# Web sizes: the sites show the logo small, so they get files of the size they need, not the master.
web = os.path.join(out, 'web')
os.makedirs(web, exist_ok=True)
for suffix in ('', '-dark'):
    for stem, kw in (('logo-horizontal', {'height': 96}), ('logo', {'width': 640}), ('mark', {'width': 256})):
        fit(Image.open(os.path.join(out, f'{stem}{suffix}.png')), **kw).save(
            os.path.join(web, f'{stem}{suffix}.webp'), quality=85, method=6)
print('done')
