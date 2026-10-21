# Oct 21: merge the per-batch index parts into public/explore/index.json.
import glob, json, os
d = "public/explore"
index = json.load(open(f"{d}/index.json")) if os.path.exists(f"{d}/index.json") else {}
for p in sorted(glob.glob(f"{d}/index-part-*.json")):
    index.update(json.load(open(p)))
    os.remove(p)
json.dump(index, open(f"{d}/index.json", "w"), separators=(",", ":"), sort_keys=True)
tot = {k: sum(v[k] for v in index.values()) for k in ("m", "r", "c")}
print(f"::notice title=Explore index::{len(index)} states · marinas {tot['m']} · RV parks {tot['r']} · campgrounds {tot['c']}")
