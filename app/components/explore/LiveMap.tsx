"use client";
import { useEffect, useState } from "react";

// Nov 17 (per Mely): a MelyOS client's live interactive lot/slip map inside its Explore page.
// The map reports its natural height ("aloha-map-height") so the frame fits it without scrolling.
export default function LiveMap({ src, title }: { src: string; title: string }) {
  const [h, setH] = useState(720);
  useEffect(() => {
    const origin = new URL(src).origin;
    const on = (e: MessageEvent) => {
      if (e.origin === origin && e.data?.type === "aloha-map-height" && typeof e.data.height === "number")
        setH(Math.max(420, Math.min(4000, e.data.height)));
    };
    window.addEventListener("message", on);
    return () => window.removeEventListener("message", on);
  }, [src]);
  return <div className="overflow-hidden rounded-2xl ring-1 ring-slate-200" style={{ height: h }}>
    <iframe src={src} title={title} className="h-full w-full border-0" scrolling="no" loading="lazy" />
  </div>;
}
