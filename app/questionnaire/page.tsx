import type { Metadata } from "next";
import SiteHeader from "../components/site/Header";
import SiteFooter from "../components/site/Footer";
import { TYPES, type QType } from "./questions";

// Nov 17 (per Mely): one easy link for the video and emails (melyos.io/questionnaire) — the prospect picks
// RV park, campground or marina and fills the clickable questionnaire for a custom quote.
// Still private: not in the menu, the sitemap or search engines.
export const metadata: Metadata = {
  title: "Get your custom quote",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

const ORDER: QType[] = ["rv", "campground", "marina"];
const ICON: Record<QType, string> = { rv: "🚐", campground: "🏕️", marina: "⚓" };

export default function Page() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#071A33]">
      <SiteHeader />
      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#079db9]">Custom quote</p>
          <h1 className="mt-3 text-4xl font-black sm:text-5xl">Tell us about your property</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">A short questionnaire, mostly clicks: how many spaces you have, what you charge, propane, and what you need. We use it to build your custom quote.</p>
        </div>
        <div className="mx-auto mt-10 grid max-w-4xl gap-5 sm:grid-cols-3">
          {ORDER.map((t) => (
            <a key={t} href={`/questionnaire/${t}`} className="group rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-sm transition hover:border-[#08B8D8] hover:shadow-md">
              <div className="text-4xl" aria-hidden>{ICON[t]}</div>
              <h2 className="mt-4 text-xl font-black">{TYPES[t].name}</h2>
              <span className="mt-5 inline-block rounded-xl bg-[#08B8D8] px-5 py-3 font-black text-white group-hover:bg-[#079db9]">Start</span>
            </a>
          ))}
        </div>
        <p className="mt-10 text-center text-slate-600">Questions? Email <a className="font-bold underline" href="mailto:info@melyos.io">info@melyos.io</a>.</p>
      </section>
      <SiteFooter />
    </main>
  );
}
