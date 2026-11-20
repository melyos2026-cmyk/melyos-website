"use client";
import { useEffect, useRef, useState } from "react";

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
    const post = (d: any) => { try { frame.current?.contentWindow?.postMessage({ type: "melyos-dates", arrive: d?.arrive || "", depart: d?.depart || "", length: String(d?.length || "").slice(0, 6), power: String(d?.power || "").slice(0, 12), rental: !!d?.rental }, origin); } catch {} };
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
    window.addEventListener("melyos-pick", pick);
    return () => { window.removeEventListener("message", on); window.removeEventListener("melyos-dates", dates); window.removeEventListener("melyos-pick", pick); };
  }, [src]);
  // Nov 20: a self-contained demo map fills the screen (the whole map shows at first; its popups center in view)
  // Nov 20 (per Mely — "que se vea bien"): the frame is only as wide as the map at full height (no grey side bands);
  // on phones it's full width.
  if (fixed) return <div className="mx-live mx-auto w-full overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200" style={{ height: "max(520px, calc(100vh - 7.5rem))" }}>
    <style>{`@media (min-width:1024px){.mx-live{width:calc((max(520px, 100vh - 7.5rem) - 60px) * 0.612 + 2px)}}`}</style>
    <iframe ref={frame} src={src} title={title} className="h-full w-full border-0" />
  </div>;
  return <div className="overflow-hidden rounded-2xl ring-1 ring-slate-200" style={{ height: h }}>
    <iframe ref={frame} src={src} title={title} className="h-full w-full border-0" scrolling="no" loading="lazy" />
  </div>;
}
