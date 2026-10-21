# Oct 21 (per Mely): MelyOS Explore data. Downloads marinas, RV parks and campgrounds
# for every US state from OpenStreetMap (Overpass API) and writes one compact JSON per
# state to public/explore/<ST>.json plus public/explore/index.json with counts.
# Data © OpenStreetMap contributors, ODbL — the site shows the attribution.
import json, os, re, sys, time, urllib.request, urllib.parse

STATES = {
 "AL":"Alabama","AK":"Alaska","AZ":"Arizona","AR":"Arkansas","CA":"California","CO":"Colorado","CT":"Connecticut","DE":"Delaware",
 "DC":"District of Columbia","FL":"Florida","GA":"Georgia","HI":"Hawaii","ID":"Idaho","IL":"Illinois","IN":"Indiana","IA":"Iowa",
 "KS":"Kansas","KY":"Kentucky","LA":"Louisiana","ME":"Maine","MD":"Maryland","MA":"Massachusetts","MI":"Michigan","MN":"Minnesota",
 "MS":"Mississippi","MO":"Missouri","MT":"Montana","NE":"Nebraska","NV":"Nevada","NH":"New Hampshire","NJ":"New Jersey","NM":"New Mexico",
 "NY":"New York","NC":"North Carolina","ND":"North Dakota","OH":"Ohio","OK":"Oklahoma","OR":"Oregon","PA":"Pennsylvania","RI":"Rhode Island",
 "SC":"South Carolina","SD":"South Dakota","TN":"Tennessee","TX":"Texas","UT":"Utah","VT":"Vermont","VA":"Virginia","WA":"Washington",
 "WV":"West Virginia","WI":"Wisconsin","WY":"Wyoming",
}
SERVERS = ["https://overpass-api.de/api/interpreter", "https://overpass.kumi.systems/api/interpreter"]
only = [s.strip().upper() for s in (sys.argv[1] if len(sys.argv) > 1 else "").split(",") if s.strip()]
out_dir = "public/explore"
os.makedirs(out_dir, exist_ok=True)

def query(st):
    q = f"""[out:json][timeout:240];
area["ISO3166-2"="US-{st}"][admin_level=4]->.a;
(
  nwr["leisure"="marina"]["name"](area.a);
  nwr["tourism"="caravan_site"]["name"](area.a);
  nwr["tourism"="camp_site"]["name"](area.a);
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

def kind(t):
    if t.get("leisure") == "marina": return "m"
    if t.get("tourism") == "caravan_site": return "r"
    return "c"

index = {}
if os.path.exists(f"{out_dir}/index.json"):
    index = json.load(open(f"{out_dir}/index.json"))
for st, name in STATES.items():
    if only and st not in only: continue
    res = query(st)
    seen, rows = set(), []
    for el in res.get("elements", []):
        t = el.get("tags", {})
        lat = el.get("lat") or (el.get("center") or {}).get("lat")
        lon = el.get("lon") or (el.get("center") or {}).get("lon")
        nm = (t.get("name") or "").strip()
        if not nm or lat is None: continue
        # Individual pitches/sites inside a campground ("1", "24", "Site 12", "A-3") are not places.
        if len(nm) < 4 or re.fullmatch(r"(?i)(site|lot|pad|loop|pitch|spot|campsite|cabin)?\s*#?\s*[A-Za-z]{0,2}[-\s]?\d+[A-Za-z]?", nm): continue
        k = kind(t)
        if k == "c" and (t.get("backcountry") == "yes" or t.get("access") in ("private", "no") or t.get("camp_site") in ("basic", "pitch")): continue
        key = (k, nm.lower(), round(lat, 3), round(lon, 3))
        if key in seen: continue
        seen.add(key)
        city = t.get("addr:city") or ""
        web = t.get("website") or t.get("contact:website") or t.get("url") or ""
        if web and not web.startswith("http"): web = "https://" + web
        phone = t.get("phone") or t.get("contact:phone") or ""
        rows.append([k, nm[:90], round(lat, 5), round(lon, 5), city[:40], phone[:30], web[:160], f"{el['type'][0]}{el['id']}"])
    rows.sort(key=lambda r: (r[0], r[1].lower()))
    json.dump({"state": st, "name": name, "rows": rows}, open(f"{out_dir}/{st}.json", "w"), separators=(",", ":"))
    index[st] = {"name": name, "m": sum(r[0] == "m" for r in rows), "r": sum(r[0] == "r" for r in rows), "c": sum(r[0] == "c" for r in rows)}
    print(st, index[st], flush=True)
    time.sleep(8)
json.dump(index, open(f"{out_dir}/index.json", "w"), separators=(",", ":"), sort_keys=True)
