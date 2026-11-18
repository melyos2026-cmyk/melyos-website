#!/usr/bin/env python3
"""Nov 18 (per Mely): fill in the RV parks, campgrounds and marinas OpenStreetMap is missing.

Source: Overture Maps "places" (open data, CDLA-Permissive-2.0 - commercial use allowed), read straight from
its public bucket with DuckDB, plus hand-added places in scripts/places/manual_{ST}.json.
New places are appended to public/explore/{ST}.json (existing rows are never changed or removed) and
public/explore/index.json counts are updated. A place is skipped when one we already list is close by with
a similar name (or very close with the same kind).
Run: python scripts/places/add_places.py FL   (GitHub Actions: .github/workflows/places.yml)
"""
import json, math, os, re, subprocess, sys

ST = (sys.argv[1] if len(sys.argv) > 1 else "FL").upper()
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PATH = os.path.join(ROOT, "public", "explore", f"{ST}.json")
BBOX = {"FL": (-87.7, 24.4, -79.8, 31.1)}[ST]  # xmin, ymin, xmax, ymax
KINDS = {"rv_park": "r", "campground": "c", "marina": "m"}
BAD = re.compile(r"(?i)\b(storage|sales|dealer|dealership|repair|service center|rentals?|insurance|parts|wash|mobile home park|manufactured|apartments?|condo|hoa)\b")

data = json.load(open(PATH))
rows = data["rows"]
have = {r[7] for r in rows}


def norm(s):
    s = re.sub(r"(?i)\b(the|rv|resort|park|campground|camp|marina|and|&|of|llc|inc|at|by)\b", " ", s.lower())
    return set(re.findall(r"[a-z0-9]+", s))


def dist(a, b):
    x = (a[1] - b[1]) * 111320 * math.cos(math.radians(a[0]))
    y = (a[0] - b[0]) * 111320
    return math.hypot(x, y)


def duplicate(k, name, lat, lon):
    n = norm(name)
    for r in rows:
        if abs(r[2] - lat) > 0.01 or abs(r[3] - lon) > 0.012:
            continue
        d = dist((lat, lon), (r[2], r[3]))
        m = norm(r[1])
        sim = len(n & m) / max(1, len(n | m))
        if (d < 400 and sim >= 0.34) or (d < 90 and r[0] == k) or (d < 1500 and sim >= 0.75):
            return True
    return False


added = []


def add(row):
    if row[7] in have or duplicate(row[0], row[1], row[2], row[3]):
        return
    rows.append(row); have.add(row[7]); added.append(row)


# 1) hand-added places
man = os.path.join(ROOT, "scripts", "places", f"manual_{ST}.json")
if os.path.exists(man):
    for r in json.load(open(man)):
        add(r)

# 2) Overture Maps places
release = None
try:
    out = subprocess.run(["aws", "s3", "ls", "s3://overturemaps-us-west-2/release/", "--no-sign-request"], capture_output=True, text=True, timeout=120).stdout
    rels = sorted(re.findall(r"PRE (\d{4}-\d{2}-\d{2}[^/]*)/", out))
    release = rels[-1] if rels else None
except Exception as e:
    print("release list failed:", e)
print("overture release:", release, flush=True)
if release:
    import duckdb
    con = duckdb.connect()
    con.execute("INSTALL httpfs; LOAD httpfs; INSTALL spatial; LOAD spatial; SET s3_region='us-west-2';")
    x0, y0, x1, y1 = BBOX
    src = f"read_parquet('s3://overturemaps-us-west-2/release/{release}/theme=places/type=place/*', hive_partitioning=1)"
    cols = {r[0] for r in con.execute(f"DESCRIBE SELECT * FROM {src} LIMIT 1").fetchall()}
    print("columns:", sorted(cols), flush=True)
    cat = "categories.primary"
    q = f"""
      SELECT id, names.primary AS name, {cat} AS cat, confidence,
             ST_Y(geometry) AS lat, ST_X(geometry) AS lon,
             websites[1] AS web, phones[1] AS phone, addresses[1].locality AS city, addresses[1].region AS region
      FROM {src}
      WHERE bbox.xmin BETWEEN {x0} AND {x1} AND bbox.ymin BETWEEN {y0} AND {y1}
        AND {cat} IN ('rv_park', 'campground', 'marina')
        AND confidence >= 0.55
    """
    res = con.execute(q).fetchall()
    print("overture candidates:", len(res), flush=True)
    for oid, name, c, conf, lat, lon, web, phone, city, region in res:
        if not name or lat is None or (region and str(region).upper() not in (ST, "FLORIDA")):
            continue
        name = name.strip()
        if len(name) < 4 or BAD.search(name):
            continue
        web = web or ""
        if web and not web.startswith("http"):
            web = "https://" + web
        add([KINDS[c], name[:90], round(lat, 5), round(lon, 5), (city or "")[:40], (phone or "")[:30], web[:160], "ov-" + oid.replace("-", "")[:16]])

rows.sort(key=lambda r: (r[0], r[1].lower()))
json.dump(data, open(PATH, "w"), separators=(",", ":"))
ip = os.path.join(ROOT, "public", "explore", "index.json")
index = json.load(open(ip))
index[ST] = {**index.get(ST, {}), **{k: sum(1 for r in rows if r[0] == k) for k in ("m", "r", "c")}}
json.dump(index, open(ip, "w"), separators=(",", ":"), sort_keys=True)
stats = {"state": ST, "added": len(added), "by_kind": {k: sum(1 for r in added if r[0] == k) for k in "mrc"}, "total": len(rows),
         "sample": [r[1] for r in added[:25]]}
json.dump(stats, open(os.path.join(ROOT, "scripts", "places", "last_run.json"), "w"), indent=1)
print(json.dumps(stats, indent=1))
