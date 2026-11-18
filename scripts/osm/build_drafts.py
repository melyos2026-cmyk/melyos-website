#!/usr/bin/env python3
"""Nov 17 (per Mely): draft slip / site maps for MelyOS Explore, built from OpenStreetMap (ODbL).

For every listing of a state (public/explore/{ST}.json):
  * campgrounds / RV parks -> mapped sites from tourism=camp_pitch (numbered with ref/name when tagged)
  * marinas -> mapped berths (seamark:type=berth) when tagged, otherwise slips ESTIMATED along the
    marina's piers (man_made=pier) - always reviewed by a person before publishing.
Output (read by melyos.io):
  public/explore/drafts/{ST}.json          index  {generated_at, attribution, items: {key: {...}}}
  public/explore/drafts/{ST}/{key}.json    draft  {center_lat, center_lon, zoom, slips, docks, quality, source}
Run: python scripts/osm/build_drafts.py FL   (runs in GitHub Actions: .github/workflows/osm-drafts.yml)
"""
import json, math, os, sys, time, urllib.parse, urllib.request

ST = (sys.argv[1] if len(sys.argv) > 1 else "FL").upper()
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "public", "explore", "drafts")
ENDPOINTS = ["https://overpass-api.de/api/interpreter", "https://overpass.kumi.systems/api/interpreter",
             "https://overpass.private.coffee/api/interpreter"]
FT = 0.3048
UA = "MelyOS-Explore-drafts/1.0 (info@melyos.io)"


def overpass(q):
    last = None
    for attempt in range(6):
        url = ENDPOINTS[attempt % len(ENDPOINTS)]
        try:
            req = urllib.request.Request(url, data=urllib.parse.urlencode({"data": q}).encode(), headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=900) as r:
                return json.load(r)
        except Exception as e:  # rate limits / timeouts: wait and try the next mirror
            last = e
            print(f"overpass {url} failed: {e}", flush=True)
            time.sleep(20 * (attempt + 1))
    raise SystemExit(f"Overpass unavailable: {last}")


# ---------- geometry (local metres around a point) ----------
def to_xy(lat0, lon0, lat, lon):
    return ((lon - lon0) * 111320 * math.cos(math.radians(lat0)), (lat - lat0) * 111320)


def to_ll(lat0, lon0, x, y):
    return (lat0 + y / 111320, lon0 + x / (111320 * math.cos(math.radians(lat0))))


def dist_m(a, b):
    x, y = to_xy(a[0], a[1], b[0], b[1])
    return math.hypot(x, y)


def seg_dist(p, a, b):
    ax, ay = a; bx, by = b; px, py = p
    dx, dy = bx - ax, by - ay
    L = dx * dx + dy * dy
    t = 0 if L == 0 else max(0, min(1, ((px - ax) * dx + (py - ay) * dy) / L))
    return math.hypot(px - (ax + t * dx), py - (ay + t * dy))


def bearing(a, b):  # a, b in local xy -> compass degrees (0 = north)
    return (math.degrees(math.atan2(b[0] - a[0], b[1] - a[1])) + 360) % 360


def point_in_poly(x, y, poly):
    inside = False
    j = len(poly) - 1
    for i in range(len(poly)):
        xi, yi = poly[i]; xj, yj = poly[j]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / ((yj - yi) or 1e-12) + xi:
            inside = not inside
        j = i
    return inside


