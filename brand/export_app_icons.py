"""Writes the launcher icons and the launch screen of a Flutter app from the assets in dist/.

Run: python3 export_app_icons.py <dist dir> <app dir>
Android: legacy and adaptive launcher icons (with the themed monochrome layer) and the splash mark.
iOS: every size of AppIcon.appiconset (opaque, as the App Store requires) and the launch image.
"""
import json, os, re, sys
from PIL import Image

dist, app = sys.argv[1], sys.argv[2]
LANCZOS = Image.Resampling.LANCZOS

icon = Image.open(os.path.join(dist, 'icon-1024.png')).convert('RGB')
foreground = Image.open(os.path.join(dist, 'icon-foreground-1024.png'))
monochrome = Image.open(os.path.join(dist, 'icon-monochrome-1024.png'))
mark = Image.open(os.path.join(dist, 'mark.png'))

def save(im, path, size=None):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    if size:
        im = im.resize((size, size), LANCZOS)
    im.save(path, optimize=True)

# ---- Android ------------------------------------------------------------------------------
res = os.path.join(app, 'android', 'app', 'src', 'main', 'res')
if os.path.isdir(res):
    for density, legacy, layer in (('mdpi', 48, 108), ('hdpi', 72, 162), ('xhdpi', 96, 216), ('xxhdpi', 144, 324), ('xxxhdpi', 192, 432)):
        d = os.path.join(res, f'mipmap-{density}')
        save(icon, os.path.join(d, 'ic_launcher.png'), legacy)
        save(foreground, os.path.join(d, 'ic_launcher_foreground.png'), layer)
        save(monochrome, os.path.join(d, 'ic_launcher_monochrome.png'), layer)
    os.makedirs(os.path.join(res, 'mipmap-anydpi-v26'), exist_ok=True)
    with open(os.path.join(res, 'mipmap-anydpi-v26', 'ic_launcher.xml'), 'w') as f:
        f.write('''<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background" />
    <foreground android:drawable="@mipmap/ic_launcher_foreground" />
    <monochrome android:drawable="@mipmap/ic_launcher_monochrome" />
</adaptive-icon>
''')
    with open(os.path.join(res, 'values', 'ic_launcher_background.xml'), 'w') as f:
        f.write('''<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#FFFFFF</color>
</resources>
''')
    # splash: the glyph on the window background, in light and dark
    save(mark.resize((320, round(320 * mark.height / mark.width)), LANCZOS), os.path.join(res, 'drawable-nodpi', 'launch_mark.png'))
    for folder in ('drawable', 'drawable-v21'):
        p = os.path.join(res, folder, 'launch_background.xml')
        if os.path.exists(p):
            s = open(p).read()
            s = re.sub(r'\s*<!-- You can insert your own image assets here -->\s*<!-- <item>.*?</item> -->', '', s, flags=re.S)
            if 'launch_mark' not in s:
                s = s.replace('</layer-list>', '''    <item>
        <bitmap
            android:gravity="center"
            android:src="@drawable/launch_mark" />
    </item>
</layer-list>''')
            open(p, 'w').write(s)

# ---- iOS ----------------------------------------------------------------------------------
assets = os.path.join(app, 'ios', 'Runner', 'Assets.xcassets')
iconset = os.path.join(assets, 'AppIcon.appiconset')
if os.path.isdir(iconset):
    contents = json.load(open(os.path.join(iconset, 'Contents.json')))
    for entry in contents['images']:
        w = float(entry['size'].split('x')[0])
        px = round(w * int(entry['scale'].rstrip('x')))
        save(icon, os.path.join(iconset, entry['filename']), px)
    launch = os.path.join(assets, 'LaunchImage.imageset')
    width_pt = 150
    height_pt = round(width_pt * mark.height / mark.width)
    for scale, name in ((1, 'LaunchImage.png'), (2, 'LaunchImage@2x.png'), (3, 'LaunchImage@3x.png')):
        save(mark.resize((width_pt * scale, height_pt * scale), LANCZOS), os.path.join(launch, name))
    sb = os.path.join(app, 'ios', 'Runner', 'Base.lproj', 'LaunchScreen.storyboard')
    s = open(sb).read()
    s = re.sub(r'<image name="LaunchImage" width="\d+" height="\d+"/>', f'<image name="LaunchImage" width="{width_pt}" height="{height_pt}"/>', s)
    open(sb, 'w').write(s)
print('exported to', app)
