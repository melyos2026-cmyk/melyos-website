import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import SiteHeader from "../components/site/Header";
import SiteFooter from "../components/site/Footer";
import StatePicker from "../components/explore/StatePicker";
import OwnerCta from "../components/explore/OwnerCta";
import { STATES } from "../components/explore/states";

// Oct 21 (per Mely): MelyOS Explore — marinas, RV parks and campgrounds in every state.
export const metadata: Metadata = {
  title: "Explore Marinas, RV Parks & Campgrounds",
  description: "MelyOS Explore: find marinas, RV parks and campgrounds in every U.S. state on an interactive map. Owners can claim their listing for free.",
  alternates: { canonical: "/explore" },
};

const FEATURED = ["FL", "GA", "SC", "NC", "TX", "CA", "AL", "TN"];

function loadIndex(): Record<string, { name: string; m: number; r: number; c: number }> {
  try { return JSON.parse(fs.readFileSync(path.join(process.cwd(), "public/explore/index.json"), "utf8")); } catch { return {}; }
}

export default function Page() {
  const idx = loadIndex();
  const total = Object.values(idx).reduce((t, s) => t + s.m + s.r + s.c, 0);
  const all = Object.keys(STATES).sort((a, b) => STATES[a][0].localeCompare(STATES[b][0]));
  const card = (st: string, big = false) => {
    const s = idx[st];
    return (
      <a key={st} href={`/explore/${st.toLowerCase()}`} className={`group relative block overflow-hidden rounded-3xl bg-gradient-to-br from-[#06182e] via-[#0b3a5e] to-[#0e7490] p-6 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${big ? "min-h-[170px]" : "min-h-[120px]"}`}>
        <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/5" />
        <div className="text-xs font-black tracking-[0.2em] text-cyan-200">{st}</div>
        <div className={`mt-1 font-black ${big ? "text-3xl" : "text-xl"}`}>{STATES[st][0]}</div>
        {s ? <div className="mt-3 text-sm text-slate-200">{s.m.toLocaleString()} marinas · {s.r.toLocaleString()} RV parks · {s.c.toLocaleString()} campgrounds</div>
           : <div className="mt-3 text-sm text-slate-300">Coming soon</div>}
        <span className="mt-3 inline-block text-sm font-black text-cyan-200 group-hover:underline">Explore the map →</span>
      </a>
    );
  };
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#071A33]">
      <SiteHeader />
      <section className="bg-[#06182e] pt-20 text-white md:pt-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 md:py-20 lg:grid-cols-[1.1fr_1fr] lg:px-8">
          <div>
          <p className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-[#39d5ee]">MelyOS Explore</p>
          <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">Find marinas, RV parks and campgrounds across the U.S.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{total ? `${total.toLocaleString()} places on the map so far. ` : ""}Pick a state to see every marina, RV park and campground on an interactive map.</p>
          <div className="mt-8 flex flex-wrap items-center gap-3"><StatePicker /><a href="/explore/fl" className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 font-black text-white transition hover:bg-white/20">Start with Florida</a></div>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute -inset-5 rounded-[36px] bg-cyan-400/20 blur-3xl" />
            <img src="/hero-marina-2026.jpg" alt="" className="relative aspect-[16/10] w-full rounded-[28px] border border-white/15 object-cover shadow-2xl" />
          </div>
        </div>
      </section>
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Popular regions</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{FEATURED.map((s) => card(s, true))}</div>
          <h2 className="mt-16 text-2xl font-black tracking-tight">All states</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{all.filter((s) => !FEATURED.includes(s)).map((s) => card(s))}</div>
          <p className="mt-10 text-xs text-slate-500">Map data © <a className="underline" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors, available under the Open Database License. Listings are public information and may be incomplete; owners can claim and correct theirs for free.</p>
        </div>
      </section>
      <OwnerCta />
      <SiteFooter />
    </main>
  );
}