def rect_of(points_ll):
    """Oriented rectangle of a closed shape: center, length/width (ft), angle of the long side."""
    lat0 = sum(p[0] for p in points_ll) / len(points_ll)
    lon0 = sum(p[1] for p in points_ll) / len(points_ll)
    xy = [to_xy(lat0, lon0, a, b) for a, b in points_ll]
    best = None
    for i in range(len(xy) - 1):
        ang = math.atan2(xy[i + 1][1] - xy[i][1], xy[i + 1][0] - xy[i][0])
        c, s = math.cos(-ang), math.sin(-ang)
        rx = [x * c - y * s for x, y in xy]; ry = [x * s + y * c for x, y in xy]
        w, h = max(rx) - min(rx), max(ry) - min(ry)
        if best is None or w * h < best[0]:
            cx = (max(rx) + min(rx)) / 2; cy = (max(ry) + min(ry)) / 2
            c2, s2 = math.cos(ang), math.sin(ang)
            best = (w * h, w, h, ang, cx * c2 - cy * s2, cx * s2 + cy * c2)
    if not best:
        return None
    _, w, h, ang, cx, cy = best
    long_, short, a = (w, h, ang) if w >= h else (h, w, ang + math.pi / 2)
    lat, lon = to_ll(lat0, lon0, cx, cy)
    comp = (90 - math.degrees(a)) % 180  # math angle -> compass, folded (a rectangle is symmetric)
    return lat, lon, long_ / FT, short / FT, comp


def geom_ll(el):
    if "geometry" in el:
        return [(g["lat"], g["lon"]) for g in el["geometry"] if g]
    if el.get("type") == "node":
        return [(el["lat"], el["lon"])]
    if "center" in el:
        return [(el["center"]["lat"], el["center"]["lon"])]
    return []


def rel_outer(el):
    rings = []
    for m in el.get("members", []):
        if m.get("role") in ("outer", "") and m.get("geometry"):
            rings.append([(g["lat"], g["lon"]) for g in m["geometry"] if g])
    return max(rings, key=len) if rings else []


def clean_num(s):
    s = (s or "").strip()
    for p in ("Site ", "site ", "Pitch ", "Slip ", "slip ", "#"):
        if s.startswith(p):
            s = s[len(p):]
    return s[:12]


def zoom_for(span_m):
    return 19 if span_m < 160 else 18 if span_m < 350 else 17 if span_m < 800 else 16


# ---------- main ----------
rows = json.load(open(os.path.join(ROOT, "public", "explore", f"{ST}.json")))["rows"]
marinas = [r for r in rows if r[0] == "m"]
camps = [r for r in rows if r[0] in ("r", "c")]
print(f"{ST}: {len(marinas)} marinas, {len(camps)} campgrounds / RV parks", flush=True)

# The listing's own OSM outline (most ids are OSM: w123 / r123 / n123) -> exact "inside the property" tests.
def osm_ids(rs, prefix):
    return [r[7][1:] for r in rs if r[7][:1] == prefix and r[7][1:].isdigit()]


def fetch_outlines(rs):
    ways, rels = osm_ids(rs, "w"), osm_ids(rs, "r")
    out = {}
    for chunk in range(0, max(len(ways), len(rels)), 400):
        w = ways[chunk:chunk + 400]; rl = rels[chunk:chunk + 400]
        parts = (f"way(id:{','.join(w)});" if w else "") + (f"relation(id:{','.join(rl)});" if rl else "")
        if not parts:
            continue
        for el in overpass(f"[out:json][timeout:600];({parts});out geom;")["elements"]:
            ring = geom_ll(el) if el["type"] == "way" else rel_outer(el)
            if len(ring) >= 4:
                out[("w" if el["type"] == "way" else "r") + str(el["id"])] = ring
    return out


outlines = fetch_outlines(rows)
print(f"outlines: {len(outlines)}", flush=True)


def around_query(rs, radius, body):
    lines = [f'{body}(around:{radius},{r[2]:.6f},{r[3]:.6f});' for r in rs]
    return "[out:json][timeout:900];(" + "".join(lines) + ");out tags geom;"


def chunks(xs, n):
    for i in range(0, len(xs), n):
        yield xs[i:i + n]


pitches, piers, berths = [], [], []
for part in chunks(camps, 150):
    pitches += overpass(around_query(part, 900, 'nwr["tourism"="camp_pitch"]'))["elements"]
    time.sleep(5)
