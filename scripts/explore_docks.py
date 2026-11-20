# Nov 20 (per Mely): free arrival docks for boaters — public boat ramps, tie-up/landing
# docks, piers with mooring and small unnamed docks. MelyOS earns nothing on them, so they
# are NOT on the public map: only boaters with a free MelyOS Explore account see them
# (served by /api/explore/docks after sign-in). Writes data/docks/<ST>.json (private, not public/).
# Row: [type r=ramp d=dock p=pier a=anchorage, name, lat, lon, fee "free"|"paid"|"", osm id]
# Data © OpenStreetMap contributors, ODbL.
import json, os, sys, time, urllib.request, urllib.parse

STATES = {
 "AL":"Alabama","AK":"Alaska","AZ":"Arizona","AR":"Arkansas","CA":"California","CO":"Colorado","CT":"Connecticut","DE":"Delaware",
 "DC":"District of Columbia","FL":"Florida","GA":"Georgia","HI":"Hawaii","ID":"Idaho","IL":"Illinois","IN":"Indiana","IA":"Iowa",
 "KS":"Kansas","KY":"Kentucky","LA":"Louisiana","ME":"Maine","MD":"Maryland","MA":"Massachusetts","MI":"Michigan","MN":"Minnesota",
 "MS":"Mississippi","MO":"Missouri","MT":"Montana","NE":"Nebraska","NV":"Nevada","NH":"New Hampshire","NJ":"New Jersey","NM":"New Mexico",
 "NY":"New York","NC":"North Carolina","ND":"North Dakota","OH":"Ohio","OK":"Oklahoma","OR":"Oregon","PA":"Pennsylvania","RI":"Rhode Island",
 "SC":"South Carolina","SD":"South Dakota","TN":"Tennessee","TX":"Texas","UT":"Utah","VT":"Vermont","VA":"Virginia","WA":"Washington",
 "WV":"West Virginia","WI":"Wisconsin","WY":"Wyoming","PR":"Puerto Rico",
}
SERVERS = ["https://overpass-api.de/api/interpreter", "https://overpass.kumi.systems/api/interpreter", "https://overpass.private.coffee/api/interpreter"]
only = [s.strip().upper() for s in (sys.argv[1] if len(sys.argv) > 1 else "").split(",") if s.strip()]
out_dir = "data/docks"
os.makedirs(out_dir, exist_ok=True)

def query(st):
    q = f"""[out:json][timeout:250];
area["ISO3166-2"="US-{st}"][admin_level=4]->.a;
(
  nwr["leisure"="slipway"](area.a);
  nwr["leisure"="marina"][!"name"](area.a);
  nwr["man_made"="pier"]["mooring"](area.a);
  nwr["man_made"="pier"]["leisure"!="fishing"]["access"!="private"]["name"~"dock|landing|marina|boat",i](area.a);
  nwr["mooring"~"yes|public|guest|visitor"](area.a);
  nwr["seamark:type"~"anchorage|mooring"](area.a);
);
out center tags;"""
    data = urllib.parse.urlencode({"data": q}).encode()
    last = None
    for attempt in range(6):
        url = SERVERS[attempt % len(SERVERS)]
        try:
            req = urllib.request.Request(url, data=data, headers={"User-Agent": "MelyOS-Explore/1.0 (info@melyos.io)"})
            with urllib.request.urlopen(req, timeout=300) as r:
                return json.load(r)
        except Exception as e:
            last = e
            time.sleep(20 * (attempt + 1))
    raise RuntimeError(f"{st}: {last}")

def typ(t):
    if t.get("leisure") == "slipway": return "r"
    if "anchorage" in (t.get("seamark:type") or ""): return "a"
    if t.get("man_made") == "pier": return "p"
    return "d"

LABEL = {"r": "Boat ramp", "d": "Dock", "p": "Pier", "a": "Anchorage"}
batch = os.environ.get("BATCH", "")
index, failed = {}, []
for st, name in STATES.items():
    if only and st not in only: continue
    try:
        res = query(st)
    except Exception as e:
        failed.append(st); print(f"::warning title=Docks {st} failed::{str(e)[:200]}", flush=True); continue
    seen, rows = set(), []
    for el in res.get("elements", []):
        t = el.get("tags", {})
        if t.get("access") in ("private", "no", "customers", "permit"): continue
        lat = el.get("lat") or (el.get("center") or {}).get("lat")
        lon = el.get("lon") or (el.get("center") or {}).get("lon")
        if lat is None: continue
        k = typ(t)
        key = (k, round(lat, 4), round(lon, 4))
        if key in seen: continue
        seen.add(key)
        fee = (t.get("fee") or "").lower()
        fee = "free" if fee == "no" else "paid" if fee in ("yes", "donation") or fee.startswith("$") else ""
        nm = (t.get("name") or t.get("seamark:name") or "").strip()[:80]
        rows.append([k, nm, round(lat, 5), round(lon, 5), fee, f"{el['type'][0]}{el['id']}"])
    rows.sort(key=lambda r: (r[0], r[1].lower()))
    json.dump({"state": st, "rows": rows}, open(f"{out_dir}/{st}.json", "w"), separators=(",", ":"))
    index[st] = {k: sum(r[0] == k for r in rows) for k in LABEL}
    print(st, index[st], flush=True)
    time.sleep(8)
json.dump(index, open(f"{out_dir}/index-part-{batch or 'all'}.json", "w"), separators=(",", ":"), sort_keys=True)
print(f"::notice title=Docks batch {batch or 'all'}::done {len(index)} states; failed: {','.join(failed) or 'none'}", flush=True)
