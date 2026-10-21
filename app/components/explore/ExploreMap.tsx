"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { STATES, KIND, type Row } from "./states";

// Oct 21 (per Mely): MelyOS Explore search — every marina, RV park and campground of
// a state as a pin on the map, with a list, filters and "Claim it free".
const esc = (s: string) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string));
const claimUrl = (r: Row) => `/demo?claim=${encodeURIComponent(r[1])}&type=${encodeURIComponent(KIND[r[0]].label)}`;

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
  const meta = STATES[state];

  useEffect(() => {
    let off = false;
    setRows(null);
    fetch(`/explore/${state}.json`).then((r) => (r.ok ? r.json() : { rows: [] })).then((j) => { if (!off) setRows(j.rows || []); }).catch(() => !off && setRows([]));
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
      Lmod.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        maxZoom: 19, subdomains: "abcd",
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>',
      }).addTo(map.current);
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
    const group = (Lm as any).markerClusterGroup({ showCoverageOnHover: false, maxClusterRadius: 45, chunkedLoading: true });
    markers.current = {};
    for (const r of shown) {
      const k = KIND[r[0]];
      const icon = Lm.divIcon({ className: "", html: `<span style="display:block;width:16px;height:16px;border-radius:50%;background:${k.color};border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.45)"></span>`, iconSize: [16, 16], iconAnchor: [8, 8] });
      const m = Lm.marker([r[2], r[3]], { icon, title: r[1] });
      m.bindPopup(`<div style="font-family:system-ui,sans-serif;min-width:210px">
        <div style="font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:${k.color}">${k.label}</div>
        <div style="font-size:15px;font-weight:800;color:#071A33;margin:2px 0 4px">${esc(r[1])}</div>
        ${r[4] ? `<div style="color:#475569">${esc(r[4])}, ${state}</div>` : ""}
        ${r[5] ? `<div><a href="tel:${esc(r[5].replace(/[^\d+]/g, ""))}">${esc(r[5])}</a></div>` : ""}
        ${r[6] ? `<div><a href="${esc(r[6])}" target="_blank" rel="noopener nofollow">Website ↗</a></div>` : ""}
        <a href="${claimUrl(r)}" style="display:inline-block;margin-top:8px;background:#071A33;color:#fff;padding:7px 10px;border-radius:8px;font-weight:700;text-decoration:none">Is this your property? Claim it free</a>
      </div>`);
      m.on("click", () => setPicked(r[7]));
      markers.current[r[7]] = m;
      group.addLayer(m);
    }
    group.addTo(map.current);
    layer.current = group;
  }, [shown, ready, state]);

  function focus(r: Row) {
    setPicked(r[7]);
    const m = markers.current[r[7]];
    if (!m || !layer.current) return;
    layer.current.zoomToShowLayer(m, () => m.openPopup());
  }

  const count = (k: string) => (rows || []).filter((r) => r[0] === k).length;

  return (
    <div className="grid gap-4 lg:grid-cols-[400px_1fr]">
      <div className="order-2 flex min-h-0 flex-col rounded-2xl border border-slate-200 bg-white lg:order-1 lg:h-[680px]">
        <div className="space-y-3 border-b border-slate-200 p-4">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search by name or city in ${meta[0]}`} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400" />
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
          {rows && !shown.length && <p className="p-5 text-sm text-slate-500">Nothing matches. Try another name or turn on more types.</p>}
          {shown.slice(0, 400).map((r) => (
            <button key={r[7]} type="button" onClick={() => focus(r)} className={`block w-full border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50 ${picked === r[7] ? "bg-cyan-50" : ""}`}>
              <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: KIND[r[0]].color }} /><span className="font-bold text-[#071A33]">{r[1]}</span></div>
              <div className="ml-[18px] text-sm text-slate-500">{KIND[r[0]].label}{r[4] ? ` · ${r[4]}` : ""}</div>
            </button>
          ))}
          {shown.length > 400 && <p className="p-4 text-center text-xs text-slate-500">Showing the first 400 in the list. Search or zoom the map to see the rest.</p>}
        </div>
      </div>
      <div className="order-1 overflow-hidden rounded-2xl border border-slate-200 lg:order-2">
        <div ref={mapEl} className="h-[460px] w-full lg:h-[680px]" />
      </div>
    </div>
  );
}
