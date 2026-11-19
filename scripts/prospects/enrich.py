#!/usr/bin/env python3
"""Nov 19 (per Mely): find phone numbers (and websites) for Sales Partner prospects that have none.
Source: Overture Maps places (open data, CDLA-Permissive-2.0). Input scripts/prospects/need_FL.json
[{id,name,city,...}] -> output scripts/prospects/found_FL.json {id: {phone, web, match, city}}.
A match needs the same city (when we know it) and a very similar name."""
import json, os, re, subprocess, duckdb

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
need = json.load(open(os.path.join(ROOT, "scripts/prospects/need_FL.json")))
x0, y0, x1, y1 = (-87.7, 24.4, -79.8, 31.1)
out = subprocess.run(["aws", "s3", "ls", "s3://overturemaps-us-west-2/release/", "--no-sign-request"], capture_output=True, text=True).stdout
release = sorted(re.findall(r"PRE (\d{4}-\d{2}-\d{2}[^/]*)/", out))[-1]
print("release", release, flush=True)

def norm(s):
    s = (s or "").lower().split(" - ")[0]
    return re.sub(r"[^a-z0-9]", "", re.sub(r"\b(the|inc|llc|of|and)\b", " ", s.replace("&", " and ")))

con = duckdb.connect()
con.execute("INSTALL httpfs; LOAD httpfs; SET s3_region='us-west-2';")
src = f"read_parquet('s3://overturemaps-us-west-2/release/{release}/theme=places/type=place/*', hive_partitioning=1, union_by_name=1)"
con.execute(f"""CREATE TABLE p AS SELECT names.primary AS name, phones[1] AS phone, websites[1] AS web,
  lower(coalesce(addresses[1].locality,'')) AS city, coalesce(addresses[1].freeform,'') AS addr
  FROM {src} WHERE bbox.xmin BETWEEN {x0} AND {x1} AND bbox.ymin BETWEEN {y0} AND {y1}
  AND (phones IS NOT NULL OR websites IS NOT NULL) AND names.primary IS NOT NULL""")
print("places with contact", con.execute("select count(*) from p").fetchone(), flush=True)
rows = con.execute("select name, phone, web, city, addr from p").fetchall()
by = {}
for nm, ph, w, ci, ad in rows:
    by.setdefault(norm(nm), []).append((nm, ph, w, ci, ad))

found = {}
for n in need:
    key, city = norm(n["name"]), n["city"].lower()
    if len(key) < 5: continue
    cands = by.get(key, [])
    if city: cands = [c for c in cands if c[3] == city or (n["address"] and n["address"].split(" ")[0] in c[4])]
    if len(cands) != 1:  # ambiguous or none -> try the address: same street number + city
        if n["address"] and city:
            num = n["address"].split(" ")[0]
            alt = [c for c in by.get(key, []) if c[4].startswith(num + " ")]
            if len(alt) == 1: cands = alt
    if len(cands) == 1 or (len(cands) > 1 and len({c[1] for c in cands}) == 1):
        nm, ph, w, ci, ad = cands[0]
        found[n["id"]] = {"phone": ph or "", "web": w or "", "match": nm, "city": ci}
print("found", len(found), "of", len(need), flush=True)
json.dump(found, open(os.path.join(ROOT, "scripts/prospects/found_FL.json"), "w"), indent=0)
