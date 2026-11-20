"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { STATES, KIND, type Row } from "./states";
import StatePicker from "./StatePicker";
import { useBoater } from "./useBoater";
import { FEATURED, FEATURED_PHOTO, FEATURED_INFO, isFeatured } from "./featured";
import { AMENITIES, STAY_FILTERS, AmenIcon, hasAmen } from "./amenities";
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
// Nov 18 (per Mely): no photo yet → a real aerial view of the place (satellite tile around its pin)
const aerial = (lat: number, lon: number, z = 17) => {
  const n = 2 ** z, x = Math.floor(((lon + 180) / 360) * n);
  const y = Math.floor(((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) * n);
  return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`;
};
const okUrl = (u: any) => typeof u === "string" && /^https:\/\//.test(u);
const claimUrl = (state: string, r: Row) => `/explore/claim?state=${state}&key=${encodeURIComponent(r[7])}`;

export default function ExploreMap({ state, initialKinds, heading }: { state: string; initialKinds?: string[]; heading?: React.ReactNode }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [kinds, setKinds] = useState<string[]>(initialKinds || ["m", "r", "c"]);
  const [q, setQ] = useState("");
  // Nov 18: /explore/fl?type=r (from "Search RV parks") opens with that kind only
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("type");
    // Nov 20 (per Mely): the map always opens on "All"; ?type= is ignored.
    void t;
    // Nov 20 (per Mely): sales demo — ?demo=<listing id> shows a prospect as if it were a MelyOS partner
    // (only in that view; not linked anywhere). e.g. /explore/fl?demo=x-21-palms
    const dm = new URLSearchParams(window.location.search).get("demo");
    if (dm && /^[\w-]{3,40}$/.test(dm)) setDemo(dm);
  }, []);
  const [picked, setPicked] = useState<string | null>(null);
  const [demo, setDemo] = useState<string | null>(null);
  // Nov 18 (per Mely): Dockwa-style search — dates, filters, list of cards, "search as I move the map"
  const [arrive, setArrive] = useState("");
  const [depart, setDepart] = useState("");
  const [onlyBook, setOnlyBook] = useState(false);
  const [onlyFuel, setOnlyFuel] = useState(false);
  const [onlyRated, setOnlyRated] = useState(false);
  const [follow, setFollow] = useState(true);
  // Nov 20 (per Mely): our own amenity/stay filters + street/satellite map, MelyOS partners spotlighted first
  const [amen, setAmen] = useState<string[]>([]);
  const [stayF, setStayF] = useState<string[]>([]);
  const [moreF, setMoreF] = useState(false);
  const [sat, setSat] = useState(false);
  // Nov 20 (per Mely): guests see every pin and our partners in full; the full list and the phone/website
  // of the other places need a free traveler account (that is how travelers sign up with MelyOS).
  const { me } = useBoater();
  const guest = !!me && !me.boater;
  const FREE_ROWS = 5;
  // Nov 20 (per Mely): free arrival docks / boat ramps / piers / anchorages — signed-in boaters only.
  type Dock = [string, string, number, number, string, string];
  const [docks, setDocks] = useState<Dock[]>([]);
  const [showDocks, setShowDocks] = useState(true);
  const dockLayer = useRef<any>(null);
  const DOCK: Record<string, [string, string]> = { r: ["Boat ramp", "#0e7490"], d: ["Dock", "#0369a1"], p: ["Pier", "#475569"], a: ["Anchorage", "#1e3a8a"] };
  useEffect(() => {
    if (!me?.boater) { setDocks([]); return; }
    let off = false;
    Promise.all(sts.map((st) => fetch(`/api/explore/docks?state=${st}`).then((r) => (r.ok ? r.json() : { rows: [] })).catch(() => ({ rows: [] }))))
      .then((all) => !off && setDocks(all.flatMap((j: any) => j.rows || [])));
    return () => { off = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, me]);
  const signUp = () => `/explore/account?next=${encodeURIComponent(typeof window !== "undefined" ? location.pathname + location.search : "/explore")}`;
  const tiles = useRef<{ street?: any; sat?: any; lab?: any }>({});
  const [bounds, setBounds] = useState<[number, number, number, number] | null>(null);
  const mapEl = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const layer = useRef<any>(null);
  const markers = useRef<Record<string, any>>({});
  const L = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const fitted = useRef<string | null>(null);
  const featRef = useRef<any>(null);
  // Nov 18 (per Mely): state "US" = the whole United States on one map, every state's pins.
  const isUS = state === "US";
  const meta: [string, number, number, number] = isUS ? ["the U.S.", 39.5, -98.35, 4] : STATES[state];
  const stateOf = useRef<Record<string, string>>({});
  const stOf = (r: Row) => (isUS ? stateOf.current[r[7]] || "FL" : state);
  // Nov 17: owner info (approved claims) + star averages from MelyOS Explore
  const [extra, setExtra] = useState<{ overrides: Record<string, any>; stars: Record<string, [number, number]>; fuel: Record<string, Fuel> }>({ overrides: {}, stars: {}, fuel: {} });
  // Nov 18 (per Mely): each place's own preview picture from its website (scripts/photos → photos_{ST}.json)
  const [photos, setPhotos] = useState<Record<string, string>>({});
  const [broken, setBroken] = useState<Record<string, true>>({});
  const sts = isUS ? Object.keys(STATES) : [state];
  useEffect(() => {
    let off = false; setPhotos({});
    Promise.all(sts.map((st) => fetch(`/explore/photos_${st}.json`).then((r) => (r.ok ? r.json() : {})).catch(() => ({}))))
      .then((all) => !off && setPhotos(Object.assign({}, ...all)));
    return () => { off = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
  useEffect(() => {
    let off = false;
    Promise.all(sts.map((st) => fetch(`/api/explore/state?state=${st}`).then((r) => r.json()).catch(() => ({}))))
      .then((all) => !off && setExtra({ overrides: Object.assign({}, ...all.map((j: any) => j.overrides || {})), stars: Object.assign({}, ...all.map((j: any) => j.stars || {})), fuel: Object.assign({}, ...all.map((j: any) => j.fuel || {})) }));
    return () => { off = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    let off = false;
    setRows(null);
    Promise.all(sts.map((st) => fetch(`/explore/${st}.json`).then((r) => (r.ok ? r.json() : { rows: [] })).catch(() => ({ rows: [] })).then((j) => {
      // MelyOS properties first; drop the public-map copy of the same place if there is one.
      const feat = FEATURED[st] || [];
      const names = new Set(feat.map((r) => r[1].toLowerCase()));
      const list = [...feat, ...((j.rows || []) as Row[]).filter((r) => !names.has(String(r[1]).toLowerCase()))];
      for (const r of list) stateOf.current[r[7]] = st;
      return list;
    }))).then((all) => { if (!off) setRows(all.flat().sort((a, b) => (isFeatured(b) ? 1 : 0) - (isFeatured(a) ? 1 : 0))); });
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
      tiles.current.street = Lmod.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
      }).addTo(map.current);
      tiles.current.sat = Lmod.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", { maxZoom: 19, attribution: "Imagery &copy; Esri, Maxar, Earthstar Geographics" });
      tiles.current.lab = Lmod.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}", { maxZoom: 19 });
      // Phones: the map box can get its final size after Leaflet starts; re-measure.
      setTimeout(() => map.current && map.current.invalidateSize(), 250);
      const nb = () => { const b = map.current.getBounds(); setBounds([b.getSouth(), b.getWest(), b.getNorth(), b.getEast()]); };
      map.current.on("moveend", nb);
      window.addEventListener("resize", () => map.current && map.current.invalidateSize());
      setReady(true);
    })();
    return () => { off = true; };
  }, [meta]);

  useEffect(() => {
    const m = map.current, t = tiles.current;
    if (!ready || !m || !t.street) return;
    if (sat) { m.removeLayer(t.street); t.sat.addTo(m); t.lab.addTo(m); } else { m.removeLayer(t.sat); m.removeLayer(t.lab); t.street.addTo(m); }
  }, [sat, ready]);

  useEffect(() => { if (map.current) map.current.setView([meta[1], meta[2]], meta[3]);   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // A place is "bookable" (Online Booking + red pin) when it runs on MelyOS or has its own booking page.
  // A MelyOS partner = a property that runs on MelyOS (signed with us). Spotlighted first everywhere.
  const partner = (r: Row) => isFeatured(r) || !!extra.overrides[r[7]]?.client || r[7] === demo;
  const amenText = (r: Row) => `${FEATURED_INFO[r[7]]?.amenities || ""} ${extra.overrides[r[7]]?.amenities || ""}`;
  const staysOf = (r: Row): string[] => FEATURED_INFO[r[7]]?.stays || (Array.isArray(extra.overrides[r[7]]?.stay_types) ? extra.overrides[r[7]].stay_types : []);
  const bookable = (r: Row) => partner(r) || !!extra.overrides[r[7]]?.client || okUrl(extra.overrides[r[7]]?.booking_url);
  const photoOf = (r: Row) => (isFeatured(r) ? FEATURED_PHOTO[r[7]] : "") || (okUrl(extra.overrides[r[7]]?.photo_url) ? extra.overrides[r[7]].photo_url : "") || (!broken[r[7]] && okUrl(photos[r[7]]) ? photos[r[7]] : "");
  const dates = arrive || depart ? `?${new URLSearchParams({ ...(arrive ? { arrive } : {}), ...(depart ? { depart } : {}) })}` : "";
  const dq = (r: Row) => (r[7] === demo ? `${dates ? `${dates}&` : "?"}demo=${encodeURIComponent(demo)}` : dates);

  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    return (rows || []).filter((r) => kinds.includes(r[0]) && (!t || r[1].toLowerCase().includes(t) || r[4].toLowerCase().includes(t))
      && (!onlyBook || bookable(r)) && (!onlyFuel || !!extra.fuel[r[7]]) && (!onlyRated || !!extra.stars[r[7]])
      && amen.every((id) => { const a = AMENITIES.find((x) => x.id === id); return !a || hasAmen(amenText(r), a); })
      && (!stayF.length || staysOf(r).some((x) => stayF.includes(x))));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, kinds, q, onlyBook, onlyFuel, onlyRated, extra, amen, stayF]);

  // The list: what's inside the map right now (when "Search as I move the map" is on), bookable places first.
  const listed = useMemo(() => {
    const inBox = (follow && bounds ? shown.filter((r) => r[2] >= bounds[0] && r[2] <= bounds[2] && r[3] >= bounds[1] && r[3] <= bounds[3]) : shown).filter((r) => !partner(r));
    const score = (r: Row) => (bookable(r) ? 4 : 0) + (photoOf(r) ? 2 : 0) + (extra.stars[r[7]] ? 1 : 0) + (extra.fuel[r[7]] ? 1 : 0);
    return [...inBox].sort((a, b) => score(b) - score(a));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown, follow, bounds, extra, demo]);
  // Partners are always on top of the list — the closest to the map first — even when a bit outside the map area.
  const partners = useMemo(() => {
    const c = bounds ? [(bounds[0] + bounds[2]) / 2, (bounds[1] + bounds[3]) / 2] : [meta[1], meta[2]];
    const d = (r: Row) => (r[2] - c[0]) ** 2 + (r[3] - c[1]) ** 2;
    return shown.filter(partner).sort((a, b) => d(a) - d(b)).slice(0, 6);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown, bounds, extra, demo]);

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
      const feat = isFeatured(r), book = bookable(r), pt = partner(r);
      // Red teardrop pin = Online Booking (like Dockwa). Small kind-colored dot = Inquiry only.
      const icon = pt
        ? Lm.divIcon({ className: "", html: `<svg width="30" height="40" viewBox="0 0 30 40" style="filter:drop-shadow(0 2px 3px rgba(7,26,51,.35))"><path d="M15 1C7.3 1 1 7.2 1 14.9 1 25.4 15 39 15 39s14-13.6 14-24.1C29 7.2 22.7 1 15 1z" fill="${RED}" stroke="#fff" stroke-width="2"/><circle cx="15" cy="14.6" r="7.6" fill="#fff"/><path d="m15 9.4 1.6 3.3 3.6.5-2.6 2.5.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.5 3.6-.5z" fill="#d4a94a"/></svg>`, iconSize: [30, 40], iconAnchor: [15, 39], popupAnchor: [0, -34] })
        : book
        ? Lm.divIcon({ className: "", html: `<svg width="30" height="40" viewBox="0 0 30 40" style="filter:drop-shadow(0 2px 3px rgba(0,0,0,.4))"><path d="M15 1C7.3 1 1 7.2 1 14.9 1 25.4 15 39 15 39s14-13.6 14-24.1C29 7.2 22.7 1 15 1z" fill="${RED}" stroke="#fff" stroke-width="2"/><circle cx="15" cy="15" r="5.5" fill="#fff"/></svg>`, iconSize: [30, 40], iconAnchor: [15, 39], popupAnchor: [0, -34] })
        : Lm.divIcon({ className: "", html: `<span style="display:block;width:16px;height:16px;border-radius:50%;background:${k.color};border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.45)"></span>`, iconSize: [16, 16], iconAnchor: [8, 8] });
      const m = Lm.marker([r[2], r[3]], { icon, title: nice(r[1]), zIndexOffset: pt ? 3000 : book ? 1000 : 0 });
      if (pt) m.bindTooltip(`<span style="color:#fbbf24">&#9733;</span> ${esc(nice(r[1]))}`, { permanent: true, direction: "top", offset: [0, -38], className: "mx-tip" });
      const photo = photoOf(r);
      const ov = extra.overrides[r[7]] || {};
      const phone = ov.phone || r[5], site = ov.website || r[6];
      const star = extra.stars[r[7]];
      const fu = extra.fuel[r[7]];
      const page = listingPath(stOf(r), r), unit = r[0] === "m" ? "slip" : "site";
      const bookUrl = feat ? site : okUrl(ov.booking_url) ? ov.booking_url : `${page}${dq(r)}#request`;
      m.bindPopup(`<div style="font-family:system-ui,sans-serif;min-width:210px;max-width:250px">
        ${photo ? `<img src="${esc(photo)}" alt="${esc(nice(r[1]))}" style="display:block;width:100%;height:110px;object-fit:cover;border-radius:10px;margin-bottom:8px" />` : ""}
        ${pt ? `<div style="font-size:10.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#a07a1f;margin-bottom:3px">&#9733; MelyOS Partner</div>` : ""}
        <div style="font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:${k.color}">${k.label}${ov.verified || ov.client ? ` <span style="color:#059669">&#10003; verified</span>` : ""}</div>
        <a href="${page}${dq(r)}" style="display:block;font-size:15px;font-weight:800;color:#071A33;margin:2px 0 4px;text-decoration:none">${esc(nice(r[1]))}</a>
        ${star ? `<div style="color:#f59e0b;font-weight:800">&#9733; ${star[0].toFixed(1)} <span style="color:#64748b;font-weight:600">(${star[1]} review${star[1] === 1 ? "" : "s"})</span></div>` : ""}
        <div style="color:#475569">${r[4] ? `${esc(r[4])}, ` : ""}${esc(meta[0])}</div>
        ${fu ? `<div style="margin-top:4px;font-weight:700">&#9981; ${fu.gas ? `Gas $${fu.gas.toFixed(2)}` : ""}${fu.gas && fu.diesel ? " · " : ""}${fu.diesel ? `Diesel $${fu.diesel.toFixed(2)}` : ""} <span style="color:#64748b;font-weight:500">· ${ago(fu.at)}</span></div>` : ""}
        ${guest && !pt ? `<a href="${signUp()}" style="display:block;margin-top:6px;background:#f1f5f9;border-radius:8px;padding:6px 8px;color:#071A33;font-size:12px;font-weight:700;text-decoration:none">&#128274; Phone &amp; website: <span style="color:#0891b2">create a free account</span></a>` : `${phone ? `<div style="margin-top:4px">&#9742; <a href="tel:${esc(phone.replace(/[^\d+]/g, ""))}">${esc(phone)}</a></div>` : ""}
        ${site ? `<div style="margin-top:2px">&#127760; <a href="${esc(site)}" target="_blank" rel="noopener nofollow">Website</a></div>` : ""}`}
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
          ${book ? `<a href="${esc(bookUrl)}" ${feat || okUrl(ov.booking_url) ? 'target="_blank" rel="noopener"' : ""} style="background:${RED};color:#fff;padding:6px 10px;border-radius:8px;font-weight:800;text-decoration:none;font-size:12px">Book online</a>`
            : `<a href="${page}${dq(r)}#request" style="background:#08B8D8;color:#fff;padding:6px 10px;border-radius:8px;font-weight:800;text-decoration:none;font-size:12px">Request a ${unit}</a>`}
          <a href="${page}${dq(r)}" style="border:1px solid #cbd5e1;color:#071A33;padding:5px 9px;border-radius:8px;font-weight:700;text-decoration:none;font-size:12px">Details &amp; reviews</a>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${r[2]},${r[3]}" target="_blank" rel="noopener" style="border:1px solid #cbd5e1;color:#071A33;padding:5px 9px;border-radius:8px;font-weight:700;text-decoration:none;font-size:12px">Directions</a>
        </div>
        ${feat ? `<div style="color:#079db9;font-size:11px;font-weight:700;margin-top:6px">&#9733; Runs on MelyOS</div>`
          : ov.verified ? "" : `<a href="${claimUrl(stOf(r), r)}" style="display:inline-block;margin-top:8px;color:#071A33;font-size:12px;font-weight:700">Is this your property? Claim it free</a>`}
      </div>`);
      m.on("click", () => setPicked(r[7]));
      markers.current[r[7]] = m;
      // Bookable places stay visible at every zoom (never folded into a number circle).
      if (book || pt) featLayer.addLayer(m); else group.addLayer(m);
    }
    group.addTo(map.current);
    layer.current = group;
    featLayer.addTo(map.current);
    featRef.current = featLayer;
    if (fitted.current !== state && rows && rows.length) {
      fitted.current = state;
      map.current.invalidateSize();
      if (isUS) { map.current.fitBounds([[24.5, -124.8], [49.4, -66.9]], { padding: [10, 10] }); return; }
      const qt = (a: number[], p: number) => { const v = [...a].sort((x, y) => x - y); return v[Math.min(v.length - 1, Math.max(0, Math.floor(p * (v.length - 1))))]; };
      const lats = rows.map((r: Row) => r[2]), lons = rows.map((r: Row) => r[3]);
      const tight = rows.length > 30;
      const b = Lm.latLngBounds([[tight ? qt(lats, 0.02) : Math.min(...lats), tight ? qt(lons, 0.02) : Math.min(...lons)], [tight ? qt(lats, 0.98) : Math.max(...lats), tight ? qt(lons, 0.98) : Math.max(...lons)]]);
      map.current.fitBounds(b, { padding: [24, 24], maxZoom: 9 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown, ready, state, rows, extra, dates, guest, demo]);

  useEffect(() => {
    const Lm = L.current, m = map.current;
    if (!ready || !Lm || !m) return;
    if (dockLayer.current) { m.removeLayer(dockLayer.current); dockLayer.current = null; }
    if (!showDocks || !docks.length || !kinds.includes("m")) return;
    const g = (Lm as any).markerClusterGroup({ showCoverageOnHover: false, maxClusterRadius: 50, chunkedLoading: true, disableClusteringAtZoom: 14,
      iconCreateFunction: (c: any) => Lm.divIcon({ className: "", iconSize: [30, 30], html: `<div style="width:30px;height:30px;border-radius:9px;background:#e0f2fe;color:#0369a1;border:2px solid #0369a1;display:flex;align-items:center;justify-content:center;font:800 11px system-ui,sans-serif;box-shadow:0 1px 4px rgba(0,0,0,.25)">&#9875;${c.getChildCount()}</div>` }) });
    for (const d of docks) {
      const [lab, col] = DOCK[d[0]] || DOCK.d;
      const mk = Lm.marker([d[2], d[3]], { icon: Lm.divIcon({ className: "", iconSize: [20, 20], iconAnchor: [10, 10], html: `<span style="display:flex;width:20px;height:20px;border-radius:6px;background:#fff;border:2px solid ${col};color:${col};align-items:center;justify-content:center;font-size:12px;box-shadow:0 1px 3px rgba(0,0,0,.3)">${d[0] === "r" ? "&#8689;" : "&#9875;"}</span>` }), title: d[1] || lab });
      mk.bindPopup(`<div style="font-family:system-ui,sans-serif;min-width:180px"><div style="font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:${col}">&#9875; ${lab}${d[4] === "free" ? ' <span style="color:#059669">&middot; Free</span>' : d[4] === "paid" ? ' <span style="color:#b45309">&middot; Fee</span>' : ""}</div>
        <div style="font-size:14px;font-weight:800;color:#071A33;margin:2px 0 6px">${esc(d[1] || `${lab} (no name)`)}</div>
        <a href="https://www.google.com/maps/dir/?api=1&destination=${d[2]},${d[3]}" target="_blank" rel="noopener" style="display:inline-block;background:#0369a1;color:#fff;padding:5px 9px;border-radius:8px;font-weight:800;text-decoration:none;font-size:12px">Directions</a>
        <div style="color:#64748b;font-size:11px;margin-top:6px">Public info from OpenStreetMap. Check local rules and hours before you tie up.</div></div>`);
      g.addLayer(mk);
    }
    g.addTo(m); dockLayer.current = g;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docks, showDocks, ready, kinds]);

  const demoDone = useRef(false);
  useEffect(() => {
    if (!demo || demoDone.current || !ready || !rows) return;
    const r = rows.find((x) => x[7] === demo); if (!r || !markers.current[r[7]]) return;
    demoDone.current = true;
    setTimeout(() => { map.current.setView([r[2], r[3]], 10); }, 400);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demo, ready, rows, shown]);

  function focus(r: Row) {
    setPicked(r[7]);
    const m = markers.current[r[7]];
    if (!m || !layer.current) return;
    if (bookable(r) || partner(r)) { map.current.setView([r[2], r[3]], Math.max(map.current.getZoom(), 13)); m.openPopup(); return; }
    layer.current.zoomToShowLayer(m, () => m.openPopup());
  }

  const count = (k: string) => (rows || []).filter((r) => r[0] === k).length;
  const tabs: [string, string, string[]][] = [["all", "All", ["m", "r", "c"]], ["m", KIND.m.plural, ["m"]], ["r", KIND.r.plural, ["r"]], ["c", KIND.c.plural, ["c"]]];
  const activeTab = kinds.length === 3 ? "all" : kinds.length === 1 ? kinds[0] : "";
  const today = new Date().toISOString().slice(0, 10);
  const chip = (on: boolean) => `rounded-full border px-3 py-1.5 text-sm font-bold transition ${on ? "border-[#071A33] bg-[#071A33] text-white" : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"}`;

  // Nov 18 (per Mely): Dockwa-style — the map fills the whole screen to the right, filters and list on the left
  return (
    <div className="flex flex-col lg:h-[calc(100vh-6rem)] lg:flex-row">
      <div className="relative order-1 h-[55vh] min-h-[320px] border-b border-slate-200 lg:order-2 lg:h-auto lg:flex-1 lg:border-b-0 lg:border-l">
        <div ref={mapEl} className="absolute inset-0 z-0 isolate" />
        <style>{`.mx-partner{position:relative}.mx-halo{position:absolute;left:50%;top:40%;width:46px;height:46px;margin:-23px 0 0 -23px;border-radius:50%;background:rgba(57,213,238,.45);animation:mxpulse 1.8s ease-out infinite}@keyframes mxpulse{0%{transform:scale(.5);opacity:.9}100%{transform:scale(1.9);opacity:0}}.mx-tip{background:rgba(255,255,255,.95);color:#071A33;border:1px solid #e2e8f0;border-radius:6px;padding:1px 6px;font:700 10.5px/1.4 system-ui,sans-serif;box-shadow:0 1px 4px rgba(7,26,51,.15)}.mx-tip:before{border-top-color:#fff!important}`}</style>
        <div className="absolute right-3 top-3 z-[500] flex rounded-xl bg-white p-1 text-[13px] font-bold shadow-md">
          {([["Map", false], ["Satellite", true]] as [string, boolean][]).map(([lab, v]) => <button key={lab} type="button" onClick={() => setSat(v)} className={`rounded-lg px-3 py-1.5 ${sat === v ? "bg-[#071A33] text-white" : "text-slate-600 hover:bg-slate-50"}`}>{lab}</button>)}
        </div>
      </div>
      <div className="order-2 flex min-h-0 flex-col bg-white lg:order-1 lg:w-[560px] lg:overflow-y-auto xl:w-[620px]">
        <div className="grid gap-3 border-b border-slate-200 p-4">
          {heading}
    <div role="tablist" aria-label="Show" className="grid grid-cols-2 gap-1 rounded-2xl border border-slate-200 bg-white p-1 sm:flex">
            {tabs.map(([id, label, ks]) => {
              const on = activeTab === id;
              const color = id === "all" ? "#071A33" : KIND[id].color;
              return (
                <button key={id} type="button" role="tab" aria-selected={on} onClick={() => setKinds(ks)}
                  className={`flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-2 py-2 text-[13px] font-bold transition ${on ? "text-white shadow" : "text-slate-600 hover:bg-slate-50"}`}
                  style={on ? { background: color } : undefined}>
                  {id !== "all" && <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: on ? "#fff" : color }} />}
                  {label}
                  <span className={on ? "opacity-80" : "text-slate-400"}>{rows ? (id === "all" ? rows.length : count(id)).toLocaleString() : ""}</span>
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-2">
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
            {kinds.includes("m") && (me?.boater
              ? <button type="button" onClick={() => setShowDocks(!showDocks)} className={chip(showDocks)}>⚓ Docks & ramps{docks.length ? ` · ${docks.length.toLocaleString()}` : ""}</button>
              : <a href={signUp()} title="Free with a MelyOS account" className="rounded-full border border-dashed border-cyan-400 bg-cyan-50 px-3 py-1.5 text-sm font-bold text-[#0369a1] hover:bg-cyan-100">🔒 ⚓ Free docks & boat ramps · sign up free</a>)}
            <span className="ml-auto flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><svg width="11" height="15" viewBox="0 0 30 40"><path d="M15 1C7.3 1 1 7.2 1 14.9 1 25.4 15 39 15 39s14-13.6 14-24.1C29 7.2 22.7 1 15 1z" fill={RED} /></svg> Book online</span>
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-slate-400" /> Inquiry only</span>
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => setMoreF(!moreF)} className="inline-flex items-center gap-2 rounded-xl border border-[#071A33] px-3 py-1.5 text-sm font-black text-[#071A33] hover:bg-slate-50">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M7 12h10M10 18h4" /></svg>
              {moreF ? "Hide filters" : "Amenities & stays"}{amen.length + stayF.length ? <span className="rounded-full bg-[#08B8D8] px-1.5 text-xs text-white">{amen.length + stayF.length}</span> : null}
            </button>
            {(amen.length + stayF.length > 0 || onlyBook || onlyFuel || onlyRated || q) && <button type="button" onClick={() => { setAmen([]); setStayF([]); setOnlyBook(false); setOnlyFuel(false); setOnlyRated(false); setQ(""); }} className="text-sm font-bold text-rose-600 hover:underline">Clear all</button>}
          </div>
          {moreF && (
            <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-3">
              <div>
                <p className="mb-2 text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">Stay</p>
                <div className="flex flex-wrap gap-2">{STAY_FILTERS.map(([k, lab]) => <button key={k} type="button" onClick={() => setStayF(stayF.includes(k) ? stayF.filter((x) => x !== k) : [...stayF, k])} className={chip(stayF.includes(k))}>{lab}</button>)}</div>
              </div>
              <div>
                <p className="mb-2 text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">Amenities</p>
                <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                  {AMENITIES.filter((a) => a.kinds.some((k) => kinds.includes(k))).map((a) => {
                    const on = amen.includes(a.id);
                    return <button key={a.id} type="button" aria-pressed={on} onClick={() => setAmen(on ? amen.filter((x) => x !== a.id) : [...amen, a.id])}
                      className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 text-left text-[13px] font-semibold transition ${on ? "border-[#08B8D8] bg-cyan-50 text-[#071A33]" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"}`}>
                      <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${on ? "bg-[#08B8D8] text-white" : "bg-slate-100 text-[#0b3a5e]"}`}><AmenIcon svg={a.icon} size={16} /></span>{a.label}</button>;
                  })}
                </div>
                <p className="mt-2 text-[11px] text-slate-500">Amenities come from what each owner lists on MelyOS. Places that haven't listed theirs yet won't match.</p>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between gap-2 border-b border-slate-200 px-4 py-3">
          <p className="text-sm font-bold text-[#071A33]">{rows ? `${listed.length.toLocaleString()} ${follow && bounds ? "in this area" : "places"}` : "Loading…"}</p>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600"><input type="checkbox" checked={follow} onChange={(e) => setFollow(e.target.checked)} className="h-4 w-4 accent-[#08B8D8]" />Search as I move the map</label>
        </div>
        <div className="max-h-[70vh] overflow-y-auto lg:max-h-none lg:flex-1 lg:overflow-visible">
          {rows && !listed.length && <p className="p-5 text-sm text-slate-500">Nothing here. Zoom out or move the map, clear a filter, or choose another state above.</p>}
          {partners.map((r) => {
            const photo = photoOf(r), star = extra.stars[r[7]], k = KIND[r[0]];
            return (
              <div key={r[7]} onClick={() => focus(r)} className={`relative flex cursor-pointer gap-3 border-b border-slate-100 p-3 transition hover:bg-slate-50 ${picked === r[7] ? "bg-cyan-50" : "bg-[#fffdf7]"}`}>
                <span className="absolute inset-y-3 left-0 w-[3px] rounded-r bg-[#d4a94a]" />
                <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-200">
                  <img src={photo || aerial(r[2], r[3])} alt="" loading="lazy" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#a07a1f]">★ MelyOS Partner</p>
                  <a href={`${listingPath(stOf(r), r)}${dq(r)}`} onClick={(e) => e.stopPropagation()} className="line-clamp-2 font-black leading-snug text-[#071A33] hover:underline">{nice(r[1])}</a>
                  <p className="truncate text-sm text-slate-500">{k.label}{r[4] ? ` · ${r[4]}` : ""}</p>
                  {star && <p className="text-sm"><span className="text-amber-500">★</span> <b>{star[0].toFixed(1)}</b> <span className="text-slate-500">({star[1]})</span></p>}
                  <span className="mt-1 inline-block rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-black text-rose-700">Online Booking</span>
                </div>
              </div>
            );
          })}
          {(guest ? listed.slice(0, FREE_ROWS) : listed.slice(0, 150)).map((r) => {
            const book = bookable(r), photo = photoOf(r), star = extra.stars[r[7]], fu = extra.fuel[r[7]], k = KIND[r[0]];
            return (
              <div key={r[7]} onClick={() => focus(r)} className={`flex cursor-pointer gap-3 border-b border-slate-100 p-3 transition hover:bg-slate-50 ${picked === r[7] ? "bg-cyan-50" : ""}`}>
                <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-xl" style={{ background: `linear-gradient(135deg, ${k.color}, #071A33)` }}>
                  {photo ? <img src={photo} alt="" loading="lazy" referrerPolicy="no-referrer" onError={() => setBroken((b) => ({ ...b, [r[7]]: true }))} className="h-full w-full object-cover" />
                    : <img src={aerial(r[2], r[3])} alt="" loading="lazy" className="h-full w-full object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <a href={`${listingPath(stOf(r), r)}${dq(r)}`} onClick={(e) => e.stopPropagation()} className="line-clamp-2 font-black leading-snug text-[#071A33] hover:underline">{nice(r[1])}</a>
                  <p className="truncate text-sm text-slate-500">{k.label}{r[4] ? ` · ${r[4]}` : ""}</p>
                  {star && <p className="text-sm"><span className="text-amber-500">★</span> <b>{star[0].toFixed(1)}</b> <span className="text-slate-500">({star[1]})</span></p>}
                  {fu && <p className="text-[13px] font-semibold text-slate-700">⛽ {fu.gas ? `Gas $${fu.gas.toFixed(2)}` : ""}{fu.gas && fu.diesel ? " · " : ""}{fu.diesel ? `Diesel $${fu.diesel.toFixed(2)}` : ""} <span className="font-normal text-slate-500">· {ago(fu.at)}</span></p>}
                  <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-black ${book ? "bg-rose-50 text-rose-700" : "bg-slate-100 text-slate-600"}`}>{book ? "Online Booking" : "Inquiry Only"}</span>
                </div>
              </div>
            );
          })}
          {guest && listed.length > FREE_ROWS && (
            <div className="m-3 rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-white p-4 text-center">
              <p className="text-lg font-black text-[#071A33]">See all {listed.length.toLocaleString()} places here</p>
              <p className="mt-1 text-sm text-slate-600">Create your free MelyOS account to unlock the full list, phone numbers and websites, public docks and boat ramps on the map, save favorites and request sites in one tap.</p>
              <a href={signUp()} className="mt-3 inline-block rounded-xl bg-[#08B8D8] px-5 py-2.5 font-black text-white hover:bg-[#079db9]">Create free account</a>
              <p className="mt-2 text-xs text-slate-500">Already have one? <a href={signUp()} className="font-bold underline">Sign in</a></p>
            </div>
          )}
          {!guest && listed.length > 150 && <p className="p-4 text-center text-xs text-slate-500">Showing 150 of {listed.length.toLocaleString()}. Zoom in on the map or search to narrow it down.</p>}
        </div>
        <p className="border-t border-slate-100 px-4 py-2 text-[11px] text-slate-500">Map data © <a className="underline" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors · Aerial imagery © Esri, Maxar, Earthstar Geographics. Listings are public information; owners can claim and correct theirs for free.</p>
      </div>
    </div>
  );
}
