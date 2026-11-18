"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { STATES, KIND, type Row } from "./states";
import StatePicker from "./StatePicker";
import { FEATURED, FEATURED_PHOTO, isFeatured } from "./featured";
import { listingPath } from "./slug";

// Oct 21 (per Mely): MelyOS Explore search — every marina, RV park and campground of
// a state as a pin on the map, with a list, filters and "Claim it free".
const esc = (s: string) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string));
// Names typed all in lowercase on the public map ("west delancy") show as "West Delancy".
const nice = (n: string) => (n === n.toLowerCase() ? n.replace(/\b\w/g, (c) => c.toUpperCase()) : n);
type Fuel = { gas: number | null; diesel: number | null; at: string; by: string };
const ago = (iso?: string | null) => {
  if (!iso) return "";
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 864e5);
  return d <= 0 ? "today" : d === 1 ? "yesterday" : d < 30 ? `${d} days ago` : `${Math.round(d / 30)} mo ago`;
};
const RED = "#e11d48";
const okUrl = (u: any) => typeof u === "string" && /^https:\/\//.test(u);
const claimUrl = (state: string, r: Row) => `/explore/claim?state=${state}&key=${encodeURIComponent(r[7])}`;

export default function ExploreMap({ state, initialKinds }: { state: string; initialKinds?: string[] }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [kinds, setKinds] = useState<string[]>(initialKinds || ["m", "r", "c"]);
  const [q, setQ] = useState("");
  // Nov 18: /explore/fl?type=r (from "Search RV parks") opens with that kind only
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("type");
    if (t && ["m", "r", "c"].includes(t)) setKinds([t]);
  }, []);
  const [picked, setPicked] = useState<string | null>(null);
  // Nov 18 (per Mely): Dockwa-style search — dates, filters, list of cards, "search as I move the map"
  const [arrive, setArrive] = useState("");
  const [depart, setDepart] = useState("");
  const [onlyBook, setOnlyBook] = useState(false);
  const [onlyFuel, setOnlyFuel] = useState(false);
  const [onlyRated, setOnlyRated] = useState(false);
  const [follow, setFollow] = useState(true);
  const [bounds, setBounds] = useState<[number, number, number, number] | null>(null);
  const mapEl = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const layer = useRef<any>(null);
  const markers = useRef<Record<string, any>>({});
  const L = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const fitted = useRef<string | null>(null);
  const featRef = useRef<any>(null);
  const meta = STATES[state];
  // Nov 17: owner info (approved claims) + star averages from MelyOS Explore
  const [extra, setExtra] = useState<{ overrides: Record<string, any>; stars: Record<string, [number, number]>; fuel: Record<string, Fuel> }>({ overrides: {}, stars: {}, fuel: {} });
  useEffect(() => { let off = false; fetch(`/api/explore/state?state=${state}`).then((r) => r.json()).then((j) => !off && setExtra({ overrides: j.overrides || {}, stars: j.stars || {}, fuel: j.fuel || {} })).catch(() => {}); return () => { off = true; }; }, [state]);

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
      const nb = () => { const b = map.current.getBounds(); setBounds([b.getSouth(), b.getWest(), b.getNorth(), b.getEast()]); };
      map.current.on("moveend", nb);
      window.addEventListener("resize", () => map.current && map.current.invalidateSize());
      setReady(true);
    })();
    return () => { off = true; };
  }, [meta]);

  useEffect(() => { if (map.current) map.current.setView([meta[1], meta[2]], meta[3]); }, [meta]);

  // A place is "bookable" (Online Booking + red pin) when it runs on MelyOS or has its own booking page.
  const bookable = (r: Row) => isFeatured(r) || !!extra.overrides[r[7]]?.client || okUrl(extra.overrides[r[7]]?.booking_url);
  const photoOf = (r: Row) => (isFeatured(r) ? FEATURED_PHOTO[r[7]] : "") || (okUrl(extra.overrides[r[7]]?.photo_url) ? extra.overrides[r[7]].photo_url : "");
  const dates = arrive || depart ? `?${new URLSearchParams({ ...(arrive ? { arrive } : {}), ...(depart ? { depart } : {}) })}` : "";

  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    return (rows || []).filter((r) => kinds.includes(r[0]) && (!t || r[1].toLowerCase().includes(t) || r[4].toLowerCase().includes(t))
      && (!onlyBook || bookable(r)) && (!onlyFuel || !!extra.fuel[r[7]]) && (!onlyRated || !!extra.stars[r[7]]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, kinds, q, onlyBook, onlyFuel, onlyRated, extra]);

  // The list: what's inside the map right now (when "Search as I move the map" is on), bookable places first.
  const listed = useMemo(() => {
    const inBox = follow && bounds ? shown.filter((r) => r[2] >= bounds[0] && r[2] <= bounds[2] && r[3] >= bounds[1] && r[3] <= bounds[3]) : shown;
    const score = (r: Row) => (bookable(r) ? 4 : 0) + (photoOf(r) ? 2 : 0) + (extra.stars[r[7]] ? 1 : 0) + (extra.fuel[r[7]] ? 1 : 0);
    return [...inBox].sort((a, b) => score(b) - score(a));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown, follow, bounds, extra]);

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
      const feat = isFeatured(r), book = bookable(r);
      // Red teardrop pin = Online Booking (like Dockwa). Small kind-colored dot = Inquiry only.
      const icon = book
        ? Lm.divIcon({ className: "", html: `<svg width="30" height="40" viewBox="0 0 30 40" style="filter:drop-shadow(0 2px 3px rgba(0,0,0,.4))"><path d="M15 1C7.3 1 1 7.2 1 14.9 1 25.4 15 39 15 39s14-13.6 14-24.1C29 7.2 22.7 1 15 1z" fill="${RED}" stroke="#fff" stroke-width="2"/><circle cx="15" cy="15" r="5.5" fill="#fff"/></svg>`, iconSize: [30, 40], iconAnchor: [15, 39], popupAnchor: [0, -34] })
        : Lm.divIcon({ className: "", html: `<span style="display:block;width:16px;height:16px;border-radius:50%;background:${k.color};border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.45)"></span>`, iconSize: [16, 16], iconAnchor: [8, 8] });
      const m = Lm.marker([r[2], r[3]], { icon, title: nice(r[1]), zIndexOffset: book ? 1000 : 0 });
      const photo = photoOf(r);
      const ov = extra.overrides[r[7]] || {};
      const phone = ov.phone || r[5], site = ov.website || r[6];
      const star = extra.stars[r[7]];
      const fu = extra.fuel[r[7]];
      const page = listingPath(state, r), unit = r[0] === "m" ? "slip" : "site";
      const bookUrl = feat ? site : okUrl(ov.booking_url) ? ov.booking_url : `${page}${dates}#request`;
      m.bindPopup(`<div style="font-family:system-ui,sans-serif;min-width:210px;max-width:250px">
        ${photo ? `<img src="${esc(photo)}" alt="${esc(nice(r[1]))}" style="display:block;width:100%;height:110px;object-fit:cover;border-radius:10px;margin-bottom:8px" />` : ""}
        <div style="font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:${k.color}">${k.label}${ov.verified || ov.client ? ` <span style="color:#059669">&#10003; verified</span>` : ""}</div>
        <a href="${page}${dates}" style="display:block;font-size:15px;font-weight:800;color:#071A33;margin:2px 0 4px;text-decoration:none">${esc(nice(r[1]))}</a>
        ${star ? `<div style="color:#f59e0b;font-weight:800">&#9733; ${star[0].toFixed(1)} <span style="color:#64748b;font-weight:600">(${star[1]} review${star[1] === 1 ? "" : "s"})</span></div>` : ""}
        <div style="color:#475569">${r[4] ? `${esc(r[4])}, ` : ""}${esc(meta[0])}</div>
        ${fu ? `<div style="margin-top:4px;font-weight:700">&#9981; ${fu.gas ? `Gas $${fu.gas.toFixed(2)}` : ""}${fu.gas && fu.diesel ? " · " : ""}${fu.diesel ? `Diesel $${fu.diesel.toFixed(2)}` : ""} <span style="color:#64748b;font-weight:500">· ${ago(fu.at)}</span></div>` : ""}
        ${phone ? `<div style="margin-top:4px">&#9742; <a href="tel:${esc(phone.replace(/[^\d+]/g, ""))}">${esc(phone)}</a></div>` : ""}
        ${site ? `<div style="margin-top:2px">&#127760; <a href="${esc(site)}" target="_blank" rel="noopener nofollow">Website</a></div>` : ""}
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
          ${book ? `<a href="${esc(bookUrl)}" ${feat || okUrl(ov.booking_url) ? 'target="_blank" rel="noopener"' : ""} style="background:${RED};color:#fff;padding:6px 10px;border-radius:8px;font-weight:800;text-decoration:none;font-size:12px">Book online</a>`
            : `<a href="${page}${dates}#request" style="background:#08B8D8;color:#fff;padding:6px 10px;border-radius:8px;font-weight:800;text-decoration:none;font-size:12px">Request a ${unit}</a>`}
          <a href="${page}${dates}" style="border:1px solid #cbd5e1;color:#071A33;padding:5px 9px;border-radius:8px;font-weight:700;text-decoration:none;font-size:12px">Details &amp; reviews</a>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${r[2]},${r[3]}" target="_blank" rel="noopener" style="border:1px solid #cbd5e1;color:#071A33;padding:5px 9px;border-radius:8px;font-weight:700;text-decoration:none;font-size:12px">Directions</a>
        </div>
        ${feat ? `<div style="color:#079db9;font-size:11px;font-weight:700;margin-top:6px">&#9733; Runs on MelyOS</div>`
          : ov.verified ? "" : `<a href="${claimUrl(state, r)}" style="display:inline-block;margin-top:8px;color:#071A33;font-size:12px;font-weight:700">Is this your property? Claim it free</a>`}
      </div>`);
      m.on("click", () => setPicked(r[7]));
      markers.current[r[7]] = m;
      // Bookable places stay visible at every zoom (never folded into a number circle).
      if (book) featLayer.addLayer(m); else group.addLayer(m);
    }
    group.addTo(map.current);
    layer.current = group;
    featLayer.addTo(map.current);
    featRef.current = featLayer;
    if (fitted.current !== state && rows && rows.length) {
      fitted.current = state;
      map.current.invalidateSize();
      const qt = (a: number[], p: number) => { const v = [...a].sort((x, y) => x - y); return v[Math.min(v.length - 1, Math.max(0, Math.floor(p * (v.length - 1))))]; };
      const lats = rows.map((r: Row) => r[2]), lons = rows.map((r: Row) => r[3]);
      const tight = rows.length > 30;
      const b = Lm.latLngBounds([[tight ? qt(lats, 0.02) : Math.min(...lats), tight ? qt(lons, 0.02) : Math.min(...lons)], [tight ? qt(lats, 0.98) : Math.max(...lats), tight ? qt(lons, 0.98) : Math.max(...lons)]]);
      map.current.fitBounds(b, { padding: [24, 24], maxZoom: 9 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown, ready, state, rows, extra, dates]);

  function focus(r: Row) {
    setPicked(r[7]);
    const m = markers.current[r[7]];
    if (!m || !layer.current) return;
    if (bookable(r)) { map.current.setView([r[2], r[3]], Math.max(map.current.getZoom(), 13)); m.openPopup(); return; }
    layer.current.zoomToShowLayer(m, () => m.openPopup());
  }

  const count = (k: string) => (rows || []).filter((r) => r[0] === k).length;
  const tabs: [string, string, string[]][] = [["all", "All", ["m", "r", "c"]], ["m", KIND.m.plural, ["m"]], ["r", KIND.r.plural, ["r"]], ["c", KIND.c.plural, ["c"]]];
  const activeTab = kinds.length === 3 ? "all" : kinds.length === 1 ? kinds[0] : "";
  const today = new Date().toISOString().slice(0, 10);
  const chip = (on: boolean) => `rounded-full border px-3 py-1.5 text-sm font-bold transition ${on ? "border-[#071A33] bg-[#071A33] text-white" : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"}`;

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
    <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-3 md:grid-cols-[1fr_1fr_160px_160px]">
      <div className="[&>select]:w-full [&>select]:h-full"><StatePicker current={state} /></div>
      <input value={q} onChange={(e) => {
          const v = e.target.value;
          const hit = Object.entries(STATES).find(([k, m]) => k !== state && m[0].toLowerCase() === v.trim().toLowerCase());
          if (hit) { window.location.href = `/explore/${hit[0].toLowerCase()}`; return; }
          setQ(v);
        }} placeholder="Search a name or city" aria-label={`Search places in ${meta[0]} by name or city`} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400" />
      <label className="relative block"><span className="absolute left-3 top-1 text-[10px] font-black uppercase tracking-wider text-slate-500">Arrive</span>
        <input type="date" min={today} value={arrive} onChange={(e) => { setArrive(e.target.value); if (depart && e.target.value > depart) setDepart(""); }} className="w-full rounded-xl border border-slate-200 px-3 pb-2 pt-5 text-sm outline-none focus:border-cyan-400" /></label>
      <label className="relative block"><span className="absolute left-3 top-1 text-[10px] font-black uppercase tracking-wider text-slate-500">Depart</span>
        <input type="date" min={arrive || today} value={depart} onChange={(e) => setDepart(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 pb-2 pt-5 text-sm outline-none focus:border-cyan-400" /></label>
    </div>
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" onClick={() => setOnlyBook(!onlyBook)} className={chip(onlyBook)}><span className="mr-1 inline-block h-2.5 w-2.5 rounded-full" style={{ background: RED }} />Online booking</button>
      {kinds.includes("m") && <button type="button" onClick={() => setOnlyFuel(!onlyFuel)} className={chip(onlyFuel)}>⛽ Fuel prices</button>}
      <button type="button" onClick={() => setOnlyRated(!onlyRated)} className={chip(onlyRated)}>★ Has reviews</button>
      <span className="ml-auto flex items-center gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1"><svg width="11" height="15" viewBox="0 0 30 40"><path d="M15 1C7.3 1 1 7.2 1 14.9 1 25.4 15 39 15 39s14-13.6 14-24.1C29 7.2 22.7 1 15 1z" fill={RED} /></svg> Book online</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-slate-400" /> Inquiry only</span>
      </span>
    </div>
    <div className="grid gap-4 lg:grid-cols-[440px_1fr]">
      <div className="order-2 flex min-h-0 flex-col rounded-2xl border border-slate-200 bg-white lg:order-1 lg:h-[720px]">
        <div className="flex items-center justify-between gap-2 border-b border-slate-200 px-4 py-3">
          <p className="text-sm font-bold text-[#071A33]">{rows ? `${listed.length.toLocaleString()} ${follow && bounds ? "in this area" : "places"}` : "Loading…"}</p>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600"><input type="checkbox" checked={follow} onChange={(e) => setFollow(e.target.checked)} className="h-4 w-4 accent-[#08B8D8]" />Search as I move the map</label>
        </div>
        <div className="max-h-[520px] overflow-y-auto lg:max-h-none lg:flex-1">
          {rows && !listed.length && <p className="p-5 text-sm text-slate-500">Nothing here. Zoom out or move the map, clear a filter, or choose another state above.</p>}
          {listed.slice(0, 150).map((r) => {
            const book = bookable(r), photo = photoOf(r), star = extra.stars[r[7]], fu = extra.fuel[r[7]], k = KIND[r[0]];
            return (
              <div key={r[7]} onClick={() => focus(r)} className={`flex cursor-pointer gap-3 border-b border-slate-100 p-3 transition hover:bg-slate-50 ${picked === r[7] ? "bg-cyan-50" : ""}`}>
                <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-xl" style={{ background: `linear-gradient(135deg, ${k.color}, #071A33)` }}>
                  {photo ? <img src={photo} alt="" loading="lazy" className="h-full w-full object-cover" />
                    : <span className="flex h-full w-full items-center justify-center text-3xl text-white/80">{r[0] === "m" ? "⚓" : r[0] === "r" ? "🚐" : "⛺"}</span>}
                </div>
                <div className="min-w-0 flex-1">
                  <a href={`${listingPath(state, r)}${dates}`} onClick={(e) => e.stopPropagation()} className="line-clamp-2 font-black leading-snug text-[#071A33] hover:underline">{nice(r[1])}</a>
                  <p className="truncate text-sm text-slate-500">{k.label}{r[4] ? ` · ${r[4]}` : ""}</p>
                  {star && <p className="text-sm"><span className="text-amber-500">★</span> <b>{star[0].toFixed(1)}</b> <span className="text-slate-500">({star[1]})</span></p>}
                  {fu && <p className="text-[13px] font-semibold text-slate-700">⛽ {fu.gas ? `Gas $${fu.gas.toFixed(2)}` : ""}{fu.gas && fu.diesel ? " · " : ""}{fu.diesel ? `Diesel $${fu.diesel.toFixed(2)}` : ""} <span className="font-normal text-slate-500">· {ago(fu.at)}</span></p>}
                  <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-black ${book ? "bg-rose-50 text-rose-700" : "bg-slate-100 text-slate-600"}`}>{book ? "Online Booking" : "Inquiry Only"}</span>
                </div>
              </div>
            );
          })}
          {listed.length > 150 && <p className="p-4 text-center text-xs text-slate-500">Showing 150 of {listed.length.toLocaleString()}. Zoom in on the map or search to narrow it down.</p>}
        </div>
      </div>
      <div className="order-1 overflow-hidden rounded-2xl border border-slate-200 lg:order-2">
        <div ref={mapEl} className="relative z-0 isolate h-[460px] w-full lg:h-[720px]" />
      </div>
    </div>
    </div>
  );
}
