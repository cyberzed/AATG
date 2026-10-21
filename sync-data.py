#!/usr/bin/env python3
"""Run after editing beers.json (or any app file) and before committing.

- Regenerates beers-data.js, the offline fallback bundle.
- Stamps sw.js with a hash of the app files so phones drop their old cache.
"""
import hashlib
import re
from pathlib import Path

root = Path(__file__).parent

beers = (root / 'beers.json').read_text(encoding='utf-8')
(root / 'beers-data.js').write_text('window.BEERS_DATA = ' + beers + ';\n', encoding='utf-8')
print('Updated beers-data.js')

digest = hashlib.sha256()
for name in ('beers.json', 'app.js', 'style.css', 'index.html'):
    digest.update((root / name).read_bytes())
version = digest.hexdigest()[:8]

sw = root / 'sw.js'
text = sw.read_text(encoding='utf-8')
new_text, count = re.subn(r"const CACHE_VERSION = '[^']*';", f"const CACHE_VERSION = '{version}';", text)
if count != 1:
    raise SystemExit('Could not find CACHE_VERSION in sw.js')
sw.write_text(new_text, encoding='utf-8')
print('Set sw.js CACHE_VERSION to ' + version)
