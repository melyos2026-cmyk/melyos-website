#!/usr/bin/env python3
"""Nov 18 (per Mely): a photo for each Explore listing that has a website — the picture the place itself
publishes for link previews (its og:image / twitter:image), checked to be a real https image.
Writes public/explore/photos_{ST}.json  { listing id: image url }. Owners who claim a listing can replace it.
Run: python scripts/photos/fetch_photos.py FL m     (kinds: any of m r c)   GitHub Actions: photos.yml
"""
import json, os, re, sys, urllib.request, urllib.parse
from concurrent.futures import ThreadPoolExecutor
from html import unescape

ST = (sys.argv[1] if len(sys.argv) > 1 else "FL").upper()
KINDS = set(sys.argv[2] if len(sys.argv) > 2 else "m")
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
rows = json.load(open(os.path.join(ROOT, "public", "explore", f"{ST}.json")))["rows"]
OUT = os.path.join(ROOT, "public", "explore", f"photos_{ST}.json")
old = json.load(open(OUT)) if os.path.exists(OUT) else {}
UA = {"User-Agent": "Mozilla/5.0 (compatible; MelyOSExplore/1.0; +https://melyos.io/explore)", "Accept": "text/html,*/*"}
META = re.compile(r"<meta\b[^>]*>", re.I)
BAD = re.compile(r"(?i)(logo|icon|favicon|sprite|placeholder|default|blank|avatar|wp-content/plugins|gravatar|facebook\.com|fbcdn|google|badge|seal)")
SKIP_HOSTS = re.compile(r"(?i)(facebook\.com|instagram\.com|google\.|yelp\.|tripadvisor\.|thousandtrails|koa\.com|sunoutdoors|suncommunities|rvonthego|campspot|osceola\.org|\.gov\b|myfwc)")


def get(url, n=600_000, timeout=10):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.geturl(), r.headers.get("Content-Type", ""), r.read(n)


def og(url):
    try:
        final, ctype, body = get(url)
    except Exception:
        return None
    if "html" not in ctype:
        return None
    html = body.decode("utf-8", "ignore")
    found = {}
    for tag in META.findall(html):
        k = re.search(r'(?:property|name)\s*=\s*["\']([^"\']+)', tag, re.I)
        v = re.search(r'content\s*=\s*["\']([^"\']+)', tag, re.I)
        if k and v:
            found.setdefault(k.group(1).lower(), unescape(v.group(1)).strip())
    img = found.get("og:image:secure_url") or found.get("og:image") or found.get("twitter:image") or found.get("twitter:image:src")
    if not img:
        return None
    img = urllib.parse.urljoin(final, img)
    if not img.startswith("https://") or BAD.search(img) or len(img) > 300:
        return None
    try:  # the image itself must load as a picture of a decent size
        _, ctype, data = get(img, n=2_000_000, timeout=10)
    except Exception:
        return None
    if not ctype.startswith("image/") or "svg" in ctype or len(data) < 12_000:
        return None
    return img


def one(r):
    site = r[6]
    if not site or SKIP_HOSTS.search(site):
        return r[7], None
    if not site.startswith("http"):
        site = "http://" + site
    return r[7], og(site)


todo = [r for r in rows if r[0] in KINDS and r[6]]
print(f"{ST}: {len(todo)} listings with a website", flush=True)
res = dict(old)
with ThreadPoolExecutor(24) as ex:
    for i, (k, img) in enumerate(ex.map(one, todo), 1):
        if img:
            res[k] = img
        elif k in res and any(r[7] == k for r in todo):
            res.pop(k, None)
        if i % 100 == 0:
            print(i, "done,", len(res), "photos", flush=True)
# hand-picked owner photos (scripts/photos/manual_{ST}.json) always win and are never dropped
MAN = os.path.join(ROOT, "scripts", "photos", f"manual_{ST}.json")
if os.path.exists(MAN):
    res.update(json.load(open(MAN)))
json.dump(dict(sorted(res.items())), open(OUT, "w"), separators=(",", ":"))
print("photos:", len(res))
