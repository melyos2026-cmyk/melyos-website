"use client";

import { useState } from "react";
import { NAV, cta } from "./data";

export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <>
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-slate-200/70 bg-white/95 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-5 md:h-24 lg:px-8">
          <a href="/" aria-label="MelyOS home" className="flex items-center">
            <img src="/melyos-logo-trimmed.png" alt="MelyOS" className="h-[50px] w-auto object-contain md:h-[64px]" />
          </a>
          <nav className="hidden items-center gap-5 text-[15px] font-bold text-slate-700 lg:flex xl:gap-7">
            {NAV.map(([href, label]) => <a key={href} className="transition hover:text-[#08B8D8]" href={href}>{label}</a>)}
          </nav>
          <div className="hidden items-center gap-2 lg:flex xl:gap-3">
            <a href="https://admin.melyos.io" className="rounded-xl px-4 py-3 font-bold text-slate-700 transition hover:bg-slate-100 hover:text-[#08B8D8]">Login</a>
            <a href="/demo" className={`${cta} whitespace-nowrap px-5 xl:px-7`}>Book a Demo</a>
          </div>
          <button type="button" aria-label="Open navigation menu" aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((o) => !o)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-2xl transition hover:border-cyan-300 hover:bg-cyan-50 lg:hidden">
            {mobileMenuOpen ? "×" : "☰"}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white px-5 py-5 shadow-lg lg:hidden">
            <nav className="flex flex-col gap-4 font-bold text-slate-700">
              {NAV.map(([href, label]) => <a key={href} onClick={() => setMobileMenuOpen(false)} href={href}>{label}</a>)}
              <a href="https://admin.melyos.io">Login</a>
              <a onClick={() => setMobileMenuOpen(false)} href="/demo" className="mt-2 rounded-xl bg-[#08B8D8] px-5 py-3 text-center text-white">Book a Demo</a>
            </nav>
          </div>
        )}
      </header>

    </>
  );
}
