"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Oct 24 (per Mely): the "simple visit counter" the cookie notice promises. Counts a page view in
// MelyOS Insights ONLY when the visitor chose "Accept all". No IP, no name: page, referrer site,
// campaign tags and a random id kept in this browser.
const ADMIN = process.env.NEXT_PUBLIC_MELYOS_ADMIN_ORIGIN || "https://admin.melyos.io";

function send(path: string) {
  try {
    if (localStorage.getItem("cookie_consent") !== "all") return;
    let id = localStorage.getItem("mos_vid");
    if (!id) { id = (crypto.randomUUID?.() || String(Math.random()).slice(2)); localStorage.setItem("mos_vid", id); }
    const q = new URLSearchParams(window.location.search);
    fetch(`${ADMIN}/api/public/melyos-site`, {
      method: "POST", headers: { "Content-Type": "application/json" }, keepalive: true,
      body: JSON.stringify({ type: "view", path, referrer: document.referrer, utm_source: q.get("utm_source"), utm_campaign: q.get("utm_campaign"), visitor_id: id, lang: navigator.language }),
    }).catch(() => {});
  } catch { /* storage blocked: count nothing */ }
}

export default function SiteTracker() {
  const pathname = usePathname();
  useEffect(() => { send(pathname || "/"); }, [pathname]);
  // Count the page they're on right when they accept.
  useEffect(() => {
    const on = () => send(window.location.pathname);
    window.addEventListener("cookie-consent-all", on);
    return () => window.removeEventListener("cookie-consent-all", on);
  }, []);
  return null;
}
