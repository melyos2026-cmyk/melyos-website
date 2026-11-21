import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import { notFound, permanentRedirect } from "next/navigation";
import SiteHeader from "../../../components/site/Header";
import SiteFooter from "../../../components/site/Footer";
import AccountPill from "../../../components/explore/AccountPill";
import { FavoriteButton, Fuel, RequestForm, Reviews } from "../../../components/explore/ListingActions";
import { STATES, KIND } from "../../../components/explore/states";
import { isFeatured, FEATURED_MAP, DEMO_MAP } from "../../../components/explore/featured";
import LiveMap from "../../../components/explore/LiveMap";
import SpotMap from "../../../components/explore/SpotMap";
import { exploreApi, findListing, keyFromSlug, listingPath, nice } from "../../../lib/explore";

// Nov 17 (per Mely): one page per marina / RV park / campground on MelyOS Explore (≈24,000 pages):
// details, ♡ Save, Request a slip / site, reviews, and "Is this yours? Claim it". Owner info (approved claims)
// comes from admin.melyos.io and wins over the public map data.
export const revalidate = 3600;

// Nov 18 (per Mely): the place's own website preview picture when the owner hasn't added one (scripts/photos)
function sitePhoto(st: string, key: string): string {
  try { const u = JSON.parse(fs.readFileSync(path.join(process.cwd(), `public/explore/photos_${st}.json`), "utf8"))[key]; return typeof u === "string" && /^https:\/\//.test(u) ? u : ""; } catch { return ""; }
}

async function load(stateParam: string, slug: string) {
  const st = stateParam.toUpperCase();
  if (!STATES[st]) return null;
  const row = await findListing(st, keyFromSlug(slug));
  if (!row) return null;
  const extra = await exploreApi<any>("listing", { listing_key: row[7] });
  return { st, row, info: (extra.ok && extra.data.info) || {}, verified: !!extra.data?.verified, client: !!extra.data?.client, avg: extra.data?.avg ?? null, count: extra.data?.count || 0, slipmap: !!extra.data?.slipmap, fuel: extra.data?.fuel || null };
}

export async function generateMetadata({ params }: { params: Promise<{ state: string; slug: string }> }): Promise<Metadata> {
  const { state, slug } = await params;
  const d = await load(state, slug);
  if (!d) return {};
  const name = nice(d.row[1]), k = KIND[d.row[0]], place = `${d.row[4] ? `${d.row[4]}, ` : ""}${STATES[d.st][0]}`;
  return {
    title: `${name} — ${k.label} in ${place}`,
    description: `${name}: ${k.label.toLowerCase()} in ${place}. See details${d.count ? `, ${d.count} reviews` : " and reviews"}, and request a ${d.row[0] === "m" ? "slip" : "site"} for free on MelyOS Explore.`,
    alternates: { canonical: listingPath(d.st, d.row) },
  };
}

export default async function Page({ params, searchParams }: { params: Promise<{ state: string; slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { state, slug } = await params;
  const demoId = (await searchParams).demo;
  const d = await load(state, slug);
  if (!d) notFound();
  const { st, row, info } = d;
  const canonical = listingPath(st, row);
  if (`/explore/${state}/${slug}` !== canonical) permanentRedirect(canonical);
  const name = nice(row[1]), k = KIND[row[0]], unit = row[0] === "m" ? "slip" : "site";
  const phone = info.phone || row[5], website = info.website || row[6];
  const feat = isFeatured(row);
  const demoMap = demoId === row[7] ? DEMO_MAP[row[7]] || "" : "";
  const liveMap = demoMap || FEATURED_MAP[row[7]] || (d.client && typeof info.map_url === "string" && /^https:\/\//.test(info.map_url) ? info.map_url : "");
  const L = { state: st, listing_key: row[7], listing_name: name, kind: row[0] };
  const stays: string[] = Array.isArray(info.stay_types) ? info.stay_types : [];
  const facts: [string, string][] = ([["Spaces", info.spaces], ["Max length", info.max_length], ["Rates", info.rates], ["Amenities", info.amenities]] as [string, string][]).filter(([, v]) => v);
  const ld = { "@context": "https://schema.org", "@type": row[0] === "c" ? "Campground" : row[0] === "r" ? "RVPark" : "LocalBusiness", name,
    address: { "@type": "PostalAddress", addressLocality: row[4] || undefined, addressRegion: st, addressCountry: "US" }, geo: { "@type": "GeoCoordinates", latitude: row[2], longitude: row[3] },
    ...(phone ? { telephone: phone } : {}), ...(website ? { url: website } : {}), ...(d.avg ? { aggregateRating: { "@type": "AggregateRating", ratingValue: d.avg, reviewCount: d.count } } : {}) };
  const bbox = `${row[3] - 0.012},${row[2] - 0.008},${row[3] + 0.012},${row[2] + 0.008}`;
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#071A33]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <SiteHeader />
      <section className="bg-[#06182e] pt-20 text-white md:pt-24">
        <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-[#39d5ee]"><a href="/explore" className="hover:underline">MelyOS Explore</a> · <a href={`/explore/${st.toLowerCase()}`} className="hover:underline">{STATES[st][0]}</a> · {k.plural}</p>
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <h1 className="text-3xl font-black tracking-tight sm:text-5xl">{name}</h1>
              <p className="mt-2 text-lg text-slate-300">{k.label} · {row[4] ? `${row[4]}, ` : ""}{STATES[st][0]}
                {d.avg != null && <> · <span className="text-amber-400">★</span> {d.avg.toFixed(1)} ({d.count})</>}
                {(d.verified || feat) && <span className="ml-2 rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-black text-emerald-300">✓ {feat || d.client ? "Runs on MelyOS" : "Verified by owner"}</span>}</p>
            </div>
            <div className="flex flex-wrap gap-2"><FavoriteButton {...L} /><AccountPill /></div>
          </div>
        </div>
      </section>
      {/* Nov 20 (per Mely): the live map comes first and fills the screen; the request form sits next to it and
          talks to the map (dates fade taken sites; the site picked on the map comes into the form). */}
      {liveMap && <section id="live-map" className="scroll-mt-20 border-b border-slate-200 bg-slate-50 py-6">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-6">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0891b2]">Live {unit} map</p>
              <h2 className="text-2xl font-black md:text-3xl">Pick your {unit} and book online</h2>
            </div>
            <a href={liveMap} target="_blank" rel="noopener" className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-black">Open full screen ↗</a>
          </div>
          <div className={`grid gap-5 ${demoMap ? "md:grid-cols-[auto_340px] md:justify-center lg:grid-cols-[auto_400px]" : "md:grid-cols-[1fr_340px] lg:grid-cols-[1fr_400px]"}`}>
            <LiveMap src={liveMap} fixed={!!demoMap} title={`${name} — live ${unit} map`} />
            <aside id="request" className="scroll-mt-24">
              <div className="rounded-3xl border-2 border-[#08B8D8] bg-white p-5 shadow-sm md:sticky md:top-24">
                <h2 className="text-2xl font-black">Book your {unit}</h2>
                <p className="mb-3 mt-1 text-slate-600">Pick your dates and a {unit}, then book and pay online.</p>
                <RequestForm {...L} stays={stays} live />
              </div>
            </aside>
          </div>
        </div>
      </section>}
      <section className="py-10">
        <div className={`mx-auto grid max-w-6xl gap-8 px-5 lg:px-8 ${liveMap ? "" : "lg:grid-cols-[1fr_420px]"}`}>
          <div className="space-y-8">
            {/* Nov 18 (per Mely): the real photo + a big map side by side; no photo → the big map full width */}
            {(() => {
              const ph = typeof info.photo_url === "string" && /^https:\/\//.test(info.photo_url) ? info.photo_url : sitePhoto(st, row[7]);
              return (
                ph ? <div className="grid gap-3 sm:grid-cols-2">
                  <img src={ph} alt={name} referrerPolicy="no-referrer" className="h-80 w-full rounded-3xl object-cover" />
                  <div className="h-80"><SpotMap lat={row[2]} lon={row[3]} name={name} color={k.color} /></div>
                </div> : <div className="h-[420px]"><SpotMap lat={row[2]} lon={row[3]} name={name} color={k.color} /></div>
              );
            })()}
            <div className="flex flex-wrap gap-2">
              {phone && <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="rounded-xl border border-slate-300 px-4 py-2.5 font-black">☎ {phone}</a>}
              {website && <a href={website} target="_blank" rel="noopener nofollow" className="rounded-xl border border-slate-300 px-4 py-2.5 font-black">🌐 Website</a>}
              <a href={`https://www.google.com/maps/dir/?api=1&destination=${row[2]},${row[3]}`} target="_blank" rel="noopener" className="rounded-xl border border-slate-300 px-4 py-2.5 font-black">🧭 Directions</a>
              {liveMap ? <a href="#live-map" className="rounded-xl bg-[#08B8D8] px-4 py-2.5 font-black text-white">Book online</a>
                : typeof info.booking_url === "string" && /^https:\/\//.test(info.booking_url) ? <a href={info.booking_url} target="_blank" rel="noopener" className="rounded-xl bg-[#08B8D8] px-4 py-2.5 font-black text-white">Book online</a>
                : feat && website && <a href={website} target="_blank" rel="noopener" className="rounded-xl bg-[#08B8D8] px-4 py-2.5 font-black text-white">Book online</a>}
            </div>
              {/* Nov 18 (per Mely): the owner pitch — make them want to claim it (left column, right under the photo/map, so the page reads full) */}
              {!feat && !d.verified && <div className="overflow-hidden rounded-3xl bg-[#071A33] text-white shadow-xl ring-1 ring-[#08B8D8]/30">
                <div className="relative">
                  <img src={row[0] === "m" ? "/interactive-slips-2026.jpg" : "/map-reservations-2026.jpg"} alt={`A live ${unit} map with online booking, built by MelyOS`} className="h-52 w-full object-cover opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071A33] via-[#071A33]/30 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-[#08B8D8] px-3 py-1 text-[11px] font-black uppercase tracking-wider">Free for owners</span>
                </div>
                <div className="p-6 pt-2">
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-[#39d5ee]">Is this your {k.label.toLowerCase()}?</p>
                  <p className="mt-2 text-2xl font-black leading-tight">Turn this page into bookings for {name}</p>
                  <p className="mt-2 text-slate-300">Guests are already finding you here. Claim your listing free and make it work for you:</p>
                  <ul className="mt-4 grid gap-3 text-[15px] sm:grid-cols-2">
                    {[
                      ["📸", "Your photos, rates and amenities", "Look your best next to everyone else on the map."],
                      ["📩", `${unit[0].toUpperCase() + unit.slice(1)} requests straight to you`, "Straight to your email — no middleman, no commission."],
                      ["✅", "Verified badge & reviews", "Stand out as the official, up-to-date listing."],
                      ["🗺️", `Your live ${unit} map with online booking`, `Guests pick their ${unit} and pay online — powered by MelyOS.`],
                    ].map(([i, t, d2]) => (
                      <li key={t} className="flex gap-3"><span className="text-xl leading-6" aria-hidden>{i}</span><span><b className="block">{t}</b><span className="text-sm text-slate-400">{d2}</span></span></li>
                    ))}
                  </ul>
                  <a href={`/explore/claim?state=${st}&key=${encodeURIComponent(row[7])}`} className="mt-5 block rounded-2xl bg-[#08B8D8] px-5 py-4 text-center text-lg font-black text-white shadow-lg shadow-cyan-500/30 transition hover:bg-[#06a3c0]">Claim {name} free →</a>
                  <p className="mt-2 text-center text-xs text-slate-400">Takes 2 minutes · No credit card · We confirm it with you in 1–2 business days</p>
                  <a href="/#demo" className="mt-3 block text-center text-sm font-bold text-[#39d5ee] hover:underline">Want the live {unit} map? Book a free demo</a>
                </div>
              </div>}
            {(info.description || facts.length > 0) && <div className="rounded-3xl border border-slate-200 p-6">
              {info.description && <p className="whitespace-pre-line text-lg leading-8 text-slate-700">{info.description}</p>}
              {facts.length > 0 && <dl className="mt-4 grid gap-3 sm:grid-cols-2">{facts.map(([a, b]) => <div key={a} className="rounded-xl bg-slate-50 p-3"><dt className="text-xs font-black uppercase tracking-wider text-slate-500">{a}</dt><dd className="mt-1 font-bold">{b}</dd></div>)}</dl>}
            </div>}
            {row[0] === "m" && <Fuel {...L} fuel={d.fuel} />}
            <Reviews {...L} />
          </div>
          {!liveMap && <aside>
            <div id="request" className="rounded-3xl border-2 border-[#08B8D8] p-6 shadow-sm lg:sticky lg:top-24">
              <h2 className="text-2xl font-black">Request a {unit}</h2>
              <p className="mb-4 mt-1 text-slate-600">Tell {name} your dates and {row[0] === "m" ? "boat" : "rig"}. Free, no account needed.</p>
              {liveMap && <a href="#live-map" className="mb-4 block rounded-xl bg-[#071A33] px-4 py-3 text-center font-black text-white">Book instantly on the live map ↑</a>}
              {!liveMap && d.slipmap && <a href={`${canonical}/slips`} className="mb-4 block rounded-xl bg-[#071A33] px-4 py-3 text-center font-black text-white">Pick your {unit} on the map →</a>}
              <RequestForm {...L} stays={stays} />
            </div>
          </aside>}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
