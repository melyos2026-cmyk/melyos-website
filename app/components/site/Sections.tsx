import { eyebrow, h2, cta, features, rvParks, marinas, industries, steps, trust, CreditCard, BadgeCheck, Receipt, Scale, Caravan, Anchor } from "./data";
import type { LucideIcon } from "./data";
import { ArrowRight, Check, Plus } from "lucide-react";

export function FeaturesSection() {
  return (
    <>
      {/* Platform */}
      <section id="platform" className="scroll-mt-24 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className={eyebrow}>One connected platform</p>
            <h2 className={h2}>Everything your office does, in one system</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">Replace spreadsheets, paper contracts and disconnected tools. Every screen talks to the others, so a payment, a contract or a reservation is updated everywhere at once.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <article key={f.title} id={f.id} className="group scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:shadow-xl">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 transition group-hover:scale-110"><f.icon className="h-6 w-6 text-[#079db9]" strokeWidth={1.8} aria-hidden /></div>
                <h3 className="text-lg font-black">{f.title}</h3>
                <p className="mt-2 leading-7 text-slate-600">{f.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}

export function MapSection() {
  return (
    <>
      {/* Interactive map */}
      <section id="map" className="scroll-mt-24 bg-[#06182e] py-20 text-white md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-[#39d5ee]">Interactive property management</p>
            <h2 className={h2}>See your whole property at a glance</h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">We draw your real property as a live map. Your office manages it, and your customers use the same map on your website to choose their space and book it.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {["Live availability by date", "Color-coded status", "Tap a space for photo, size and hookups", "Filter by boat or RV length", "Book and pay from the map", "Same map in your office"].map((i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"><span className="text-[#39d5ee]">✓</span><span className="font-semibold">{i}</span></div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-5 rounded-[36px] bg-cyan-400/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[28px] border border-white/15 bg-white p-2 shadow-2xl">
              <img src="/interactive-slips-2026.jpg" alt="Interactive slip map with an available slip selected" className="aspect-[3/2] w-full rounded-2xl object-cover" />
            </div>
          </div>
        </div>
      </section>

    </>
  );
}

// Oct 29 (per Mely): the home page now shows short photo cards; this full list lives on
// /features (both) and on /rv-park-software and /marina-software (`only` = one list).
export function RvMarinaSection({ only }: { only?: "rv-parks" | "marinas" } = {}) {
  const all = [["rv-parks", Caravan, "RV parks & communities", rvParks, "#demo", "Request an RV park demo"], ["marinas", Anchor, "Marinas, private & municipal", marinas, "#demo", "Request a marina demo"]];
  const shown = only ? all.filter(([id]) => id === only) : all;
  return (
    <>
      {/* RV parks & marinas */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className={eyebrow}>Made for how you operate</p>
            <h2 className={h2}>{only === "rv-parks" ? "Built for RV parks." : only === "marinas" ? "Built for marinas." : "Built for RV parks. Built for marinas."}</h2>
          </div>
          <div className={only ? "mx-auto grid max-w-3xl gap-6" : "grid gap-6 lg:grid-cols-2"}>
            {shown.map(([id, icon, title, list, href, label]) => (
              <article key={id as string} id={id as string} className="scroll-mt-28 rounded-3xl border border-slate-200 bg-slate-50 p-7 md:p-9">
                <div className="flex items-center gap-3">{(() => { const I = icon as LucideIcon; return <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#071A33]"><I className="h-6 w-6 text-[#39d5ee]" strokeWidth={1.8} aria-hidden /></span>; })()}<h3 className="text-2xl font-black">{title as string}</h3></div>
                <ul className="mt-6 space-y-3">
                  {(list as string[]).map((i) => <li key={i} className="flex gap-3 text-slate-700"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-xs font-black text-[#079db9]">✓</span><span className="font-medium">{i}</span></li>)}
                </ul>
                <a href={href as string} className="mt-7 inline-block font-black text-[#079db9] hover:underline">{label as string} →</a>
              </article>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}

export function SeeItLiveSection() {
  return (
    <>
      {/* Live demos — by request only (per Mely: not public, to avoid copying) */}
      <section id="see-it-live" className="scroll-mt-24 bg-slate-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className={eyebrow}>See it live</p>
            <h2 className={h2}>A private live demo for your property type</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">After a short call, we give you access to a working MelyOS website and office with sample data: pick a space on the map, sign in as a customer, sign a contract, and see the admin your staff would use.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              ["RV park demo", "A full RV resort: interactive lot map, online booking, lease applications, resident portal and Mely.", "/hero-interactive-map.png"],
              ["Marina demo", "A full marina: slip map, boater accounts, contracts, fuel dock, ship store, dry stack and an office tour.", "/interactive-slips-2026.jpg"],
            ].map(([kind, text, img]) => (
              <article key={kind} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <img src={img} alt="" className="h-48 w-full object-cover" />
                <div className="p-7">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#08B8D8]">By request</p>
                  <h3 className="mt-2 text-2xl font-black">{kind}</h3>
                  <p className="mt-2 leading-7 text-slate-600">{text}</p>
                  <a href="/demo" className="mt-5 inline-block rounded-xl bg-[#071A33] px-5 py-3 font-black text-white transition hover:bg-[#0b2a4f]">Request access</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}

export function PortalSection() {
  return (
    <>
      {/* Portal */}
      <section id="portal" className="scroll-mt-24 py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2 lg:px-8">
          <div className="order-2 lg:order-1">
            <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-2xl">
              <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
                <div><p className="text-sm font-black text-slate-400">CUSTOMER PORTAL</p><p className="mt-1 text-xl font-black">Welcome back</p></div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">1 contract to sign</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[["Balance due", "$532.00"], ["Next payment", "Nov 1"], ["Contract", "Ready to sign"], ["Messages", "1 new"]].map(([l, v]) => (
                  <div key={l} className="rounded-2xl bg-slate-50 p-5"><p className="text-sm font-bold text-slate-500">{l}</p><p className="mt-2 text-xl font-black">{v}</p></div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl bg-[#08B8D8] p-5 text-white"><p className="font-black">Pay now</p><p className="mt-1 text-sm text-cyan-50">Secure online payment from any phone.</p></div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <p className={eyebrow}>Self-service for your customers</p>
            <h2 className={h2}>Fewer calls to the office</h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">Residents and boat owners sign in with their email and handle the everyday things themselves, any time of day.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {["See balances and pay by card or bank", "Set up autopay", "Read and sign contracts", "Download receipts and documents", "Send maintenance, launch or Rec Hall requests", "Read notices and message the office", "Buy, sell and offer services in the marketplace", "Use it in English, Spanish, Portuguese and more languages"].map((i) => (
                <div key={i} className="flex items-start gap-3"><span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-sm font-black text-[#079db9]">✓</span><span className="font-semibold text-slate-700">{i}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </>
  );
}

export function IndustriesSection() {
  return (
    <>
      {/* Industries */}
      <section id="industries" className="scroll-mt-24 bg-slate-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <p className={eyebrow}>Who we serve</p>
            <h2 className={h2}>One platform, many kinds of property</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">MelyOS adapts to the way your property works, whether you manage lots, sites, slips, units or storage spaces.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map(([Icon, t, s]) => (
              <article key={t} className="rounded-3xl border border-slate-200 bg-white p-7 transition hover:shadow-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50"><Icon className="h-6 w-6 text-[#079db9]" strokeWidth={1.8} aria-hidden /></div><h3 className="mt-4 text-xl font-black">{t}</h3><p className="mt-2 leading-7 text-slate-600">{s}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}

export function HowItWorksSection() {
  return (
    <>
      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-24 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className={eyebrow}>How it works</p>
            <h2 className={h2}>We set it up. You run your property.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">No long forms and no do-it-yourself setup. Our team builds your platform around the way you already work.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map(([n, t, s]) => (
              <article key={n} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#071A33] text-lg font-black text-white">{n}</div>
                <h3 className="mt-5 text-xl font-black">{t}</h3><p className="mt-2 leading-7 text-slate-600">{s}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}

export function TrustSection() {
  return (
    <>
      {/* Trust */}
      <section className="bg-[#06182e] py-16 text-white md:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-[#39d5ee]">Why owners trust MelyOS</p>
            <h2 className={h2}>Your property, your customers, your data</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {trust.map(([Icon, t, s]) => (
              <div key={t} className="rounded-3xl border border-white/10 bg-white/5 p-7"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10"><Icon className="h-6 w-6 text-[#39d5ee]" strokeWidth={1.8} aria-hidden /></div><h3 className="mt-4 text-lg font-black">{t}</h3><p className="mt-2 leading-7 text-slate-300">{s}</p></div>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}

export function ServicesSection() {
  return (
    <>
      {/* Built-in services (per Mely): payment processing, background checks, QuickBooks, Send to Collections (never name the agency) */}
      <section id="services" className="scroll-mt-24 bg-slate-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className={eyebrow}>Built in and connected</p>
            <h2 className={h2}>Payments, screening, accounting and collections</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">The services most properties set up with different companies are already connected to MelyOS.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {([
              [CreditCard, "Payment processing", ["Customers pay rent, reservations and invoices online by card or bank (ACH)", "Autopay from a card or bank account", "Money deposited to your own bank account, or in about 30 minutes with instant payout", "Receipts emailed automatically; refunds tracked in your reports"]],
              [BadgeCheck, "Background checks", ["Screening ordered right from the online application", "Applicant and adult household members each get their own check", "Paid by the applicant with the application", "Results in your office; your park makes the decision and handles any adverse action"]],
              [Scale, "Send to Collections", ["Refer former residents' overdue accounts to a licensed collections agency", "Accept the agency's terms once", "Send each account yourself, one at a time", "Track status and recoveries in one place"]],
              [Receipt, "QuickBooks Online", ["Export for QuickBooks: customers and invoices ready to import", "Payments list to match your bank deposits", "Revenue and sales-tax reports", "Sign in to QuickBooks, or open an account, from MelyOS"]],
            ] as [LucideIcon, string, string[]][]).map(([Icon, t, list]) => (
              <article key={t} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                {t === "QuickBooks Online"
                  ? <div className="flex h-12 items-center"><img src="/quickbooks-logo.png" alt="Intuit QuickBooks" className="h-9 w-auto object-contain" /></div>
                  : <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#071A33]"><Icon className="h-6 w-6 text-[#39d5ee]" strokeWidth={1.8} aria-hidden /></div>}
                <h3 className="mt-5 text-xl font-black">{t}</h3>
                <ul className="mt-4 space-y-2.5">{list.map((i) => <li key={i} className="flex gap-2.5 text-slate-700"><span className="text-[#08B8D8]">✓</span><span>{i}</span></li>)}</ul>
              </article>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}

export function PricingSection() {
  return (
    <>
      {/* Pricing (no public prices) */}
      <section id="pricing" className="scroll-mt-24 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className={eyebrow}>Pricing</p>
            <h2 className={h2}>A quote built around your property</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">Every property is different, so we price each one after a short call: a one-time setup plus a simple monthly platform fee, month to month.</p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
            <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-9">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#08B8D8]">Setup & implementation</p>
              <h3 className="mt-4 text-3xl font-black">Done for you</h3>
              <div className="mt-7 space-y-3">
                {["Your own website on your domain", "Your property map drawn and connected", "Spaces, rates, fees and contracts configured", "Help moving your current customers in", "Staff training and launch-day support"].map((i) => <div key={i} className="flex gap-3 font-semibold text-slate-700"><span className="text-[#08B8D8]">✓</span><span>{i}</span></div>)}
              </div>
              <a href="/demo" className="mt-8 block rounded-xl border-2 border-[#08B8D8] px-6 py-4 text-center font-black text-[#079db9] transition hover:bg-cyan-50">Request a custom quote</a>
            </article>
            <article className="rounded-3xl bg-[#071A33] p-7 text-white shadow-2xl md:p-9">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-cyan-300">MelyOS platform</p>
              <h3 className="mt-4 text-3xl font-black">Contact us for pricing</h3>
              <div className="mt-7 space-y-3">
                {["Every feature your property needs", "Staff accounts with roles and permissions", "Customer portal and online payments", "Mely AI assistant for guests and staff", "Updates and support included", "No long-term contract"].map((i) => <div key={i} className="flex gap-3 font-semibold text-slate-100"><span className="text-[#39d5ee]">✓</span><span>{i}</span></div>)}
              </div>
              <a href="/demo" className="mt-8 block rounded-xl bg-[#08B8D8] px-6 py-4 text-center font-black text-white transition hover:bg-[#079db9]">Book a demo</a>
              <p className="mt-4 text-center text-xs text-slate-400">Card and bank processing fees may apply.</p>
            </article>
          </div>
        </div>
      </section>

    </>
  );
}

// Oct 29 (per Mely): home page reorganized. Who it's for + highlights, the 12 features
// grouped into 4 photo cards (full detail on /features and each solution page), a short
// pricing band (full detail on /pricing) and a FAQ. Same wording, shorter page.
const HOME_AUDIENCE: [string, LucideIcon, string, string][] = [
  ["/rv-park-software", industries[0][0], industries[0][1], industries[0][2]],
  ["/marina-software", industries[1][0], industries[1][1], industries[1][2]],
  ["/campground-software", industries[2][0], industries[2][1], industries[2][2]],
];

export function HomeAudienceSection() {
  return (
    <section id="who-its-for" className="scroll-mt-24 border-b border-slate-100 bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 py-12 md:py-14 lg:px-8">
        <p className={`${eyebrow} text-center`}>Who it&apos;s for</p>
        <div className="grid gap-3 md:grid-cols-3 md:gap-5">
          {HOME_AUDIENCE.map(([href, Icon, t, s]) => (
            <a key={href} href={href} className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-lg md:p-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#071A33]"><Icon className="h-6 w-6 text-[#39d5ee]" strokeWidth={1.8} aria-hidden /></span>
              <span className="min-w-0 flex-1"><span className="block font-black">{t}</span><span className="mt-0.5 block text-sm leading-5 text-slate-500">{s}</span></span>
              <ArrowRight className="h-5 w-5 shrink-0 text-[#08B8D8] transition group-hover:translate-x-0.5" aria-hidden />
            </a>
          ))}
        </div>
        <p className="mt-5 text-center text-sm text-slate-500">
          Also for {industries.slice(3).map(([, t]) => t).join(" · ")}. <a href="/features#industries" className="font-bold text-[#079db9] hover:underline">See all →</a>
        </p>
        <div className="mt-10 grid grid-cols-2 gap-5 border-t border-slate-200 pt-8 text-center md:grid-cols-4">
          {[["All in one place", "Map, bookings, billing and portal"], ["24/7 online", "Customers book and pay anytime"], ["Any language", "Mely answers your guests in theirs"], ["Built for growth", "One property or many"]].map(([t, s]) => (
            <div key={t}><p className="font-black">{t}</p><p className="mt-1 text-sm text-slate-500">{s}</p></div>
          ))}
        </div>
      </div>
    </section>
  );
}

const featureTitle = (id: string) => features.find((f) => f.id === id)?.title ?? id;

const HOME_CARDS: { title: string; img: string; alt: string; text: string; ids: string[]; href: string; more: string }[] = [
  { title: "Map & online reservations", img: "/hero-interactive-map.png", alt: "Interactive lot map with a site selected and dates being booked",
    text: "Every lot, site or slip on a real map of your property. Guests pick their exact space and dates and pay online, and the calendar blocks double bookings.",
    ids: ["map", "reservations"], href: "/interactive-property-map", more: "See the interactive map" },
  { title: "Billing, contracts & screening", img: "/interactive-slips-2026.jpg", alt: "Interactive slip map with billing for each space",
    text: "Monthly invoices with pay ahead, utilities and late fees, paid by card or bank (ACH) with autopay to your own bank account. Leases and slip agreements signed online, and applications with background checks.",
    ids: ["payments", "contracts", "screening"], href: "/billing-payments-software", more: "See billing & payments" },
  { title: "Customer portal & Mely", img: "/marina-interactive-map-v2.png", alt: "Marina map with slip details a boater can reserve",
    text: "Residents and boat owners see their balance, pay, sign and send requests from their phone, 24/7, in English, Spanish, Portuguese and more languages. Mely answers your guests 24/7 in their own language.",
    ids: ["portal", "messages", "mely-ai"], href: "/customer-portal-software", more: "See the customer portal" },
  { title: "Front office & daily operations", img: "/hero-marina-2026.jpg", alt: "Marina docks with boats at sunset",
    text: "Sell propane, fuel and store items at the counter, track maintenance, give every employee their own login, close each shift with a drawer count, and run revenue and tax reports with Export for QuickBooks Online.",
    ids: ["point-of-sale", "maintenance", "staff", "reports"], href: "/features", more: "See every feature" },
];

export function HomePlatformSection() {
  return (
    <section id="platform" className="scroll-mt-24 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center md:mb-12">
          <p className={eyebrow}>One connected platform</p>
          <h2 className={h2}>Everything your office does, in one system</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">Replace spreadsheets, paper contracts and disconnected tools. Every screen talks to the others, so a payment, a contract or a reservation is updated everywhere at once.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {HOME_CARDS.map((c) => (
            <article key={c.title} className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:shadow-xl">
              <div className="overflow-hidden"><img src={c.img} alt={c.alt} className="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-[1.03]" /></div>
              <div className="flex flex-1 flex-col p-6 md:p-7">
                <h3 className="text-2xl font-black">{c.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{c.text}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {c.ids.map((id) => <li key={id}><a href={`/features#${id}`} className="inline-block rounded-full bg-cyan-50 px-3 py-1 text-sm font-bold text-[#075e73] transition hover:bg-cyan-100">{featureTitle(id)}</a></li>)}
                </ul>
                <a href={c.href} className="mt-auto inline-flex items-center gap-1.5 pt-6 font-black text-[#079db9] hover:underline">{c.more}<ArrowRight className="h-4 w-4" aria-hidden /></a>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10 text-center">
          <a href="/features" className="inline-block rounded-xl border-2 border-[#08B8D8] px-6 py-3.5 font-black text-[#079db9] transition hover:bg-cyan-50">Explore the full platform</a>
        </div>
      </div>
    </section>
  );
}

export function HomePricingBand() {
  return (
    <section id="pricing" className="scroll-mt-24 py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <div className="rounded-[32px] border border-slate-200 bg-white p-7 text-center shadow-sm md:p-12">
          <p className={eyebrow}>Pricing</p>
          <h2 className={h2}>A quote built around your property</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">Every property is different, so we price each one after a short call: a one-time setup plus a simple monthly platform fee, month to month.</p>
          <div className="mx-auto mt-7 flex max-w-2xl flex-wrap justify-center gap-x-6 gap-y-2 font-semibold text-slate-700">
            {["Done for you", "Updates and support included", "No long-term contract"].map((i) => <span key={i} className="flex items-center gap-2"><span className="text-[#08B8D8]">✓</span>{i}</span>)}
          </div>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a href="/demo" className={`${cta} text-center`}>Request a custom quote</a>
            <a href="/pricing" className="rounded-xl border-2 border-[#08B8D8] px-7 py-3.5 text-center font-black text-[#079db9] transition hover:bg-cyan-50">See what&apos;s included</a>
          </div>
          <p className="mt-5 text-xs text-slate-400">Card and bank processing fees may apply.</p>
        </div>
      </div>
    </section>
  );
}

// Home FAQ: the same questions and answers used on /pricing, /rv-park-software and /marina-software.
export const HOME_FAQ: [string, string][] = [
  ["Does it work for both short stays and long-term residents?", "Yes. Nightly, weekly and monthly reservations live on the same map as your long-term residents and their leases."],
  ["Do you support dry storage and lift slips?", "Yes. Wet slips, lift slips and dry storage are all supported, each with its own rates and on the same map."],
  ["Does it work for city or county marinas?", "Yes. Every payment is tied to an employee and a shift close, with resident and non-resident pricing and fee schedules with effective dates."],
  ["Do you move our current residents into the system?", "We help bring your current residents, lots and balances into MelyOS during setup."],
  ["Do you charge per module?", "No. One plan includes every tool: the map, reservations, contracts, billing, the customer portal, point of sale, fuel dock, dry stack, reports, QuickBooks export and the Mely AI assistant."],
  ["Is there a long-term contract?", "No. The platform is month to month."],
  ["Are there card processing fees?", "Card and bank processing fees may apply to online payments. We explain them in your quote."],
  ["How do I get a price?", "Book a free demo or email info@melyos.io. We answer with a custom quote for your property."],
];

// Oct 21 (per Mely): top of each inside page.
export function PageHero({ kicker, title, text, image, imageAlt }: { kicker: string; title: string; text: string; image?: string; imageAlt?: string }) {
  return (
    <section className="relative overflow-hidden bg-[#06182e] pt-20 text-white md:pt-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 md:py-20 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-[#39d5ee]">{kicker}</p>
          <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">{text}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="/demo" className={`${cta} text-center`}>Book a Free Demo</a>
            <a href="/features" className="rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 text-center font-black text-white transition hover:bg-white/20">See all features</a>
          </div>
        </div>
        {image && (
          <div className="relative">
            <div className="absolute -inset-5 rounded-[36px] bg-cyan-400/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[28px] border border-white/15 bg-white p-2 shadow-2xl">
              <img src={image} alt={imageAlt || ""} className="aspect-[3/2] w-full rounded-2xl object-cover" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// A list of capabilities as cards, for the RV / marina / campground pages.
export function CapabilityGrid({ kicker, title, items }: { kicker: string; title: string; items: [string, string][] }) {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className={eyebrow}>{kicker}</p>
          <h2 className={h2}>{title}</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(([t, s]) => (
            <article key={t} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-100 text-sm font-black text-[#079db9]">✓</div>
              <h3 className="mt-4 text-lg font-black">{t}</h3>
              <p className="mt-2 leading-7 text-slate-600">{s}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqSection({ items }: { items: [string, string][] }) {
  return (
    <section id="faq" className="scroll-mt-24 bg-slate-50 py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-5 lg:px-8">
        <div className="mb-10 text-center"><p className={eyebrow}>Questions</p><h2 className={h2}>Frequently asked questions</h2></div>
        <div className="space-y-3">
          {items.map(([q, a]) => (
            <details key={q} className="group rounded-2xl border border-slate-200 bg-white p-5 open:shadow-md">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-black">{q}<span className="text-[#08B8D8] transition group-open:rotate-45">+</span></summary>
              <p className="mt-3 leading-7 text-slate-600">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// Oct 21 (per Mely): "One plan, everything included" — MelyOS vs. platforms that sell
// each tool as a separate monthly module. No prices and no competitor names.
const ONE_PLAN: [string, string][] = [
  ["Interactive map & occupancy", "Every lot, site or slip, live"],
  ["Online reservations", "Book and pay 24/7"],
  ["Contracts & e-signature", "Signed online, invoices created on signing"],
  ["Billing, autopay & utilities", "Card and bank payments, meter readings, late fees"],
  ["Customer portal", "Balance, payments, documents, in 3 languages"],
  ["Point of sale & inventory", "Store, propane, barcode scanning"],
  ["Fuel dock", "Pumps, tank levels, sales"],
  ["Dry stack launch requests", "From the boater's phone"],
  ["QuickBooks export & reports", "Revenue, tax, statements"],
  ["Mely AI assistant", "Answers guests 24/7 in their language"],
  ["Your own website", "On your domain, with your map"],
  ["Updates & support", "New features at no extra cost"],
];

export function OnePlanSection() {
  return (
    <section id="one-plan" className="scroll-mt-24 bg-slate-50 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className={eyebrow}>One plan</p>
          <h2 className={h2}>Everything included. No modules to add.</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">Many platforms sell each tool as its own monthly module, so the bill grows every time you need something new. With MelyOS every tool comes in one plan.</p>
        </div>
        <p className="mb-4 text-center text-sm font-semibold text-slate-500 sm:hidden">On many other platforms, each of these is an extra monthly module.</p>
        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-5 py-4 text-sm font-black uppercase tracking-[0.12em] text-slate-500 md:px-7">What you get</th>
                <th className="bg-[#071A33] px-5 py-4 text-center text-sm font-black uppercase tracking-[0.12em] text-cyan-300">MelyOS</th>
                <th className="hidden px-5 py-4 text-center text-sm font-black uppercase tracking-[0.12em] text-slate-500 sm:table-cell">Module-based platforms</th>
              </tr>
            </thead>
            <tbody>
              {ONE_PLAN.map(([t, s]) => (
                <tr key={t} className="border-b border-slate-100 last:border-0">
                  <td className="px-5 py-3.5 md:px-7"><p className="font-bold">{t}</p><p className="text-sm text-slate-500">{s}</p></td>
                  <td className="bg-[#071A33]/[0.04] px-5 py-3.5 text-center"><span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700"><Check className="h-4 w-4" strokeWidth={2.5} aria-hidden />Included</span></td>
                  <td className="hidden px-5 py-3.5 text-center sm:table-cell"><span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-500"><Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden />Often an extra module</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-8 flex flex-col items-center gap-3 text-center">
          <p className="max-w-2xl text-slate-600">One monthly fee, month to month. One setup done by our team. Card and bank processing fees may apply to online payments.</p>
          <a href="/demo" className={cta}>Get your custom quote</a>
        </div>
      </div>
    </section>
  );
}

// Oct 21 (per Mely): a real sequence on solution pages (the order is the information).
export function FlowSection({ kicker, title, steps }: { kicker: string; title: string; steps: [string, string][] }) {
  return (
    <section className="bg-slate-50 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className={eyebrow}>{kicker}</p>
          <h2 className={h2}>{title}</h2>
        </div>
        <ol className="grid gap-5 md:grid-cols-3">
          {steps.map(([t, s], i) => (
            <li key={t} className="rounded-3xl border border-slate-200 bg-white p-7">
              <span className="text-sm font-black tracking-[0.16em] text-[#08B8D8]">STEP {i + 1}</span>
              <h3 className="mt-3 text-lg font-black">{t}</h3>
              <p className="mt-2 leading-7 text-slate-600">{s}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