for part in chunks(marinas, 120):
    piers += overpass(around_query(part, 400, 'way["man_made"="pier"]'))["elements"]
    time.sleep(5)
    berths += overpass(around_query(part, 400, 'nwr["seamark:type"="berth"]'))["elements"]
    time.sleep(5)
dedupe = lambda els: list({(e["type"], e["id"]): e for e in els}.values())
pitches, piers, berths = dedupe(pitches), dedupe(piers), dedupe(berths)
print(f"pitches {len(pitches)}, piers {len(piers)}, berths {len(berths)}", flush=True)


def owner_of(pt, rs, radius, slack):
    """The listing an element belongs to: inside its outline (+slack m), else the nearest within radius."""
    best, bd = None, 1e18
    for r in rs:
        ring = outlines.get(r[7])
        if ring:
            x, y = to_xy(r[2], r[3], pt[0], pt[1])
            poly = [to_xy(r[2], r[3], a, b) for a, b in ring]
            if point_in_poly(x, y, poly) or min(seg_dist((x, y), poly[i], poly[i + 1]) for i in range(len(poly) - 1)) <= slack:
                return r
            continue  # has an outline and the point is outside it -> not this property
        d = dist_m(pt, (r[2], r[3]))
        if d <= radius and d < bd:
            best, bd = r, d
    return best


def near(rs, pt, km=2.5):
    return [r for r in rs if abs(r[2] - pt[0]) < km / 111 and abs(r[3] - pt[1]) < km / 90]


drafts = {}  # key -> {"row", "slips", "docks", "quality"}


def add_slip(row, s, quality):
    d = drafts.setdefault(row[7], {"row": row, "slips": [], "docks": [], "quality": quality})
    if quality == "mapped":
        d["quality"] = "mapped"
    d["slips"].append(s)


# Campgrounds / RV parks: mapped sites
for el in pitches:
    g = geom_ll(el)
    if not g:
        continue
    c = (sum(p[0] for p in g) / len(g), sum(p[1] for p in g) / len(g))
    row = owner_of(c, near(camps, c), 700, 25)
    if not row:
        continue
    t = el.get("tags", {})
    if el["type"] == "way" and len(g) >= 4 and g[0] == g[-1]:
        rr = rect_of(g)
        if not rr:
            continue
        lat, lon, ln, wd, ang = rr
        if ln > 300 or wd > 150 or ln < 8:
            continue
    else:
        lat, lon, ln, wd, ang = c[0], c[1], 45, 20, 0
    tags = [x for x, ok in (("Water", t.get("drinking_water") == "yes" or t.get("water_point") == "yes"),
                            ("30 amp", "30" in t.get("power_supply:current", "")), ("50 amp", "50" in t.get("power_supply:current", "")),
                            ("Shade", t.get("shade") == "yes")) if ok]
    if t.get("power_supply") == "yes" and not any("amp" in x for x in tags):
        tags.append("Power")
    add_slip(row, {"n": clean_num(t.get("ref") or t.get("name") or ""), "lat": round(lat, 7), "lon": round(lon, 7),
                   "len": round(ln), "wid": round(wd), "ang": round(ang) % 360, "tags": tags, "desc": None}, "mapped")

# Marinas: mapped berths
for el in berths:
    g = geom_ll(el)
    if not g:
        continue
    c = (sum(p[0] for p in g) / len(g), sum(p[1] for p in g) / len(g))
    row = owner_of(c, near(marinas, c), 350, 60)
    if not row:
        continue
    t = el.get("tags", {})
    if el["type"] == "way" and len(g) >= 4 and g[0] == g[-1]:
        rr = rect_of(g)
        if not rr:
            continue
        lat, lon, ln, wd, ang = rr
    else:
        lat, lon, ln, wd, ang = c[0], c[1], 40, 15, 0
    add_slip(row, {"n": clean_num(t.get("seamark:berth:name") or t.get("ref") or t.get("name") or ""), "lat": round(lat, 7),
                   "lon": round(lon, 7), "len": round(ln), "wid": round(wd), "ang": round(ang) % 360, "tags": [], "desc": None}, "mapped")

