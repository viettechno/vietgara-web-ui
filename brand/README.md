# VietGara brand assets

The logo of VietGara: a **V** that is also a wrench, over the outline of a car, with the name set in blue and dark ink (white on dark). The masters were drawn by the owner and are in `source/`; everything else is derived from them by `build.py`, so a change of the masters is one command.

| Master (`source/`) | What |
| --- | --- |
| `VietGara_light_1536x1024.png`, `VietGara_dark_1536x1024.png` | The stacked lockup on white and on navy; the **source of every asset below** (the largest pixels) |
| `VietGara_light_1024x1024.png`, `VietGara_dark_1024x1024.png` | The same lockups on a square canvas, kept for reference |

## What is in `dist/`

| File | Use |
| --- | --- |
| `logo.png`, `logo-dark.png` | The stacked lockup, transparent, for light and for dark backgrounds. Splash and sign-in screens, social images, print |
| `logo-horizontal.png`, `logo-horizontal-dark.png` | The symbol (V, wrench and the car lines) and the wordmark side by side. App bars, sidebars and site headers. **Derived**: the masters only have the stacked form |
| `symbol.png`, `symbol-dark.png` | The symbol alone, with the car lines, where the name is already written (next to a title) |
| `mark.png`, `mark-dark.png` | The V and wrench only, without the car lines: for sizes where the thin lines would vanish (collapsed sidebars, avatars, favicons and the web touch icons) |
| `icon-1024.png` | The app icon: the symbol (with the car lines) on white, opaque (App Store, Play Store) |
| `icon-foreground-1024.png`, `icon-monochrome-1024.png` | Android adaptive icon layers (the symbol in the 66 % safe zone) and the themed-icon layer |
| `apple-touch-icon.png`, `icon-192.png`, `icon-512.png` | Web icons on white (iOS home screen, PWA manifest) |
| `favicon.ico`, `favicon-16/32/48.png` | The glyph on transparent, for browser tabs |
| `web/*.webp` | The lockups and the glyph at the size sites show them (the full files are for apps and print) |

Light variants have dark ink and are for **light** backgrounds; `-dark` variants are for **dark** backgrounds. Do not place a light variant on a coloured fill, and do not recolour, stretch or add effects.

## Regenerate

```sh
pip install pillow numpy scipy
python3 brand/build.py brand/source brand/dist
```

The masters are opaque. `build.py` turns the background into transparency (white for the light master, navy for the dark one), cuts the lockup, the symbol and the glyph, and writes the sizes above. The glyph is kept by colour and size, so the grey or white car lines are left out of it; the symbol keeps them.

## Apps

`export_app_icons.py` writes the launcher icons and the launch screen of a Flutter app (Android legacy and adaptive icons with the themed layer, every size of the iOS `AppIcon.appiconset`, the launch image):

```sh
python3 brand/export_app_icons.py brand/dist ../vietgara-owner-app
```

Websites and the web consoles copy the files they need from `dist/` (the web consoles and the sites each keep their own copy; this repository is the source).
