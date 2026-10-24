"use client";

import { useEffect, useState } from "react";

// Oct 23 (per Mely): cookie notice for melyos.io. Shown once per browser.
const KEY = "cookie_consent";

export default function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => { try { if (!localStorage.getItem(KEY)) setShow(true); } catch {} }, []);
  if (!show) return null;
  const choose = (v: string) => { try { localStorage.setItem(KEY, v); } catch {} setShow(false); if (v === "all") window.dispatchEvent(new Event("cookie-consent-all")); };
  return (
    <div role="dialog" aria-label="Cookies" className="fixed left-3 right-3 bottom-3 z-[1500] mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl text-sm text-[#071A33] flex flex-wrap items-center gap-3">
      <p className="flex-1 min-w-[280px] m-0 leading-relaxed">
        <b>Cookies.</b> melyos.io uses cookies needed for the site to work and, if you accept, a simple visit counter that helps us improve it. We don't sell or share cookies for advertising.{" "}
        <a href="/privacy" className="text-sky-700 underline">Privacy Policy</a>
      </p>
      <div className="flex gap-2 flex-wrap w-full sm:w-auto">
        <button type="button" onClick={() => choose("essential")} className="flex-1 sm:flex-none rounded-lg border border-slate-300 px-4 py-2.5 font-semibold">Only what's needed</button>
        <button type="button" onClick={() => choose("all")} className="flex-1 sm:flex-none rounded-lg bg-[#071A33] px-4 py-2.5 font-semibold text-white">Accept all</button>
      </div>
    </div>
  );
}