# Marinas: piers -> dock outlines (always) + estimated slips (only when no berths are mapped)
by_marina = {}
for el in piers:
    g = geom_ll(el)
    if len(g) < 2:
        continue
    c = g[len(g) // 2]
    row = owner_of(c, near(marinas, c), 220, 60)
    if row:
        by_marina.setdefault(row[7], (row, []))[1].append((el, g))

SLIP_LEN, SLIP_WID = 30, 13  # ft, a typical small-boat slip (estimate - the owner corrects it)
for key, (row, els) in by_marina.items():
    d = drafts.setdefault(key, {"row": row, "slips": [], "docks": [], "quality": "estimated"})
    lat0, lon0 = row[2], row[3]
    lines = []
    for el, g in els:
        d["docks"].append([[round(a, 7), round(b, 7)] for a, b in g])
        xy = [to_xy(lat0, lon0, a, b) for a, b in g]
        closed = g[0] == g[-1] and len(g) >= 4
        if closed:  # an area pier -> its centre line
            rr = rect_of(g)
            if not rr:
                continue
            clat, clon, ln, wd, ang = rr
            cx, cy = to_xy(lat0, lon0, clat, clon)
            half = ln * FT / 2
            dx, dy = math.sin(math.radians(ang)) * half, math.cos(math.radians(ang)) * half
            lines.append(([(cx - dx, cy - dy), (cx + dx, cy + dy)], max(1.2, wd * FT / 2)))
        else:
            lines.append((xy, 1.2))
    if d["quality"] == "mapped":
        continue
    total = sum(math.hypot(l[i + 1][0] - l[i][0], l[i + 1][1] - l[i][1]) for l, _ in lines for i in range(len(l) - 1))
    if total > 3000:  # a long boardwalk / fishing pier complex, not a slip marina -> outlines only
        continue
    segs_all = [(l[i], l[i + 1]) for l, _ in lines for i in range(len(l) - 1)]
    placed = []
    step = SLIP_WID * FT
    # Finger-pier marina (many short piers off a main dock): boats sit BETWEEN the fingers, parallel to them
    plen = lambda l: sum(math.hypot(l[i + 1][0] - l[i][0], l[i + 1][1] - l[i][1]) for i in range(len(l) - 1))
    fingers = [(l, hw) for l, hw in lines if 4 <= plen(l) <= 22]
    if len(fingers) >= 5:
        for l, hw in fingers:
            a, b = l[0], l[-1]
            L = math.hypot(b[0] - a[0], b[1] - a[1])
            if L < 3:
                continue
            ux, uy = (b[0] - a[0]) / L, (b[1] - a[1]) / L
            px, py = -uy, ux
            mx, my = (a[0] + b[0]) / 2, (a[1] + b[1]) / 2
            for side in (1, -1):
                off = hw + step / 2
                cx, cy = mx + px * off * side, my + py * off * side
                if any(math.hypot(cx - qx, cy - qy) < step * 0.8 for qx, qy in placed):
                    continue
                placed.append((cx, cy))
                lat, lon = to_ll(lat0, lon0, cx, cy)
                d["slips"].append({"n": "", "lat": round(lat, 7), "lon": round(lon, 7), "len": max(16, round(L / FT)), "wid": SLIP_WID,
                                   "ang": round(bearing(a, b)) % 360, "tags": [], "desc": None})
        continue
    for l, halfw in lines:
        for i in range(len(l) - 1):
            a, b = l[i], l[i + 1]
            L = math.hypot(b[0] - a[0], b[1] - a[1])
            if L < step * 2:
                continue
            ux, uy = (b[0] - a[0]) / L, (b[1] - a[1]) / L
            px, py = -uy, ux
            k = step
            while k <= L - step / 2:
                bx, by = a[0] + ux * k, a[1] + uy * k
                for side in (1, -1):
                    off = halfw + SLIP_LEN * FT / 2
                    cx, cy = bx + px * off * side, by + py * off * side
                    # not on top of another pier, nor of a slip already placed
                    if any(seg_dist((cx, cy), s0, s1) < SLIP_LEN * FT / 2 - 0.5 for s0, s1 in segs_all if not (s0 == a and s1 == b)):
                        continue
                    if any(math.hypot(cx - qx, cy - qy) < step * 0.9 for qx, qy in placed):
                        continue
                    placed.append((cx, cy))
                    lat, lon = to_ll(lat0, lon0, cx, cy)
                    ang = (bearing((0, 0), (px * side, py * side))) % 360
                    d["slips"].append({"n": "", "lat": round(lat, 7), "lon": round(lon, 7), "len": SLIP_LEN, "wid": SLIP_WID,
                                       "ang": round(ang) % 360, "tags": [], "desc": None})
                k += step
            if len(d["slips"]) > 500:
                break
        if len(d["slips"]) > 500:
            break

# Campgrounds / RV parks: what makes the drawing readable - the property outline, its roads and its amenities
POI = {"toilets": "Restrooms", "shower": "Showers", "swimming_pool": "Pool", "playground": "Playground",
       "sanitary_dump_station": "Dump station", "reception": "Office", "laundry": "Laundry", "water_point": "Water",
       "drinking_water": "Water", "picnic_shelter": "Pavilion", "boat_ramp": "Boat ramp", "slipway": "Boat ramp", "dog_park": "Dog park"}
camp_drafts = [d["row"] for d in drafts.values() if d["row"][0] in ("r", "c") and d["slips"]]
extras = {}
for part in chunks(camp_drafts, 60):
    q = "[out:json][timeout:900];(" + "".join(
        f'way["highway"~"^(service|track|residential|unclassified|living_street|footway|path)$"](around:600,{r[2]:.6f},{r[3]:.6f});'
        f'nwr["amenity"~"^(toilets|shower|sanitary_dump_station|drinking_water|water_point|reception|dog_park)$"](around:600,{r[2]:.6f},{r[3]:.6f});'
        f'nwr["leisure"~"^(swimming_pool|playground|picnic_table|slipway|dog_park)$"](around:600,{r[2]:.6f},{r[3]:.6f});'
        f'nwr["shop"="laundry"](around:600,{r[2]:.6f},{r[3]:.6f});nwr["camp_site"="reception"](around:600,{r[2]:.6f},{r[3]:.6f});'
        f'nwr["tourism"="picnic_site"]["shelter"="yes"](around:600,{r[2]:.6f},{r[3]:.6f});'
        for r in part) + ");out tags geom;"
    for el in dedupe(overpass(q)["elements"]):
        g = geom_ll(el)
        if not g:
            continue
        t = el.get("tags", {})
        c = (sum(p[0] for p in g) / len(g), sum(p[1] for p in g) / len(g))
        if "highway" in t:
            # a road belongs to the property it crosses (any point inside / near the outline or near its sites)
            for r in part:
                d = drafts[r[7]]
                ring = outlines.get(r[7])
                if ring:
                    poly = [to_xy(r[2], r[3], a, b) for a, b in ring]
                    hit = any(point_in_poly(*to_xy(r[2], r[3], a, b), poly) for a, b in g)
                else:
                    hit = any(min(dist_m((a, b), (s["lat"], s["lon"])) for s in d["slips"]) < 40 for a, b in g[:: max(1, len(g) // 12)])
                if hit:
                    extras.setdefault(r[7], {"roads": [], "pois": []})["roads"].append([[round(a, 7), round(b, 7)] for a, b in g])
                    break
        else:
            kind = t.get("amenity") or t.get("leisure") or ("laundry" if t.get("shop") == "laundry" else None) or ("reception" if t.get("camp_site") == "reception" else None) or ("picnic_shelter" if t.get("tourism") == "picnic_site" else None)
            label = POI.get(kind or "")
            if not label:
                continue
            row = owner_of(c, near(camp_drafts, c), 450, 30)
            if row:
                extras.setdefault(row[7], {"roads": [], "pois": []})["pois"].append({"t": label, "lat": round(c[0], 7), "lon": round(c[1], 7)})
    time.sleep(5)
print(f"campground extras: {len(extras)}", flush=True)

# Number, size the view, write
os.makedirs(os.path.join(OUT, ST), exist_ok=True)
for f in os.listdir(os.path.join(OUT, ST)):
    os.remove(os.path.join(OUT, ST, f))
index = {}
for key, d in drafts.items():
    row, slips = d["row"], d["slips"]
    if not slips and not d["docks"]:
        continue
    if d["quality"] == "estimated" and len(slips) < 4:
        continue
    lat0, lon0 = row[2], row[3]
    if slips:  # numbers: keep the mapped ones, fill the rest in reading order (north->south, west->east)
        slips.sort(key=lambda s: (-round(s["lat"] * 4000), s["lon"]))
        used = {s["n"] for s in slips if s["n"]}
        nxt = 1
        for i, s in enumerate(slips):
            if not s["n"]:
                while str(nxt) in used:
                    nxt += 1
                s["n"] = str(nxt); used.add(s["n"])
            s["id"] = f"o{i}"
        lats = [s["lat"] for s in slips]; lons = [s["lon"] for s in slips]
        clat, clon = (min(lats) + max(lats)) / 2, (min(lons) + max(lons)) / 2
        span = max(dist_m((min(lats), clon), (max(lats), clon)), dist_m((clat, min(lons)), (clat, max(lons))))
    else:
        clat, clon, span = lat0, lon0, 200
    draft = {"center_lat": round(clat, 7), "center_lon": round(clon, 7), "zoom": zoom_for(span), "slips": slips,
             "docks": d["docks"][:400], "quality": d["quality"], "source": "OpenStreetMap contributors (ODbL)"}
    ex = extras.get(key)
    ring = outlines.get(key)
    if ring and len(ring) <= 400:
        draft["outline"] = [[round(a, 7), round(b, 7)] for a, b in ring]
    if ex:
        draft["roads"] = ex["roads"][:300]
        seen = set(); pois = []
        for p in ex["pois"]:
            k2 = (p["t"], round(p["lat"], 4), round(p["lon"], 4))
            if k2 not in seen:
                seen.add(k2); pois.append(p)
        draft["pois"] = pois[:60]
    with open(os.path.join(OUT, ST, f"{key}.json"), "w") as fh:
        json.dump(draft, fh, separators=(",", ":"))
    index[key] = {"name": row[1], "kind": row[0], "city": row[4], "n": len(slips), "docks": len(d["docks"]), "quality": d["quality"]}

summary = {"generated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), "state": ST,
           "attribution": "Map data © OpenStreetMap contributors (ODbL)", "items": index}
with open(os.path.join(OUT, f"{ST}.json"), "w") as fh:
    json.dump(summary, fh, separators=(",", ":"))
stats = {"state": ST, "generated_at": summary["generated_at"], "listings": len(rows), "drafts": len(index),
         "mapped": sum(1 for v in index.values() if v["quality"] == "mapped"),
         "estimated": sum(1 for v in index.values() if v["quality"] == "estimated"),
         "slips": sum(v["n"] for v in index.values()),
         "inputs": {"pitches": len(pitches), "piers": len(piers), "berths": len(berths), "outlines": len(outlines)}}
json.dump(stats, open(os.path.join(ROOT, "scripts", "osm", "last_run.json"), "w"), indent=1)
print(json.dumps(stats, indent=1))
