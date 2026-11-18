import fs from "fs";
import path from "path";
import SiteHeader from "../components/site/Header";
import SiteFooter from "../components/site/Footer";
import OwnerCta from "../components/explore/OwnerCta";
import AccountPill from "../components/explore/AccountPill";
import { STATES } from "../components/explore/states";

// Nov 18 (per Mely): one landing page per thing people search for — "Search Marinas", "Search RV Parks",
// "Search Campgrounds" (Dockwa-style), each linking into every state's map filtered to that kind.
export type Kind = "m" | "r" | "c";
export const KINDS: Record<Kind, { slug: string; plural: string; title: string; lead: string; software: string; softwareHref: string; img: string; noun: string }> = {
  m: { slug: "marinas", plural: "Marinas", noun: "slip", title: "Search marinas across the U.S.", lead: "Find a marina by state or city, see it on the map, and request a slip or mooring in one tap — free for boaters.", software: "Marina management software", softwareHref: "/marina-software", img: "/hero-marina-2026.jpg" },
  r: { slug: "rv-parks", plural: "RV Parks", noun: "site", title: "Search RV parks across the U.S.", lead: "Find RV parks and resorts by state or city, see them on the map, and request a site for your rig — free for RVers.", software: "RV park management software", softwareHref: "/rv-park-software", img: "/hero-marina-2026.jpg" },
  c: { slug: "campgrounds", plural: "Campgrounds", noun: "site", title: "Search campgrounds across the U.S.", lead: "Find campgrounds by state or city — tent, cabin and RV camping — and request a site in one tap. Free for campers.", software: "Campground management software", softwareHref: "/campground-software", img: "/hero-marina-2026.jpg" },
};

function loadIndex(): Record<string, { name: string; m: number; r: number; c: number }> {
  try { return JSON.parse(fs.readFileSync(path.join(process.cwd(), "public/explore/index.json"), "utf8")); } catch { return {}; }
}

export default function KindLanding({ kind }: { kind: Kind }) {
  const k = KINDS[kind];
  const idx = loadIndex();
  const total = Object.values(idx).reduce((t, s) => t + (s[kind] || 0), 0);
  const states = Object.keys(STATES).filter((s) => idx[s]?.[kind]).sort((a, b) => (idx[b][kind] - idx[a][kind]));
  const other = (Object.keys(KINDS) as Kind[]).filter((x) => x !== kind);
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#071A33]">
      <SiteHeader />
      <section className="overflow-hidden bg-[radial-gradient(ellipse_at_70%_40%,#0b3b6b_0%,#06182e_60%)] pt-20 text-white md:pt-24">
        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-5 py-14 md:py-20 lg:grid-cols-[1fr_520px] lg:px-8">
          {/* Nov 18 (per Mely): glowing U.S. map with routes into Kissimmee, Florida (public/explore/us-glow.svg) */}
          <img src="/explore/us-glow.svg" alt="" aria-hidden className="pointer-events-none order-first mx-auto w-full max-w-md opacity-90 lg:order-last lg:max-w-none" />
          <div>
          <p className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-[#39d5ee]"><a href="/explore" className="hover:underline">MelyOS Explore</a> · {k.plural}</p>
          <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">{k.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{total ? `${total.toLocaleString()} ${k.plural.toLowerCase()} on the map. ` : ""}{k.lead}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={`/explore/fl?type=${kind}`} className="rounded-xl bg-[#08B8D8] px-6 py-3 font-black text-white">Search {k.plural} in Florida</a>
            <AccountPill />
          </div>
          <div className="mt-6 flex flex-wrap gap-2 text-sm font-bold">
            {other.map((o) => <a key={o} href={`/explore/${KINDS[o].slug}`} className="rounded-full border border-white/25 px-3 py-1.5 text-slate-200 hover:bg-white/10">Search {KINDS[o].plural}</a>)}
          </div>
          </div>
        </div>
      </section>
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <h2 className="text-3xl font-black tracking-tight">{k.plural} by state</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {states.map((s) => (
              <a key={s} href={`/explore/${s.toLowerCase()}?type=${kind}`} className="group rounded-2xl border border-slate-200 p-5 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-lg">
                <div className="text-xs font-black tracking-[0.2em] text-[#0891b2]">{s}</div>
                <div className="mt-1 text-xl font-black">{STATES[s][0]}</div>
                <div className="mt-2 text-sm text-slate-600">{idx[s][kind].toLocaleString()} {k.plural.toLowerCase()}</div>
                <span className="mt-2 inline-block text-sm font-black text-[#0891b2] group-hover:underline">See the map →</span>
              </a>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-slate-50 py-14">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-5 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0891b2]">For owners</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight">{k.software}</h2>
            <p className="mt-3 text-slate-600">Your live {k.noun} map, online booking and payments, contracts, screening and an AI assistant — in one system, already running here in Kissimmee.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={k.softwareHref} className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-black">See the software</a>
            <a href="/demo" className="rounded-xl bg-[#071A33] px-6 py-3 font-black text-white">Book a Demo</a>
          </div>
        </div>
      </section>
      <OwnerCta />
      <SiteFooter />
    </main>
  );
}
