import type { Metadata } from "next";
import SiteHeader from "../../components/site/Header";
import SiteFooter from "../../components/site/Footer";
import ClaimForm from "../../components/explore/ClaimForm";
import { STATES, KIND } from "../../components/explore/states";
import { findListing, nice } from "../../lib/explore";

// Nov 17 (per Mely): an owner / manager claims a listing on MelyOS Explore and sends the correct info.
export const metadata: Metadata = { title: "Claim your listing — MelyOS Explore", robots: { index: false } };
export default async function Page({ searchParams }: { searchParams: Promise<{ state?: string; key?: string }> }) {
  const sp = await searchParams;
  const st = String(sp.state || "").toUpperCase();
  const row = STATES[st] ? await findListing(st, String(sp.key || "")) : null;
  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-50 text-[#071A33]">
      <SiteHeader />
      <section className="pt-24"><div className="mx-auto max-w-2xl px-5 py-10">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0284c7]">MelyOS Explore · For owners</p>
        {!row ? <><h1 className="mt-1 text-3xl font-black">Find your property first</h1><p className="mt-3 text-slate-600">Open your state on the <a className="font-bold text-[#0284c7] underline" href="/explore">Explore map</a>, tap your marina, RV park or campground and choose "Claim it free".</p></>
          : <><h1 className="mt-1 text-3xl font-black">Claim {nice(row[1])}</h1>
            <p className="mt-2 text-slate-600">{KIND[row[0]].label} · {row[4] ? `${row[4]}, ` : ""}{STATES[st][0]}. Free. After we confirm it with you (1–2 business days), your info shows on the map and {row[0] === "m" ? "slip" : "site"} requests come straight to your email.</p>
            {/* Nov 19 (per Mely): the owners video, so they see what claiming does for them */}
            <details className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-slate-200" open>
              <summary className="cursor-pointer text-sm font-black text-[#0F2A4A]">See how it works (40 seconds)</summary>
              <video className="mx-auto mt-3 aspect-[9/16] w-full max-w-[260px] rounded-2xl bg-black" src="/video/melyos-explore-owners.mp4?v=3" poster="/video/melyos-explore-owners.jpg" controls playsInline preload="metadata" />
            </details>
            <ClaimForm state={st} listingKey={row[7]} phone={row[5]} website={row[6]} kind={row[0]} /></>}
      </div></section>
      <SiteFooter />
    </main>
  );
}
