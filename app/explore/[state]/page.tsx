import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "../../components/site/Header";
import SiteFooter from "../../components/site/Footer";
import ExploreMap from "../../components/explore/ExploreMap";
import StatePicker from "../../components/explore/StatePicker";
import OwnerCta from "../../components/explore/OwnerCta";
import AccountPill from "../../components/explore/AccountPill";
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
      {/* Nov 18 (per Mely): Dockwa-style full-screen search — map fills the screen, list and filters on the left */}
      <section className="pt-20 md:pt-24">
        <ExploreMap state={st} heading={
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#0891b2]"><a href="/explore" className="hover:underline">MelyOS Explore</a> · {s[0]}</p>
              <h1 className="text-xl font-black tracking-tight">Marinas, RV parks & campgrounds in {s[0]}</h1>
            </div>
            <AccountPill dark={false} />
          </div>
        } />
      </section>
      <OwnerCta />
      <SiteFooter />
    </main>
  );
}
