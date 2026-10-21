import { eyebrow, h2, cta, features, rvParks, marinas, industries, steps, trust, CreditCard, BadgeCheck, Receipt, Caravan, Anchor } from "./data";
import type { LucideIcon } from "./data";

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

export function RvMarinaSection() {
  return (
    <>
      {/* RV parks & marinas */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className={eyebrow}>Made for how you operate</p>
            <h2 className={h2}>Built for RV parks. Built for marinas.</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {[["rv-parks", Caravan, "RV parks & communities", rvParks, "#demo", "Request an RV park demo"], ["marinas", Anchor, "Marinas, private & municipal", marinas, "#demo", "Request a marina demo"]].map(([id, icon, title, list, href, label]) => (
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
              {["See balances and pay online", "Set up autopay", "Read and sign contracts", "Download receipts and documents", "Send maintenance or launch requests", "Read notices and message the office"].map((i) => (
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
      {/* Built-in services (per Mely): payment processing, background checks, QuickBooks */}
      <section id="services" className="scroll-mt-24 bg-slate-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className={eyebrow}>Built in, no extra vendors</p>
            <h2 className={h2}>Payments, screening and accounting included</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">The services most properties buy from three different companies are already part of MelyOS.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {([
              [CreditCard, "Payment processing", ["Customers pay rent, reservations and invoices by card, online", "Autopay for monthly rent and slip fees", "Money deposited to your own bank account", "Receipts emailed automatically; refunds tracked in your reports"]],
              [BadgeCheck, "Background checks", ["Screening ordered right from the online application", "Applicant and adult occupants each get their own check", "Results reviewed in the office before you approve", "Fee collected from the applicant with the application"]],
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
