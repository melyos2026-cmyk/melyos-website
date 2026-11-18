"use client";

// Nov 18 (per Mely): the listing page's own map, big like Dockwa — street map or satellite, the place's pin.
import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

export default function SpotMap({ lat, lon, name, color }: { lat: number; lon: number; name: string; color: string }) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const layers = useRef<{ street?: any; sat?: any }>({});
  const [sat, setSat] = useState(true);
  useEffect(() => {
    let off = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (off || !el.current || map.current) return;
      map.current = L.map(el.current, { scrollWheelZoom: false }).setView([lat, lon], 16);
      layers.current.street = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "&copy; OpenStreetMap contributors" });
      layers.current.sat = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", { maxZoom: 19, attribution: "Imagery &copy; Esri" });
      layers.current.sat.addTo(map.current);
      L.marker([lat, lon], { title: name, icon: L.divIcon({ className: "", iconSize: [30, 40], iconAnchor: [15, 40], html: `<svg width="30" height="40" viewBox="0 0 30 40"><path d="M15 1C7.3 1 1 7.2 1 14.9 1 25.4 15 39 15 39s14-13.6 14-24.1C29 7.2 22.7 1 15 1z" fill="${color}" stroke="#fff" stroke-width="2"/><circle cx="15" cy="15" r="5" fill="#fff"/></svg>` }) }).addTo(map.current);
      setTimeout(() => map.current && map.current.invalidateSize(), 250);
    })();
    return () => { off = true; };
  }, [lat, lon, name, color]);
  useEffect(() => {
    const m = map.current, { street, sat: s } = layers.current;
    if (!m || !street || !s) return;
    if (sat) { m.removeLayer(street); s.addTo(m); } else { m.removeLayer(s); street.addTo(m); }
  }, [sat]);
  return (
    <div className="relative h-full min-h-[320px] overflow-hidden rounded-3xl border border-slate-200">
      <div ref={el} className="absolute inset-0 z-0 isolate" />
      <div className="absolute left-3 top-3 z-[500] flex overflow-hidden rounded-xl bg-white text-sm font-bold shadow ring-1 ring-slate-200">
        <button type="button" onClick={() => setSat(false)} className={`px-3 py-1.5 ${!sat ? "bg-[#071A33] text-white" : "text-slate-700"}`}>Map</button>
        <button type="button" onClick={() => setSat(true)} className={`px-3 py-1.5 ${sat ? "bg-[#071A33] text-white" : "text-slate-700"}`}>Satellite</button>
      </div>
    </div>
  );
}
