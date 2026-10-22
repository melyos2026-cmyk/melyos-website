"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { STATES, KIND, type Row } from "./states";
import StatePicker from "./StatePicker";
import { FEATURED, isFeatured } from "./featured";

// Oct 21 (per Mely): MelyOS Explore search — every marina, RV park and campground of
// a state as a pin on the map, with a list, filters and "Claim it free".
const esc = (s: string) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string));
// Names typed all in lowercase on the public map ("west delancy") show as "West Delancy".
const nice = (n: string) => (n === n.toLowerCase() ? n.replace(/\b\w/g, (c) => c.toUpperCase()) : n);
const claimUrl = (r: Row) => `/demo?claim=${encodeURIComponent(nice(r[1]))}&type=${encodeURIComponent(KIND[r[0]].label)}`;

export default function ExploreMap({ state, initialKinds }: { state: string; initialKinds?: string[] }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [kinds, setKinds] = useState<string[]>(initialKinds || ["m", "r", "c"]);
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<string | null>(null);
  const mapEl = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const layer = useRef<any>(null);
  const markers = useRef<Record<string, any>>({});
  const L = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const fitted = useRef<string | null>(null);
  const featRef = useRef<any>(null);
  const meta = STATES[state];

  useEffect(() => {
    let off = false;
    setRows(null);
    fetch(`/explore/${state}.json`).then((r) => (r.ok ? r.json() : { rows: [] })).then((j) => {
      if (off) return;
      // MelyOS properties first; drop the public-map copy of the same place if there is one.
      const feat = FEATURED[state] || [];
      const names = new Set(feat.map((r) => r[1].toLowerCase()));
      setRows([...feat, ...((j.rows || []) as Row[]).filter((r) => !names.has(String(r[1]).toLowerCase()))]);
    }).catch(() => !off && setRows([...(FEATURED[state] || [])]));
    return () => { off = true; };
  }, [state]);

  useEffect(() => {
    let off = false;
    (async () => {
      const Lmod = (await import("leaflet")).default;
      (window as any).L = Lmod;
      await import("leaflet.markercluster");
      if (off || !mapEl.current || map.current) return;
      L.current = Lmod;
      map.current = Lmod.map(mapEl.current, { zoomControl: true, scrollWheelZoom: true }).setView([meta[1], meta[2]], meta[3]);
      // Oct 21 (per Mely): CARTO started asking for an API key, so the base map is now
      // OpenStreetMap's standard tiles (no key; attribution required).
      Lmod.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
      }).addTo(map.current);
      // Phones: the map box can get its final size after Leaflet starts; re-measure.
      setTimeout(() => map.current && map.current.invalidateSize(), 250);
      window.addEventListener("resize", () => map.current && map.current.invalidateSize());
      setReady(true);
    })();
    return () => { off = true; };
  }, [meta]);

  useEffect(() => { if (map.current) map.current.setView([meta[1], meta[2]], meta[3]); }, [meta]);

  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    return (rows || []).filter((r) => kinds.includes(r[0]) && (!t || r[1].toLowerCase().includes(t) || r[4].toLowerCase().includes(t)));
  }, [rows, kinds, q]);

  useEffect(() => {
    const Lm = L.current;
    if (!ready || !Lm || !map.current) return;
    if (layer.current) map.current.removeLayer(layer.current);
    if (featRef.current) map.current.removeLayer(featRef.current);
    const featLayer = Lm.layerGroup();
    const group = (Lm as any).markerClusterGroup({
      showCoverageOnHover: false, maxClusterRadius: 45, chunkedLoading: true,
      iconCreateFunction: (c: any) => {
        const n = c.getChildCount(); const d = n < 10 ? 34 : n < 100 ? 40 : 48;
        return Lm.divIcon({ className: "", iconSize: [d, d], html: `<div style="width:${d}px;height:${d}px;border-radius:50%;background:${kinds.length === 1 ? KIND[kinds[0]].color : "#071A33"};color:#fff;display:flex;align-items:center;justify-content:center;font:800 13px system-ui,sans-serif;border:3px solid ${kinds.length === 1 ? "#fff" : "#39d5ee"};box-shadow:0 2px 8px rgba(7,26,51,.35)">${n}</div>` });
      },
    });
    markers.current = {};
    for (const r of shown) {
      const k = KIND[r[0]];
      const feat = isFeatured(r);
      const icon = feat
        ? Lm.divIcon({ className: "", html: `<span style="display:flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:50%;background:#08B8D8;color:#fff;font:900 15px system-ui;border:3px solid #fff;box-shadow:0 2px 8px rgba(7,26,51,.5)">&#9733;</span>`, iconSize: [30, 30], iconAnchor: [15, 15] })
        : Lm.divIcon({ className: "", html: `<span style="display:block;width:16px;height:16px;border-radius:50%;background:${k.color};border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.45)"></span>`, iconSize: [16, 16], iconAnchor: [8, 8] });
      const m = Lm.marker([r[2], r[3]], { icon, title: nice(r[1]), zIndexOffset: feat ? 1000 : 0 });
      m.bindPopup(`<div style="font-family:system-ui,sans-serif;min-width:210px">
        <div style="font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:${k.color}">${k.label}</div>
        <div style="font-size:15px;font-weight:800;color:#071A33;margin:2px 0 4px">${esc(nice(r[1]))}</div>
        <div style="color:#475569">${r[4] ? `${esc(r[4])}, ` : ""}${esc(meta[0])}</div>
        ${r[5] ? `<div style="margin-top:4px">&#9742; <a href="tel:${esc(r[5].replace(/[^\d+]/g, ""))}">${esc(r[5])}</a></div>` : ""}
        ${r[6] ? `<div style="margin-top:2px">&#127760; <a href="${esc(r[6])}" target="_blank" rel="noopener nofollow">Website</a></div>` : ""}
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
          <a href="https://www.google.com/maps/dir/?api=1&destination=${r[2]},${r[3]}" target="_blank" rel="noopener" style="border:1px solid #cbd5e1;color:#071A33;padding:5px 9px;border-radius:8px;font-weight:700;text-decoration:none;font-size:12px">Directions</a>
          ${!feat && (!r[5] || !r[6]) ? `<a href="https://www.google.com/search?q=${encodeURIComponent(r[1] + " " + meta[0])}" target="_blank" rel="noopener nofollow" style="border:1px solid #cbd5e1;color:#071A33;padding:5px 9px;border-radius:8px;font-weight:700;text-decoration:none;font-size:12px">Phone &amp; hours</a>` : ""}
        </div>
        ${!feat && !r[5] && !r[6] ? `<div style="color:#64748b;font-size:12px;margin-top:8px">Contact details not listed yet. Owners can add them by claiming this page.</div>` : ""}
        ${feat
          ? `<a href="${esc(r[6])}" target="_blank" rel="noopener" style="display:inline-block;margin-top:8px;background:#08B8D8;color:#fff;padding:7px 12px;border-radius:8px;font-weight:800;text-decoration:none">Book online</a><div style="color:#079db9;font-size:11px;font-weight:700;margin-top:6px">&#9733; Runs on MelyOS</div>`
          : `<a href="${claimUrl(r)}" style="display:inline-block;margin-top:8px;background:#071A33;color:#fff;padding:7px 10px;border-radius:8px;font-weight:700;text-decoration:none">Is this your property? Claim it free</a>`}
      </div>`);
      m.on("click", () => setPicked(r[7]));
      markers.current[r[7]] = m;
      // MelyOS properties stay visible at every zoom (never folded into a number circle).
      if (feat) featLayer.addLayer(m); else group.addLayer(m);
    }
    group.addTo(map.current);
    layer.current = group;
    featLayer.addTo(map.current);
    featRef.current = featLayer;
    // Zoom so every place of the state fits on screen (once per state, on any screen size).
    if (fitted.current !== state && rows && rows.length) {
      fitted.current = state;
      map.current.invalidateSize();
      // Ignore the few places with odd coordinates (2% on each side) so one bad pin
      // doesn't zoom the whole state out.
      const qt = (a: number[], p: number) => { const v = [...a].sort((x, y) => x - y); return v[Math.min(v.length - 1, Math.max(0, Math.floor(p * (v.length - 1))))]; };
      const lats = rows.map((r: Row) => r[2]), lons = rows.map((r: Row) => r[3]);
      const tight = rows.length > 30;
      const b = Lm.latLngBounds([[tight ? qt(lats, 0.02) : Math.min(...lats), tight ? qt(lons, 0.02) : Math.min(...lons)], [tight ? qt(lats, 0.98) : Math.max(...lats), tight ? qt(lons, 0.98) : Math.max(...lons)]]);
      map.current.fitBounds(b, { padding: [24, 24], maxZoom: 9 });
    }
  }, [shown, ready, state, rows]);

  function focus(r: Row) {
    setPicked(r[7]);
    const m = markers.current[r[7]];
    if (!m || !layer.current) return;
    if (isFeatured(r)) { map.current.setView([r[2], r[3]], 15); m.openPopup(); return; }
    layer.current.zoomToShowLayer(m, () => m.openPopup());
  }

  const count = (k: string) => (rows || []).filter((r) => r[0] === k).length;

  // Oct 21 (per Mely): one tap to see only marinas, only RV parks or only campgrounds,
  // right above the map (on phones the type chips were below the map).
  const tabs: [string, string, string[]][] = [["all", "All", ["m", "r", "c"]], ["m", KIND.m.plural, ["m"]], ["r", KIND.r.plural, ["r"]], ["c", KIND.c.plural, ["c"]]];
  const activeTab = kinds.length === 3 ? "all" : kinds.length === 1 ? kinds[0] : "";

  return (
    <div className="grid gap-4">
    <div role="tablist" aria-label="Show" className="grid grid-cols-2 gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 sm:flex">
      {tabs.map(([id, label, ks]) => {
        const on = activeTab === id;
        const color = id === "all" ? "#071A33" : KIND[id].color;
        return (
          <button key={id} type="button" role="tab" aria-selected={on} onClick={() => setKinds(ks)}
            className={`flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-bold transition ${on ? "text-white shadow" : "text-slate-600 hover:bg-slate-50"}`}
            style={on ? { background: color } : undefined}>
            {id !== "all" && <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: on ? "#fff" : color }} />}
            {label}
            <span className={on ? "opacity-80" : "text-slate-400"}>{rows ? (id === "all" ? rows.length : count(id)).toLocaleString() : ""}</span>
          </button>
        );
      })}
    </div>
    <div className="grid gap-4 lg:grid-cols-[400px_1fr]">
      <div className="order-2 flex min-h-0 flex-col rounded-2xl border border-slate-200 bg-white lg:order-1 lg:h-[680px]">
        <div className="space-y-3 border-b border-slate-200 p-4">
          {/* Oct 21 (per Mely): the state is chosen from the dropdown, never typed. If someone
              types a state's name in the search box anyway, we open that state. */}
          <div className="[&>select]:w-full"><StatePicker current={state} /></div>
          <input value={q} onChange={(e) => {
              const v = e.target.value;
              const hit = Object.entries(STATES).find(([k, m]) => k !== state && m[0].toLowerCase() === v.trim().toLowerCase());
              if (hit) { window.location.href = `/explore/${hit[0].toLowerCase()}`; return; }
              setQ(v);
            }} placeholder="Search a name or city" aria-label={`Search places in ${meta[0]} by name or city`} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400" />
          <div className="flex flex-wrap gap-2">
            {Object.entries(KIND).map(([k, v]) => (
              <button key={k} type="button" onClick={() => setKinds(kinds.includes(k) ? kinds.filter((x) => x !== k) : [...kinds, k])}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-bold transition ${kinds.includes(k) ? "border-transparent text-white" : "border-slate-300 bg-white text-slate-500"}`}
                style={kinds.includes(k) ? { background: v.color } : undefined}>
                {v.plural} <span className="opacity-80">{rows ? count(k) : "…"}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500">{rows ? `${shown.length.toLocaleString()} shown` : "Loading…"}</p>
        </div>
        <div className="max-h-[420px] overflow-y-auto lg:max-h-none lg:flex-1">
          {rows && !shown.length && <p className="p-5 text-sm text-slate-500">Nothing matches in {meta[0]}. Try another name or city, or choose another state above.</p>}
          {shown.slice(0, 400).map((r) => (
            <button key={r[7]} type="button" onClick={() => focus(r)} className={`block w-full border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50 ${picked === r[7] ? "bg-cyan-50" : ""}`}>
              <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: KIND[r[0]].color }} /><span className="font-bold text-[#071A33]">{nice(r[1])}</span>{isFeatured(r) && <span className="rounded-full bg-cyan-50 px-2 py-0.5 text-[11px] font-bold text-[#079db9]">Book online</span>}</div>
              <div className="ml-[18px] text-sm text-slate-500">{KIND[r[0]].label}{r[4] ? ` · ${r[4]}` : ""}</div>
            </button>
          ))}
          {shown.length > 400 && <p className="p-4 text-center text-xs text-slate-500">Showing the first 400 in the list. Search or zoom the map to see the rest.</p>}
        </div>
      </div>
      <div className="order-1 overflow-hidden rounded-2xl border border-slate-200 lg:order-2">
        <div ref={mapEl} className="relative z-0 isolate h-[460px] w-full lg:h-[680px]" />
      </div>
    </div>
    </div>
  );
}
