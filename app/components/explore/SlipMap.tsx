"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { RequestForm } from "./ListingActions";
import { tidySlips } from "./tidy";

// Nov 17 (per Mely): a marina's slips (or a park's sites) drawn over its satellite photo. Boaters tap a slip, read
// what makes it good (corner, near the fuel dock…) and "Request this slip" — the request carries the slip number.
// With ?edit=TOKEN (link made in Insights → Explore → Slip maps) Mely places and describes the slips herself.
export type Slip = { id: string; n: string; lat: number; lon: number; len: number; wid: number; ang: number; desc?: string | null; tags?: string[] };
export type SlipMapData = { center_lat: number; center_lon: number; zoom: number; intro?: string | null; slips: Slip[]; published?: boolean; docks?: [number, number][][]; source?: string; outline?: [number, number][]; roads?: [number, number][][]; pois?: { t: string; lat: number; lon: number }[] };
type Props = { state: string; listing_key: string; listing_name: string; kind: string; phone?: string | null; map: SlipMapData; edit?: string | null };

const TAGS = ["Corner / T-head", "End tie", "Easy in & out", "Near fuel dock", "Near restrooms & showers", "Near parking", "Near the office", "Water view", "Shade", "Covered", "Water", "30 amp", "50 amp", "100 amp", "Pull-through", "Back-in"];
const FT = 0.3048;
// rotated rectangle: length runs along `ang` (0 = north), width across it
function corners(s: Slip): [number, number][] {
  const a = (s.ang * Math.PI) / 180, mLat = 111320, mLon = 111320 * Math.cos((s.lat * Math.PI) / 180);
  const L = (s.len * FT) / 2, W = (s.wid * FT) / 2;
  const ux = Math.sin(a), uy = Math.cos(a), vx = Math.cos(a), vy = -Math.sin(a);
  return [[L, W], [L, -W], [-L, -W], [-L, W]].map(([x, y]) => [s.lat + (x * uy + y * vy) / mLat, s.lon + (x * ux + y * vx) / mLon]);
}
function shift(s: Slip, across: number, along = 0): { lat: number; lon: number } {
  const a = (s.ang * Math.PI) / 180, mLat = 111320, mLon = 111320 * Math.cos((s.lat * Math.PI) / 180);
  const dx = across * FT * Math.cos(a) + along * FT * Math.sin(a), dy = -across * FT * Math.sin(a) + along * FT * Math.cos(a);
  return { lat: s.lat + dy / mLat, lon: s.lon + dx / mLon };
}
const nextNum = (n: string, d = 1) => { const m = n.match(/^(.*?)(\d+)(\D*)$/); if (!m) return n + (d > 0 ? "-2" : ""); const v = Math.max(0, Number(m[2]) + d); return m[1] + String(v).padStart(m[2].length, "0") + m[3]; };
const uid = () => Math.random().toString(36).slice(2, 10);
const inp = "w-full rounded-lg border border-slate-300 px-2.5 py-2 text-[14px] outline-none focus:border-[#08B8D8]";

