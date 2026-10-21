import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "../../components/site/Header";
import SiteFooter from "../../components/site/Footer";
import ExploreMap from "../../components/explore/ExploreMap";
import StatePicker from "../../components/explore/StatePicker";
import OwnerCta from "../../components/explore/OwnerCta";
import { STATES } from "../../components/explore/states";

export function generateStaticParams() {
  return Object.keys(STATES).map((s) => ({ state: s.toLowerCase() }));
}

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const { state } = await params;
  const s = STATES[state.toUpperCase()];
  if (!s) return {};
  return {
    title: `Marinas, RV Parks & Campgrounds in ${s[0]}`,
    description: `Interactive map of marinas, RV parks and campgrounds in ${s[0]}. Search by name or city. Owners can claim their listing for free on MelyOS Explore.`,
    alternates: { canonical: `/explore/${state.toLowerCase()}` },
  };
}

export default async function Page({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  const st = state.toUpperCase();
  const s = STATES[st];
  if (!s) notFound();
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#071A33]">
      <SiteHeader />
      <section className="bg-[#06182e] pt-20 text-white md:pt-24">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-6 px-5 py-10 lg:px-8">
          <div>
            <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-[#39d5ee]"><a href="/explore" className="hover:underline">MelyOS Explore</a> · {s[0]}</p>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Marinas, RV parks & campgrounds in {s[0]}</h1>
          </div>
          <StatePicker current={st} />
        </div>
      </section>
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <ExploreMap state={st} />
          <p className="mt-4 text-xs text-slate-500">Map data © <a className="underline" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors (ODbL). Listings are public information and may be incomplete; owners can claim and correct theirs for free.</p>
        </div>
      </section>
      <OwnerCta />
      <SiteFooter />
    </main>
  );
}
