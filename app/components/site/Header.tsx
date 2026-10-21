"use client";

// Oct 21 (per Mely): Dockwa-style menu. Desktop: each item opens a drop-down on hover
// (or click/keyboard); "Who we serve" has a side panel per group. Mobile: the ☰ menu
// shows each section, opening and closing with a tap.
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { MENU, cta, type MenuItem, type MenuLink } from "./data";

function LinkRow({ l, onClick }: { l: MenuLink; onClick?: () => void }) {
  return (
    <a href={l.href} onClick={onClick} className={`group flex ${l.note ? "items-start" : "items-center"} gap-3 rounded-xl px-3 py-2.5 transition hover:bg-cyan-50`}>
      {l.icon && <span className={`${l.note ? "mt-0.5 " : ""}flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-[#079db9] transition group-hover:bg-white`}><l.icon className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden /></span>}
      <span className="min-w-0">
        <span className="block text-[14px] font-bold leading-5 text-[#071A33] group-hover:text-[#079db9]">{l.label}</span>
        {l.note && <span className="block text-[12.5px] font-medium leading-5 text-slate-500">{l.note}</span>}
      </span>
    </a>
  );
}

function DesktopPanel({ item, close }: { item: MenuItem; close: () => void }) {
  const [group, setGroup] = useState(0);
  if (item.groups) {
    const g = item.groups[group];
    return (
      <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
        <div className="w-52 bg-slate-50 p-2">
          {item.groups.map((x, i) => (
            <button key={x.label} type="button" onMouseEnter={() => setGroup(i)} onFocus={() => setGroup(i)} onClick={() => setGroup(i)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[14px] font-bold transition ${i === group ? "bg-[#0b2545] text-white" : "text-slate-700 hover:bg-white"}`}>
              {x.label}<ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          ))}
        </div>
        <div className="w-72 p-2">{g.links.map((l) => <LinkRow key={l.label} l={l} onClick={close} />)}</div>
      </div>
    );
  }
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/10 ${item.wide ? "grid w-[620px] grid-cols-2 gap-x-1" : "w-64"}`}>
      {item.links!.map((l) => <LinkRow key={l.label} l={l} onClick={close} />)}
      {item.wide && (
        <a href="/features" onClick={close} className="col-span-2 mt-1 flex items-center justify-between rounded-xl bg-[#06182e] px-4 py-3 text-[14px] font-bold text-white transition hover:bg-[#0b2545]">
          See the whole platform <ChevronRight className="h-4 w-4" aria-hidden />
        </a>
      )}
    </div>
  );
}

export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Close on Escape or a click outside the menu.
  useEffect(() => {
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(null); };
    const click = (e: MouseEvent) => { if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null); };
    document.addEventListener("keydown", key); document.addEventListener("mousedown", click);
    return () => { document.removeEventListener("keydown", key); document.removeEventListener("mousedown", click); };
  }, []);
  const enter = (label: string) => { if (timer.current) clearTimeout(timer.current); setOpen(label); };
  const leave = () => { if (timer.current) clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(null), 160); };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-slate-200/70 bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-5 md:h-24 lg:px-8">
        <a href="/" aria-label="MelyOS home" className="flex items-center">
          <img src="/melyos-logo-trimmed.png" alt="MelyOS" className="h-[50px] w-auto object-contain md:h-[64px]" />
        </a>
        <nav ref={navRef} aria-label="Main" className="hidden items-center gap-1 text-[15px] font-bold text-slate-700 lg:flex xl:gap-2">
          {MENU.map((m) =>
            m.href ? (
              <a key={m.label} href={m.href} className="rounded-lg px-2.5 py-2 transition hover:text-[#08B8D8] xl:px-3">{m.label}</a>
            ) : (
              <div key={m.label} className="relative" onMouseEnter={() => enter(m.label)} onMouseLeave={leave}>
                <button type="button" aria-expanded={open === m.label} aria-haspopup="true" onClick={() => setOpen(open === m.label ? null : m.label)}
                  className={`flex items-center gap-1 rounded-lg px-2.5 py-2 transition hover:text-[#08B8D8] xl:px-3 ${open === m.label ? "text-[#08B8D8]" : ""}`}>
                  {m.label}<ChevronDown className={`h-4 w-4 transition ${open === m.label ? "rotate-180" : ""}`} aria-hidden />
                </button>
                {open === m.label && (
                  <div className={`absolute top-full pt-3 ${m.wide ? "left-1/2 -translate-x-1/2" : "left-0"}`}>
                    <DesktopPanel item={m} close={() => setOpen(null)} />
                  </div>
                )}
              </div>
            )
          )}
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
        <div className="max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-slate-200 bg-white px-4 py-3 shadow-lg lg:hidden">
          <nav aria-label="Main" className="flex flex-col font-bold text-slate-700">
            {MENU.map((m) =>
              m.href ? (
                <a key={m.label} href={m.href} onClick={() => setMobileMenuOpen(false)} className="border-b border-slate-100 px-1 py-3.5">{m.label}</a>
              ) : (
                <div key={m.label} className="border-b border-slate-100">
                  <button type="button" aria-expanded={mobileOpen === m.label} onClick={() => setMobileOpen(mobileOpen === m.label ? null : m.label)} className="flex w-full items-center justify-between px-1 py-3.5">
                    {m.label}<ChevronDown className={`h-4 w-4 transition ${mobileOpen === m.label ? "rotate-180" : ""}`} aria-hidden />
                  </button>
                  {mobileOpen === m.label && (
                    <div className="pb-3">
                      {(m.groups || [{ label: "", links: m.links! }]).map((g) => (
                        <div key={g.label || "all"}>
                          {g.label && <p className="px-3 pb-1 pt-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#08B8D8]">{g.label}</p>}
                          {g.links.map((l) => <LinkRow key={l.label} l={l} onClick={() => setMobileMenuOpen(false)} />)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            )}
            <a href="https://admin.melyos.io" className="px-1 py-3.5">Login</a>
            <a onClick={() => setMobileMenuOpen(false)} href="/demo" className="mt-1 rounded-xl bg-[#08B8D8] px-5 py-3 text-center text-white">Book a Demo</a>
          </nav>
        </div>
      )}
    </header>
  );
}