export default function SlipMap(p: Props) {
  const editor = !!p.edit;
  const unit = p.kind === "m" ? "slip" : "site";
  const Unit = unit[0].toUpperCase() + unit.slice(1);
  const [slips, setSlips] = useState<Slip[]>(p.map.slips || []);
  const [intro, setIntro] = useState(p.map.intro || "");
  const docks = p.map.docks || [];
  const roads = p.map.roads || [], outline = p.map.outline || [], pois = p.map.pois || [];
  const [published, setPublished] = useState(!!p.map.published);
  const [sel, setSel] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [asking, setAsking] = useState(false);
  const [boat, setBoat] = useState("");
  const [save, setSave] = useState<{ busy?: boolean; msg?: string; err?: string; dirty?: boolean }>({});
  const mapEl = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null), L = useRef<any>(null), layer = useRef<any>(null), handle = useRef<any>(null);
  const addRef = useRef(adding); addRef.current = adding;
  const slipsRef = useRef(slips); slipsRef.current = slips;
  const [ready, setReady] = useState(false);
  // Nov 17 (per Mely): "Map" = drawn style like the Aloha / marina maps (water, wooden docks, numbered tiles);
  // "Satellite" = the photo (the editor starts there to place slips exactly).
  const [view, setView] = useState<"map" | "sat">(editor ? "sat" : "map");
  const [zoom, setZoom] = useState(p.map.zoom || 18);
  const sat = useRef<any>(null);
  const marina = p.kind === "m";
  const s = slips.find((x) => x.id === sel) || null;
  const boatFt = Number(boat) || 0;

  const change = (next: Slip[]) => { setSlips(next); setSave((x) => ({ ...x, dirty: true, msg: undefined })); };
  const patch = (id: string, k: Partial<Slip>) => change(slipsRef.current.map((x) => (x.id === id ? { ...x, ...k } : x)));

  useEffect(() => {
    let off = false;
    import("leaflet").then((mod) => {
      if (off || !mapEl.current || map.current) return;
      const Lm: any = (mod as any).default || mod; L.current = Lm;
      const m = Lm.map(mapEl.current, { zoomControl: true, maxZoom: 21, zoomSnap: 0.25 }).setView([p.map.center_lat, p.map.center_lon], p.map.zoom || 18);
      sat.current = Lm.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        maxNativeZoom: 19, maxZoom: 21, attribution: "Imagery &copy; Esri, Maxar, Earthstar Geographics" });
      m.on("zoomend", () => setZoom(m.getZoom()));
      // frame the whole property on open
      const pts = (p.map.slips || []).map((x) => [x.lat, x.lon]).concat(...(p.map.docks || []), p.map.outline || []);
      if (pts.length > 1) { m.fitBounds(Lm.latLngBounds(pts), { padding: [24, 24], maxZoom: 20 }); setZoom(m.getZoom()); }
      layer.current = Lm.layerGroup().addTo(m);
      m.on("click", (e: any) => {
        if (!addRef.current) { setSel(null); setAsking(false); return; }
        const last = slipsRef.current[slipsRef.current.length - 1];
        const ns: Slip = { id: uid(), n: last ? nextNum(last.n) : "1", lat: e.latlng.lat, lon: e.latlng.lng, len: last?.len || 40, wid: last?.wid || 14, ang: last?.ang || 0, desc: "", tags: [] };
        change([...slipsRef.current, ns]); setSel(ns.id); setAdding(false);
      });
      map.current = m; setReady(true);
    });
    return () => { off = true; map.current?.remove(); map.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const m = map.current; if (!ready || !m || !sat.current) return;
    if (view === "sat") sat.current.addTo(m); else sat.current.remove();
  }, [view, ready]);

  // draw slips
  useEffect(() => {
    const Lm = L.current, m = map.current; if (!ready || !Lm || !m) return;
    layer.current.clearLayers();
    const drawn = view === "map";
    // a dock is ~2.5 m wide: draw it at its real width for this zoom (pixels per metre)
    const ppm = Math.pow(2, zoom) * 256 / (40075016 * Math.cos((p.map.center_lat * Math.PI) / 180));
    const dockW = Math.max(3, Math.min(28, 2.6 * ppm));
    if (drawn && outline.length > 3) layer.current.addLayer(Lm.polygon(outline, marina
      ? { color: "#e0f2fe", weight: 2, dashArray: "6 6", fillColor: "#bae6fd", fillOpacity: 0.25, interactive: false }
      : { color: "#4d7c0f", weight: 2, dashArray: "6 6", fillColor: "#a3d18a", fillOpacity: 0.55, interactive: false }));
    const roadW = Math.max(4, Math.min(40, 6 * ppm));
    for (const rd of roads) if (rd.length > 1) {
      layer.current.addLayer(Lm.polyline(rd, { color: drawn ? "#ffffff" : "#e5e7eb", weight: roadW + 3, opacity: drawn ? 1 : 0.5, lineCap: "round", lineJoin: "round", interactive: false }));
      layer.current.addLayer(Lm.polyline(rd, { color: drawn ? "#9ca3af" : "#f8fafc", weight: roadW, opacity: drawn ? 1 : 0.6, lineCap: "round", lineJoin: "round", interactive: false }));
    }
    for (const pt of pois) layer.current.addLayer(Lm.marker([pt.lat, pt.lon], { interactive: false, icon: Lm.divIcon({ className: "", iconSize: [0, 0],
      html: `<span style="position:absolute;transform:translate(-50%,-50%);white-space:nowrap;background:#fff;color:#0f172a;font:700 10.5px/1 system-ui;padding:4px 7px;border-radius:999px;box-shadow:0 1px 4px rgba(0,0,0,.25);border:1.5px solid #0e7490">${pt.t}</span>` }) }));
    for (const dk of docks) if (dk.length > 1) {
      if (drawn) layer.current.addLayer(Lm.polyline(dk, { color: "#7c5a3a", weight: dockW + 2, opacity: 1, lineCap: "butt", interactive: false }));
      layer.current.addLayer(Lm.polyline(dk, { color: drawn ? "#c8a27a" : "#e2e8f0", weight: drawn ? dockW : 4, opacity: drawn ? 1 : 0.9, lineCap: "butt", interactive: false }));
    }
    const labels = zoom >= 19 || (zoom >= 18 && slips.length < 150);
    for (const x of slips) {
      const fits = boatFt ? x.len >= boatFt : true, on = x.id === sel;
      const style = drawn
        ? { color: on ? "#a16207" : "#14532d", weight: on ? 2.5 : 0.8, fillColor: on ? "#facc15" : fits ? "#22c55e" : "#9ca3af", fillOpacity: on ? 1 : fits ? 0.92 : 0.6 }
        : { color: on ? "#facc15" : "#ffffff", weight: on ? 3 : 1.2, fillOpacity: on ? 0.25 : 0, opacity: 0.95 }; // satellite (editor only): outlines to align with the photo
      const poly = Lm.polygon(corners(x), { ...style, bubblingMouseEvents: false });
      poly.on("click", () => { setSel(x.id); setAsking(false); });
      if (labels && drawn) poly.bindTooltip(x.n, { permanent: true, direction: "center", className: drawn ? "slipnum2" : "slipnum" });
      else poly.bindTooltip(`${marina ? "Slip" : "Site"} ${x.n}`, { direction: "top" });
      layer.current.addLayer(poly);
    }
    handle.current?.remove(); handle.current = null;
    const cur = slips.find((x) => x.id === sel);
    if (editor && cur) {
      const h = Lm.marker([cur.lat, cur.lon], { draggable: true, icon: Lm.divIcon({ className: "", html: '<div style="width:18px;height:18px;border-radius:9px;background:#facc15;border:2px solid #071A33;box-shadow:0 0 0 2px #fff"></div>', iconSize: [18, 18], iconAnchor: [9, 9] }) }).addTo(m);
      h.on("dragend", () => { const ll = h.getLatLng(); patch(cur.id, { lat: ll.lat, lon: ll.lng }); });
      handle.current = h;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slips, sel, ready, boatFt, editor, view, zoom]);

  useEffect(() => { if (mapEl.current) mapEl.current.style.cursor = adding ? "crosshair" : ""; }, [adding]);
  useEffect(() => {
    if (!editor) return;
    const h = (e: BeforeUnloadEvent) => { if (save.dirty) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", h); return () => window.removeEventListener("beforeunload", h);
  }, [editor, save.dirty]);

  function nextTo(dir: 1 | -1) {
    if (!s) return;
    const ns: Slip = { ...s, id: uid(), n: nextNum(s.n, dir), ...shift(s, dir * s.wid), desc: "", tags: (s.tags || []).filter((t) => /amp|Water$|Covered/.test(t)) };
    change([...slipsRef.current, ns]); setSel(ns.id);
  }
  function across() {
    if (!s) return;
    const ns: Slip = { ...s, id: uid(), n: nextNum(s.n, 1), ...shift(s, 0, -s.len - 6), desc: "", tags: [] };
    change([...slipsRef.current, ns]); setSel(ns.id);
  }
  async function doSave() {
    const m = map.current; setSave({ busy: true, dirty: true });
    const c = m?.getCenter();
    const r = await fetch("/api/explore/slipmap", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state: p.state, listing_key: p.listing_key, edit: p.edit, map: { center_lat: c?.lat ?? p.map.center_lat, center_lon: c?.lng ?? p.map.center_lon, zoom: m?.getZoom() ?? 18, intro, slips, published, docks, source: p.map.source || null, layers: { outline, roads, pois } } }) })
      .then((x) => x.json()).catch(() => ({ error: "Couldn't reach the server." }));
    setSave(r.ok ? { msg: `Saved · ${r.count} ${unit}s${published ? " · public" : " · draft (only you see it)"}` } : { err: r.error || "Couldn't save.", dirty: true });
  }
  const sorted = useMemo(() => [...slips].sort((a, b) => a.n.localeCompare(b.n, undefined, { numeric: true })), [slips]);
  const fitCount = boatFt ? slips.filter((x) => x.len >= boatFt).length : 0;

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
      <style>{`.slipnum{background:rgba(7,26,51,.78);color:#fff;border:0;box-shadow:none;font:700 10px/1 system-ui;padding:2px 4px;border-radius:4px}.slipnum:before{display:none}.slipnum2{background:transparent;color:#fff;border:0;box-shadow:none;font:800 10px/1 system-ui;padding:0;text-shadow:0 1px 2px rgba(0,0,0,.55)}.slipnum2:before{display:none}
.sm-map.leaflet-container{background:transparent}
.sm-water{background-color:#5fb3dc;background-image:radial-gradient(ellipse at 30% 20%,rgba(255,255,255,.28),transparent 60%),repeating-linear-gradient(135deg,rgba(255,255,255,.07) 0 2px,transparent 2px 14px)}
.sm-grass{background-color:#cfe6c0;background-image:radial-gradient(ellipse at 30% 20%,rgba(255,255,255,.35),transparent 60%),repeating-linear-gradient(45deg,rgba(22,101,52,.05) 0 2px,transparent 2px 12px)}`}</style>
      <div>
        {editor && <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl bg-amber-50 p-3 text-sm ring-1 ring-amber-200">
          <b className="text-amber-900">Edit mode</b>
          <button onClick={() => setAdding((a) => !a)} className={`rounded-lg px-3 py-2 font-bold ${adding ? "bg-amber-500 text-white" : "bg-white ring-1 ring-amber-300"}`}>{adding ? `Tap the map to place the ${unit}…` : `+ Add ${unit}`}</button>
          {slips.length > 1 && <button onClick={() => { change(tidySlips(slipsRef.current, roads, docks)); setSel(null); }} title="Straight rows, each site touching its neighbours, from the road back" className="rounded-lg bg-white px-3 py-2 font-bold ring-1 ring-amber-300">Line up</button>}
          <label className="flex items-center gap-1.5 font-bold"><input type="checkbox" checked={published} onChange={(e) => { setPublished(e.target.checked); setSave((x) => ({ ...x, dirty: true })); }} /> Public</label>
          <button disabled={save.busy} onClick={doSave} className="ml-auto rounded-lg bg-[#071A33] px-4 py-2 font-bold text-white disabled:opacity-60">{save.busy ? "Saving…" : save.dirty ? "Save changes" : "Save"}</button>
          {save.msg && <span className="w-full text-emerald-700">{save.msg}</span>}
          {save.err && <span className="w-full font-bold text-red-600">{save.err}</span>}
        </div>}
        <div className="overflow-hidden rounded-2xl ring-1 ring-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-white" style={{ background: marina ? "linear-gradient(135deg,#0c4a6e,#0891b2)" : "linear-gradient(135deg,#14532d,#16a34a)" }}>
            <div>
              <p className="text-lg font-black leading-tight">{p.listing_name}</p>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/80">Interactive {unit} map</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[12.5px] font-semibold">
              <span className="flex items-center gap-1.5"><i className="inline-block h-3.5 w-3.5 rounded bg-[#16a34a] ring-1 ring-white/70" /> Request it ({slips.length})</span>
              {boatFt > 0 && <span className="flex items-center gap-1.5"><i className="inline-block h-3.5 w-3.5 rounded bg-[#9ca3af] ring-1 ring-white/70" /> Too short for your boat</span>}
              <span className="flex items-center gap-1.5"><i className="inline-block h-3.5 w-3.5 rounded bg-[#facc15] ring-1 ring-white/70" /> Selected</span>
              {editor && <span className="ml-1 inline-flex overflow-hidden rounded-lg bg-white/15 ring-1 ring-white/30">
                <button type="button" onClick={() => setView("map")} className={`px-3 py-1.5 ${view === "map" ? "bg-white text-slate-900" : ""}`}>Map</button>
                <button type="button" onClick={() => setView("sat")} className={`px-3 py-1.5 ${view === "sat" ? "bg-white text-slate-900" : ""}`}>Satellite</button>
              </span>}
            </div>
          </div>
          {/* the background lives on a wrapper: Leaflet owns the classes of the map element itself */}
          <div className={`relative h-[62vh] min-h-[420px] w-full overflow-hidden ${view === "map" ? (marina ? "sm-water" : "sm-grass") : "bg-slate-800"}`}>
            <div ref={mapEl} className="sm-map absolute inset-0" />
          </div>
        </div>
        <p className="mt-2 text-xs text-slate-500">{Unit} layout drawn by MelyOS as a guide{p.map.source ? <> (base data © OpenStreetMap contributors, ODbL)</> : null}. Availability and price are always confirmed by {p.listing_name}.</p>
      </div>

      <aside className="space-y-4">
        {editor && <label className="block text-sm font-bold">Intro (shows above the map)
          <textarea rows={3} className={`${inp} mt-1`} value={intro} onChange={(e) => { setIntro(e.target.value); setSave((x) => ({ ...x, dirty: true })); }} placeholder={`e.g. Deep-water ${unit}s on the Intracoastal, minutes from the inlet.`} /></label>}
        {!editor && p.kind === "m" && <div className="rounded-2xl bg-slate-50 p-4">
          <label className="text-sm font-black">How long is your boat?
            <div className="mt-1 flex items-center gap-2"><input inputMode="decimal" className={inp} placeholder="Length in feet" value={boat} onChange={(e) => setBoat(e.target.value.replace(/[^\d.]/g, ""))} /><span className="text-sm text-slate-500">ft</span></div></label>
          {boatFt > 0 && <p className="mt-2 text-sm text-slate-600"><b className="text-[#0891b2]">{fitCount}</b> of {slips.length} slips look long enough — they&apos;re highlighted.</p>}
        </div>}

        {!s && <div className="rounded-2xl border border-slate-200 p-5">
          <p className="text-lg font-black">{slips.length ? `Tap a ${unit} on the map` : editor ? `Add your first ${unit}` : `No ${unit}s drawn yet`}</p>
          <p className="mt-1 text-sm text-slate-600">{editor ? `Tap “+ Add ${unit}”, then tap where it is on the photo. Then use “Next in row” to place its neighbors.` : `See its size and what makes it special, then request it — ${p.listing_name} confirms with you.`}</p>
          {sorted.length > 0 && <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); const q = String(new FormData(e.currentTarget).get("q") || "").trim().toLowerCase(); const f = slips.find((x) => x.n.toLowerCase() === q); if (f) { setSel(f.id); map.current?.setView([f.lat, f.lon], Math.max(map.current.getZoom(), 19)); } }}>
            <input name="q" className={inp} placeholder={`Go to ${unit} #`} />
            <button className="rounded-lg bg-[#071A33] px-4 text-sm font-bold text-white">Go</button>
          </form>}
        </div>}

        {s && !editor && <div className="rounded-2xl border-2 border-[#08B8D8] p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0891b2]">{Unit}</p>
          <p className="text-3xl font-black">{s.n}</p>
          <p className="mt-1 text-slate-600">About {s.len} ft long · {s.wid} ft wide</p>
          {boatFt > 0 && <p className={`mt-1 text-sm font-bold ${s.len >= boatFt ? "text-emerald-700" : "text-amber-700"}`}>{s.len >= boatFt ? `Looks long enough for your ${boatFt} ft boat` : `May be short for a ${boatFt} ft boat — ask the marina`}</p>}
          {s.desc && <p className="mt-3 text-[15px] leading-relaxed">{s.desc}</p>}
          {!!s.tags?.length && <div className="mt-3 flex flex-wrap gap-1.5">{s.tags.map((t) => <span key={t} className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-bold text-[#0e7490]">{t}</span>)}</div>}
          {!asking ? <button onClick={() => setAsking(true)} className="mt-4 w-full rounded-xl bg-[#08B8D8] px-5 py-3 text-lg font-black text-white hover:bg-[#079db9]">Request {unit} {s.n}</button>
            : <div className="mt-4"><RequestForm state={p.state} listing_key={p.listing_key} listing_name={p.listing_name} kind={p.kind} slip={s.n} /></div>}
          {p.phone && <p className="mt-3 text-center text-sm text-slate-500">or call <a className="font-bold text-[#071A33]" href={`tel:${p.phone}`}>{p.phone}</a></p>}
        </div>}

        {s && editor && <div className="space-y-3 rounded-2xl border-2 border-amber-300 p-4">
          <div className="grid grid-cols-3 gap-2">
            <label className="text-xs font-bold">{Unit} #<input className={inp} value={s.n} onChange={(e) => patch(s.id, { n: e.target.value.slice(0, 12) })} /></label>
            <label className="text-xs font-bold">Length ft<input inputMode="decimal" className={inp} value={s.len} onChange={(e) => patch(s.id, { len: Number(e.target.value) || 0 })} /></label>
            <label className="text-xs font-bold">Width ft<input inputMode="decimal" className={inp} value={s.wid} onChange={(e) => patch(s.id, { wid: Number(e.target.value) || 0 })} /></label>
          </div>
          <label className="block text-xs font-bold">Turn ({s.ang}°)
            <div className="flex items-center gap-2"><button onClick={() => patch(s.id, { ang: (s.ang + 355) % 360 })} className="rounded-md bg-slate-100 px-2 py-1">−5°</button>
              <input type="range" min={0} max={359} value={s.ang} onChange={(e) => patch(s.id, { ang: Number(e.target.value) })} className="flex-1" />
              <button onClick={() => patch(s.id, { ang: (s.ang + 5) % 360 })} className="rounded-md bg-slate-100 px-2 py-1">+5°</button></div></label>
          <p className="text-xs text-slate-500">Drag the yellow dot to move it.</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => nextTo(1)} className="rounded-lg bg-[#071A33] px-3 py-2 text-sm font-bold text-white">Next in row →</button>
            <button onClick={() => nextTo(-1)} className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-bold text-white">← Next in row</button>
            <button onClick={across} className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold">Across the dock</button>
            <button onClick={() => { change(slips.filter((x) => x.id !== s.id)); setSel(null); }} className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-700">Delete</button>
          </div>
          <label className="block text-xs font-bold">What makes it good (only what's true)
            <textarea rows={3} className={inp} value={s.desc || ""} onChange={(e) => patch(s.id, { desc: e.target.value.slice(0, 400) })} placeholder="e.g. Corner slip with easy access, steps from the fuel dock and the restrooms." /></label>
          <div className="flex flex-wrap gap-1.5">{TAGS.map((t) => { const on = s.tags?.includes(t); return (
            <button key={t} onClick={() => patch(s.id, { tags: on ? s.tags!.filter((x) => x !== t) : [...(s.tags || []), t] })} className={`rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${on ? "bg-cyan-600 text-white ring-cyan-600" : "ring-slate-300"}`}>{t}</button>); })}</div>
          <button onClick={() => setSel(null)} className="w-full rounded-lg bg-slate-100 py-2 text-sm font-bold">Done</button>
        </div>}
      </aside>
    </div>
  );
}
