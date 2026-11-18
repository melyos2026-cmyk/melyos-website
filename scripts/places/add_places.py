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
BAD = re.compile(r"(?i)\b(storage|sales|dealers?|dealership|repair|service|rentals?|insurance|parts|wash|mobile|mhc|mhp|manufactured|homes?|apartments?|condos?|hoa|hotel|motel|inn|suites|hyatt|marriott|hilton|plant|factory|powersports|store|shop|outlet|club|yacht sales|brokerage|vans?|trailers?|towing|mechanic|church|school|llc office)\b")

data = json.load(open(PATH))
data["rows"] = [r for r in data["rows"] if not str(r[7]).startswith("ov-")]  # re-runs start clean
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
err = None
info = {}
if release:
    try:
        import duckdb
        con = duckdb.connect()
        con.execute("INSTALL httpfs; LOAD httpfs; SET s3_region='us-west-2';")
        x0, y0, x1, y1 = BBOX
        src = f"read_parquet('s3://overturemaps-us-west-2/release/{release}/theme=places/type=place/*', hive_partitioning=1, union_by_name=1)"
        desc = con.execute(f"DESCRIBE SELECT * FROM {src}").fetchall()
        cols = {r[0]: r[1] for r in desc}
        info["columns"] = {k: v[:120] for k, v in cols.items()}
        cat_exprs = []
        if "categories" in cols: cat_exprs.append("categories.primary")
        if "basic_category" in cols: cat_exprs.append("basic_category")
        if "taxonomy" in cols: cat_exprs.append("taxonomy.primary")
        cat = "concat_ws('|', " + ", ".join(f"coalesce(CAST({e} AS VARCHAR), '')" for e in cat_exprs) + ")" if cat_exprs else "''"
        lat = "(bbox.ymin + bbox.ymax) / 2"; lon = "(bbox.xmin + bbox.xmax) / 2"
        web = "websites[1]" if "websites" in cols else "NULL"
        phone = "phones[1]" if "phones" in cols else "NULL"
        city = "addresses[1].locality" if "addresses" in cols else "NULL"
        region = "addresses[1].region" if "addresses" in cols else "NULL"
        conf = "confidence" if "confidence" in cols else "1.0"
        q = f"""
          SELECT id, names.primary AS name, {cat} AS cat, {conf} AS conf, {lat} AS lat, {lon} AS lon,
                 {web} AS web, {phone} AS phone, {city} AS city, {region} AS region
          FROM {src}
          WHERE bbox.xmin BETWEEN {x0} AND {x1} AND bbox.ymin BETWEEN {y0} AND {y1}
            AND regexp_matches({cat}, '(^|\\|)(rv_park|campground|marina|caravan_site|camp_site|rv_and_campground)(\\||$)')
            AND {conf} >= 0.7
        """
        top = con.execute(f"""SELECT {cat} AS c, count(*) n FROM {src} WHERE bbox.xmin BETWEEN {x0} AND {x1} AND bbox.ymin BETWEEN {y0} AND {y1}
            AND regexp_matches({cat}, '(rv|camp|marina|caravan)') GROUP BY 1 ORDER BY 2 DESC LIMIT 40""").fetchall()
        info["category_values"] = [[c, n] for c, n in top]
        res = con.execute(q).fetchall()
        info["candidates"] = len(res)
        print("overture candidates:", len(res), flush=True)
        for oid, name, c, cf, la, lo, w, ph, ci, rg in res:
            if not name or la is None or (rg and str(rg).upper() not in (ST, "FLORIDA")):
                continue
            name = name.strip()
            if len(name) < 4 or BAD.search(name):
                continue
            k = "m" if "marina" in c else "r" if re.search(r"rv_park|caravan", c) else "c"
            w = w or ""
            if w and not w.startswith("http"):
                w = "https://" + w
            add([k, name[:90], round(la, 5), round(lo, 5), (ci or "")[:40], (ph or "")[:30], w[:160], "ov-" + str(oid).replace("-", "")[:16]])
    except Exception as e:
        import traceback
        err = traceback.format_exc()[-1500:]
        print(err, flush=True)

rows.sort(key=lambda r: (r[0], r[1].lower()))
json.dump(data, open(PATH, "w"), separators=(",", ":"))
ip = os.path.join(ROOT, "public", "explore", "index.json")
index = json.load(open(ip))
index[ST] = {**index.get(ST, {}), **{k: sum(1 for r in rows if r[0] == k) for k in ("m", "r", "c")}}
json.dump(index, open(ip, "w"), separators=(",", ":"), sort_keys=True)
stats = {"state": ST, "added": len(added), "by_kind": {k: sum(1 for r in added if r[0] == k) for k in "mrc"}, "total": len(rows),
         "sample": [r[1] for r in added[:25]], "release": release, "error": err, "overture": info}
json.dump(stats, open(os.path.join(ROOT, "scripts", "places", "last_run.json"), "w"), indent=1)
print(json.dumps(stats, indent=1))
