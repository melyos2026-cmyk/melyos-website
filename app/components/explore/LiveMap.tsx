"use client";
import { useEffect, useRef, useState, type RefObject } from "react";

// Nov 17 (per Mely): a MelyOS client's live interactive lot/slip map inside its Explore page.
// The map reports its natural height ("aloha-map-height") so the frame fits it without scrolling.
// Nov 20 (per Mely — "el request se linkea con el mapa"): the map and the request form talk through this frame:
//   form → map: window event "melyos-dates" {arrive, depart} is posted into the map
//   map → form: messages from the map (melyos-avail / melyos-lot / melyos-ready) are re-sent as window event "melyos-map"
// Only messages from the map's own origin are accepted.
export default function LiveMap({ src, title, fixed }: { src: string; title: string; fixed?: boolean }) {
  const [h, setH] = useState(720);
  const frame = useRef<HTMLIFrameElement>(null);
  const last = useRef<{ arrive?: string; depart?: string } | null>(null);
  useEffect(() => {
    const origin = new URL(src, window.location.href).origin;
    const post = (d: any) => { try { frame.current?.contentWindow?.postMessage({ type: "melyos-dates", arrive: d?.arrive || "", depart: d?.depart || "", length: String(d?.length || "").slice(0, 6), power: String(d?.power || "").slice(0, 12), rental: !!d?.rental, driverSlideOuts: String(d?.driverSlideOuts || "").slice(0, 2), passengerSlideOuts: String(d?.passengerSlideOuts || "").slice(0, 2) }, origin); } catch {} };
    const on = (e: MessageEvent) => {
      if (e.origin !== origin) return;
      if (e.data?.type === "aloha-map-height" && typeof e.data.height === "number") setH(Math.max(420, Math.min(4000, e.data.height)));
      if (typeof e.data?.type === "string" && e.data.type.startsWith("melyos-")) {
        if (e.data.type === "melyos-ready" && last.current) post(last.current);
        window.dispatchEvent(new CustomEvent("melyos-map", { detail: e.data }));
      }
    };
    const dates = (e: Event) => { last.current = (e as CustomEvent).detail; post(last.current); };
    // Nov 20 (per Mely): a site picked in the form's "Lot" list is shown on the map
    const pick = (e: Event) => { const lot = String((e as CustomEvent).detail?.lot || "").slice(0, 20); try { frame.current?.contentWindow?.postMessage({ type: "melyos-pick", lot }, origin); } catch {} };
    window.addEventListener("message", on);
    window.addEventListener("melyos-dates", dates);
    // Nov 20 (per Mely): "Book & pay" in the form opens the park's own booking on the map
    const book = (e: Event) => { const d = (e as CustomEvent).detail || {}; try { frame.current?.contentWindow?.postMessage({ type: "melyos-book", lot: String(d.lot || "").slice(0, 20), arrive: String(d.arrive || "").slice(0, 10), depart: String(d.depart || "").slice(0, 10), length: String(d.length || "").slice(0, 6), driverSlideOuts: String(d.driverSlideOuts || "").slice(0, 2), passengerSlideOuts: String(d.passengerSlideOuts || "").slice(0, 2) }, origin); } catch {} frame.current?.scrollIntoView({ behavior: "smooth", block: "start" }); };
    window.addEventListener("melyos-pick", pick);
    window.addEventListener("melyos-book", book);
    return () => { window.removeEventListener("message", on); window.removeEventListener("melyos-dates", dates); window.removeEventListener("melyos-pick", pick); window.removeEventListener("melyos-book", book); };
  }, [src]);
  // Nov 20: a self-contained demo map. Nov 21 (per Mely — "que se vea impresionante cuando uno entre", like the big
  // Florida map): from tablet width up the map fills its whole column and the frame grows tall to fit the whole map
  // (page scrolls, the booking form stays beside it). Phones: full width, screen height.
  if (fixed) return <FixedMap frame={frame} src={src} title={title} />;
  return <div className="overflow-hidden rounded-2xl ring-1 ring-slate-200" style={{ height: h }}>
    <iframe ref={frame} src={src} title={title} className="h-full w-full border-0" scrolling="no" loading="lazy" />
  </div>;
}

function FixedMap({ frame, src, title }: { frame: RefObject<HTMLIFrameElement | null>; src: string; title: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [hh, setHh] = useState<{ h: number; w: number } | null>(null);
  useEffect(() => {
    const el = box.current; if (!el) return;
    // Nov 21 (per Mely — "que se vea todo completo, pero en un good size"): the whole map on one screen
    // (screen height minus the site header), as wide as that allows, never wider than its column.
    const fit = () => {
      if (window.innerWidth < 768) { setHh(null); return; }
      const col = el.clientWidth, h = Math.min(Math.round(col / 0.612 + 62), Math.max(560, window.innerHeight - 104));
      setHh({ h, w: Math.min(col, Math.round((h - 62) * 0.612 + 2)) });
    };
    fit(); const ro = new ResizeObserver(fit); ro.observe(el); window.addEventListener("resize", fit);
    return () => { ro.disconnect(); window.removeEventListener("resize", fit); };
  }, []);
  return <div ref={box} className="w-full min-w-0">
    <div className="mx-auto w-full overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200" style={hh ? { height: hh.h, width: hh.w } : { height: "max(520px, calc(100vh - 7.5rem))" }}>
      <iframe ref={frame} src={src} title={title} className="h-full w-full border-0" />
    </div>
  </div>;
}
