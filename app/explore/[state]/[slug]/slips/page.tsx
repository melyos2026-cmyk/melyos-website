import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "../../../../components/site/Header";
import SiteFooter from "../../../../components/site/Footer";
import AccountPill from "../../../../components/explore/AccountPill";
import SlipMap from "../../../../components/explore/SlipMap";
import { tidySlips } from "../../../../components/explore/tidy";
import { STATES, KIND } from "../../../../components/explore/states";
import { exploreApi, findListing, keyFromSlug, listingPath, nice, draftMap } from "../../../../lib/explore";

// Nov 17 (per Mely): /explore/{st}/{place}/slips — the place's slips/sites over its satellite photo; boaters tap one
// and request it. ?edit=TOKEN opens the editor (link from Insights → Explore → Slip maps). Not indexed yet.
export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: true } };

export default async function Page({ params, searchParams }: { params: Promise<{ state: string; slug: string }>; searchParams: Promise<{ edit?: string }> }) {
  const { state, slug } = await params;
  const { edit } = await searchParams;
  const st = state.toUpperCase();
  if (!STATES[st]) notFound();
  const row = await findListing(st, keyFromSlug(slug));
  if (!row) notFound();
  const r = await exploreApi<any>("slipmap", { listing_key: row[7], edit: edit || "" });
  const editor = !!r.data?.editor;
  if (!r.data?.map && !editor) notFound();
  // Nov 17: no saved map yet -> start the editor from the OpenStreetMap draft (scripts/osm/build_drafts.py), if any
  const draft = !r.data?.map && editor ? await draftMap(st, row[7]) : null;
  if (draft?.slips?.length) draft.slips = tidySlips(draft.slips, draft.roads || [], draft.docks || []); // Aloha-style rows
  const saved = r.data?.map ? { ...r.data.map, ...(r.data.map.layers || {}) } : null;
  const m = saved || (draft ? { ...draft, intro: "", published: false } : { center_lat: row[2], center_lon: row[3], zoom: 19, slips: [], intro: "", published: false });
  const name = nice(row[1]), k = KIND[row[0]], unit = row[0] === "m" ? "slip" : "site";
  const info = (await exploreApi<any>("listing", { listing_key: row[7] })).data?.info || {};
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#071A33]">
      <SiteHeader />
      <section className="bg-[#06182e] pt-20 text-white md:pt-24">
        <div className="mx-auto max-w-6xl px-5 py-8 lg:px-8">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-[#39d5ee]"><a href="/explore" className="hover:underline">MelyOS Explore</a> · <a href={`/explore/${st.toLowerCase()}`} className="hover:underline">{STATES[st][0]}</a> · {k.plural}</p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black md:text-5xl">{name} — {unit} map</h1>
              <p className="mt-2 max-w-2xl text-slate-300">{m.intro || `Tap a ${unit} to see its size and what makes it special, then request it. ${name} confirms availability and price with you.`}</p>
            </div>
            <div className="flex gap-2"><a href={listingPath(st, row)} className="rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-black">← Details & reviews</a><AccountPill /></div>
          </div>
          {draft && <p className="mt-4 rounded-lg bg-sky-400/15 px-3 py-2 text-sm font-bold text-sky-200">Auto draft from OpenStreetMap — {draft.quality === "mapped" ? `${draft.slips.length} ${unit}s mapped by the community` : `${draft.slips.length} ${unit}s ESTIMATED along the docks`}. Check every one against the photo, fix numbers and sizes, delete what's wrong, then save.</p>}
          {editor && !m.published && <p className="mt-4 inline-block rounded-lg bg-amber-400/20 px-3 py-1.5 text-sm font-bold text-amber-200">Draft — only people with your edit link see it. Check “Public” and save to publish.</p>}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-8 lg:px-8">
        <SlipMap state={st} listing_key={row[7]} listing_name={name} kind={row[0]} phone={info.phone || row[5]} map={m} edit={editor ? edit : null} />
      </section>
      <SiteFooter />
    </main>
  );
}
