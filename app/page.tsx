"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Map, CalendarCheck, CreditCard, UserRound, PenLine, ShieldCheck, ScanBarcode, MessagesSquare, Wrench, Users, BarChart3, Bot, Caravan, Anchor, Tent, Home as HomeIcon, Warehouse, Landmark, Lock, Banknote, FileCheck2, MapPin, Mail, MessageCircle } from "lucide-react";

// Oct 21 (per Mely): melyos.io refreshed with everything MelyOS offers today for
// RV parks and marinas. Only features that exist; never public prices.

const NAV = [
  ["#platform", "Platform"],
  ["#rv-parks", "RV Parks"],
  ["#marinas", "Marinas"],
  ["#how-it-works", "How It Works"],
  ["#pricing", "Pricing"],
];

const features = [
  { icon: Map, title: "Interactive property map", text: "Every lot, site or slip on a real map of your property: open, occupied, reserved or under maintenance, with photo, size and hookups." },
  { icon: CalendarCheck, title: "Online reservations", text: "Guests pick their exact space and dates and pay online. The calendar blocks double bookings across every channel." },
  { icon: CreditCard, title: "Payments & billing", text: "Invoices, recurring rent, metered utilities, late-fee schedules and online payments that go straight to your own bank account." },
  { icon: UserRound, title: "Customer portal", text: "Residents and boat owners see their balance, pay, download documents and send requests from their phone, 24/7." },
  { icon: PenLine, title: "Contracts & e-signature", text: "Leases and slip agreements signed online, with a signature record, a signed PDF on file and invoices created on signing." },
  { icon: ShieldCheck, title: "Applications & screening", text: "Online rental applications with background checks, occupants, vehicles and pets, reviewed and approved from the office." },
  { icon: ScanBarcode, title: "Point of sale", text: "Sell propane, fuel and store items at the counter, with barcode scanning, inventory and low-stock alerts." },
  { icon: MessagesSquare, title: "Messages & notices", text: "Send a notice to one customer or a whole group. Each one gets a private copy by email and in their account." },
  { icon: Wrench, title: "Maintenance", text: "Requests with photos, notes and status updates that the resident can follow from the portal." },
  { icon: Users, title: "Staff, roles & daily close", text: "Logins for every employee with their own permissions, shift open and close, and a drawer count for every shift." },
  { icon: BarChart3, title: "Reports & accounting", text: "Revenue and tax reports, statements, collections, Export for QuickBooks Online and printable PDFs with your logo." },
  { icon: Bot, title: "Mely, your AI assistant", text: "Answers your guests 24/7 in their own language on your website, and helps your staff find anything in the system." },
];

const rvParks = [
  "Interactive lot map with real-time availability and date-range booking",
  "Nightly, weekly and monthly stays with seasonal pricing",
  "Online lease applications with background screening",
  "Resident portal: rent, autopay, documents, vehicles, occupants, move-out requests",
  "Recurring billing: rent, electric meter readings (any meter type), laundry and late fees",
  "Propane sales with QR pickup codes",
  "Rent-to-own plans with payment tracking and bill of sale",
  "Storage lots, real-estate listings and park events",
];

const marinas = [
  "Interactive slip map for wet slips, lift slips and dry storage",
  "Rates per slip or per foot, with resident and non-resident pricing",
  "Slip contracts with e-signature and one-click annual renewals",
  "Fuel dock sales with pumps, tank levels and delivery log",
  "Ship store point of sale with barcode scanning and inventory",
  "Dry stack launch requests from the boater's phone",
  "Waitlist with slip offers, event rooms, insurance and registration tracking",
  "Shift close-out and per-payment records built for city and county audits",
];

const industries: [LucideIcon, string, string][] = [
  [Caravan, "RV Parks & Resorts", "Long-term residents and short stays on one map."],
  [Anchor, "Marinas", "Private and municipal: slips, dry storage, fuel and store."],
  [Tent, "Campgrounds", "Sites, cabins, amenities and seasonal rates."],
  [HomeIcon, "Mobile Home Communities", "Leases, rent, utilities and maintenance."],
  [Warehouse, "RV & Boat Storage", "Spaces, recurring charges and customer records."],
  [Landmark, "Government Properties", "City and county parks and marinas that need clean, auditable records."],
];

const steps = [
  ["1", "Free consultation", "We learn how your property works today: spaces, rates, billing and what slows your team down."],
  ["2", "We build it for you", "Your own website and domain, your property map, spaces, rates, fees and contracts, all set up by the MelyOS team."],
  ["3", "Training & launch", "We train your staff, help bring your current customers into the system, and stay with you on launch day."],
  ["4", "Support that answers", "A real team in Florida, plus regular updates included in the platform."],
];

const trust: [LucideIcon, string, string][] = [
  [Lock, "Secure by design", "Encrypted card payments, role-based access, and each property's data kept separate."],
  [Banknote, "Your money, your bank", "Customer payments go to your own bank account. Payouts are tracked in your reports."],
  [FileCheck2, "Records you can audit", "Every payment, refund and shift close is tied to a person, a date and a receipt."],
  [MapPin, "Built in Florida", "MelyOS LLC is based in Kissimmee, FL. Small team, fast answers."],
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demo, setDemo] = useState({ name: "", business: "", email: "", phone: "", propertyType: "", spaces: "" });
  const [demoState, setDemoState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [demoError, setDemoError] = useState("");
  async function submitDemo(event: React.FormEvent) {
    event.preventDefault();
    setDemoState("sending");
    setDemoError("");
    try {
      const r = await fetch("/api/demo-request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(demo) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Something went wrong.");
      setDemoState("sent");
    } catch (e: any) {
      setDemoError(e.message);
      setDemoState("error");
    }
  }

  const eyebrow = "mb-3 text-sm font-black uppercase tracking-[0.18em] text-[#08B8D8]";
  const h2 = "text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl";
  const cta = "rounded-xl bg-[#08B8D8] px-7 py-3.5 font-black text-white shadow-lg shadow-cyan-500/25 transition hover:-translate-y-0.5 hover:bg-[#079db9]";

  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#071A33]">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-slate-200/70 bg-white/95 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-5 md:h-24 lg:px-8">
          <a href="#home" aria-label="MelyOS home" className="flex items-center">
            <img src="/melyos-logo-transparent.png" alt="MelyOS" className="h-auto w-[115px] object-contain sm:w-[135px] md:w-[150px] lg:w-[170px]" />
          </a>
          <nav className="hidden items-center gap-7 text-[15px] font-bold text-slate-700 xl:flex">
            {NAV.map(([href, label]) => <a key={href} className="transition hover:text-[#08B8D8]" href={href}>{label}</a>)}
          </nav>
          <div className="hidden items-center gap-3 xl:flex">
            <a href="https://admin.melyos.io" className="rounded-xl px-4 py-3 font-bold text-slate-700 transition hover:bg-slate-100 hover:text-[#08B8D8]">Login</a>
            <a href="#demo" className={cta}>Book a Demo</a>
          </div>
          <button type="button" aria-label="Open navigation menu" aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((o) => !o)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-2xl transition hover:border-cyan-300 hover:bg-cyan-50 xl:hidden">
            {mobileMenuOpen ? "×" : "☰"}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white px-5 py-5 shadow-lg xl:hidden">
            <nav className="flex flex-col gap-4 font-bold text-slate-700">
              {NAV.map(([href, label]) => <a key={href} onClick={() => setMobileMenuOpen(false)} href={href}>{label}</a>)}
              <a href="https://admin.melyos.io">Login</a>
              <a onClick={() => setMobileMenuOpen(false)} href="#demo" className="mt-2 rounded-xl bg-[#08B8D8] px-5 py-3 text-center text-white">Book a Demo</a>
            </nav>
          </div>
        )}
      </header>

      {/* Hero */}
      <section id="home" className="relative overflow-hidden bg-[#06182e] pt-20 md:pt-24">
        <img src="/hero-tablet-2026.jpg" alt="Marina and RV park interactive maps managed with MelyOS on a tablet" className="h-[300px] w-full object-cover object-center sm:h-[380px] md:absolute md:inset-x-0 md:top-24 md:h-[calc(100%-6rem)]" />
        <div className="hidden md:absolute md:inset-x-0 md:bottom-0 md:top-24 md:block md:bg-gradient-to-r md:from-[#06182e]/90 md:via-[#06182e]/55 md:to-transparent" />
        <div className="relative z-10 mx-auto max-w-7xl px-5 py-12 md:py-16 lg:px-8 lg:py-20">
          <div className="max-w-xl text-white lg:max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-white/10 px-4 py-2 text-xs font-black tracking-[0.18em] text-cyan-200 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#39d5ee]" /> RV PARKS · MARINAS · CAMPGROUNDS
            </div>
            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Run your property.
              <span className="mt-2 block text-[#39d5ee]">Not your day.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-slate-200 sm:text-lg sm:leading-8">
              One platform for reservations, payments, contracts, your customer portal and daily operations, built around a live map of your property and set up for you by our team.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <a href="#demo" className={`${cta} text-center sm:px-8 sm:py-4`}>Book a Free Demo</a>
              <a href="#platform" className="rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 text-center font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20 sm:px-8 sm:py-4">Explore the Platform</a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold text-slate-200">
              <span>✓ Your own website & map</span><span>✓ Online payments</span><span>✓ Done-for-you setup</span>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="border-b border-slate-100 bg-slate-50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-5 px-5 py-7 text-center md:grid-cols-4 lg:px-8">
          {[["All in one place", "Map, bookings, billing and portal"], ["24/7 online", "Customers book and pay anytime"], ["Any language", "Mely answers your guests in theirs"], ["Built for growth", "One property or many"]].map(([t, s]) => (
            <div key={t}><p className="font-black">{t}</p><p className="mt-1 text-sm text-slate-500">{s}</p></div>
          ))}
        </div>
      </section>

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
              <article key={f.title} className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:shadow-xl">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 transition group-hover:scale-110"><f.icon className="h-6 w-6 text-[#079db9]" strokeWidth={1.8} aria-hidden /></div>
                <h3 className="text-lg font-black">{f.title}</h3>
                <p className="mt-2 leading-7 text-slate-600">{f.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

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
                  <a href="#demo" className="mt-5 inline-block rounded-xl bg-[#071A33] px-5 py-3 font-black text-white transition hover:bg-[#0b2a4f]">Request access</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

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
              <a href="#demo" className="mt-8 block rounded-xl border-2 border-[#08B8D8] px-6 py-4 text-center font-black text-[#079db9] transition hover:bg-cyan-50">Request a custom quote</a>
            </article>
            <article className="rounded-3xl bg-[#071A33] p-7 text-white shadow-2xl md:p-9">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-cyan-300">MelyOS platform</p>
              <h3 className="mt-4 text-3xl font-black">Contact us for pricing</h3>
              <div className="mt-7 space-y-3">
                {["Every feature your property needs", "Staff accounts with roles and permissions", "Customer portal and online payments", "Mely AI assistant for guests and staff", "Updates and support included", "No long-term contract"].map((i) => <div key={i} className="flex gap-3 font-semibold text-slate-100"><span className="text-[#39d5ee]">✓</span><span>{i}</span></div>)}
              </div>
              <a href="#demo" className="mt-8 block rounded-xl bg-[#08B8D8] px-6 py-4 text-center font-black text-white transition hover:bg-[#079db9]">Book a demo</a>
              <p className="mt-4 text-center text-xs text-slate-400">Card and bank processing fees may apply.</p>
            </article>
          </div>
        </div>
      </section>

      {/* Demo form */}
      <section id="demo" className="scroll-mt-24 px-5 pb-24 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[36px] bg-[#071A33] px-6 py-16 text-white sm:px-10 lg:px-16">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_440px]">
            <div>
              <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-[#39d5ee]">Book a free demo</p>
              <h2 className={h2}>See MelyOS working for your property</h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">Tell us about your property. We will show you the tools that matter to you and send you a custom quote, with no obligation.</p>
              <div className="mt-8 space-y-2 text-slate-200">
                <p className="flex items-center gap-2"><Mail className="h-5 w-5 text-[#39d5ee]" aria-hidden /><a className="font-bold underline" href="mailto:info@melyos.io">info@melyos.io</a></p>
                <p className="flex items-center gap-2"><MessageCircle className="h-5 w-5 text-[#39d5ee]" aria-hidden />Or chat with Mely, bottom right, any time.</p>
              </div>
            </div>
            <form className="rounded-3xl bg-white p-6 text-[#071A33] shadow-2xl" onSubmit={submitDemo}>
              {demoState === "sent" ? (
                <div className="py-10 text-center"><p className="text-2xl font-black">Thank you!</p><p className="mt-3 text-slate-600">We received your request. The MelyOS team will contact you soon to schedule your demo.</p></div>
              ) : (
                <div className="grid gap-4">
                  <input type="text" required value={demo.name} onChange={(e) => setDemo({ ...demo, name: e.target.value })} placeholder="Full name" className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-400" />
                  <input type="text" value={demo.business} onChange={(e) => setDemo({ ...demo, business: e.target.value })} placeholder="Business name" className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-400" />
                  <input type="email" required value={demo.email} onChange={(e) => setDemo({ ...demo, email: e.target.value })} placeholder="Business email" className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-400" />
                  <input type="tel" value={demo.phone} onChange={(e) => setDemo({ ...demo, phone: e.target.value })} placeholder="Phone (optional)" className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-400" />
                  <select value={demo.propertyType} onChange={(e) => setDemo({ ...demo, propertyType: e.target.value })} className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-400">
                    <option value="" disabled>Property type</option>
                    <option>RV Park</option><option>Marina</option><option>Campground</option><option>Mobile Home Community</option><option>RV / Boat Storage</option><option>Government property</option><option>Other</option>
                  </select>
                  <input type="number" value={demo.spaces} onChange={(e) => setDemo({ ...demo, spaces: e.target.value })} placeholder="Number of lots, sites or slips" className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-400" />
                  <button type="submit" disabled={demoState === "sending"} className="rounded-xl bg-[#08B8D8] px-6 py-4 font-black text-white transition hover:bg-[#079db9] disabled:opacity-60">{demoState === "sending" ? "Sending…" : "Request my demo"}</button>
                  {demoState === "error" && <p className="text-center text-sm text-red-600">{demoError}</p>}
                </div>
              )}
              <p className="mt-4 text-center text-xs leading-5 text-slate-500">Submitting this form does not create an account or commit you to a purchase.</p>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-4 lg:px-8">
          <div className="md:col-span-2">
            <img src="/melyos-logo-transparent.png" alt="MelyOS" className="h-14 w-auto" />
            <p className="mt-4 max-w-md leading-7 text-slate-600">Property management software for RV parks, marinas, campgrounds, communities and storage properties. MelyOS LLC, Kissimmee, Florida.</p>
            <p className="mt-3 flex items-center gap-2 text-slate-600"><Mail className="h-4 w-4 text-[#079db9]" aria-hidden /><a className="underline" href="mailto:info@melyos.io">info@melyos.io</a></p>
          </div>
          <div>
            <p className="font-black">Platform</p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
              <a href="#platform">Features</a><a href="#rv-parks">RV Parks</a><a href="#marinas">Marinas</a><a href="#see-it-live">See It Live</a><a href="#pricing">Pricing</a>
            </div>
          </div>
          <div>
            <p className="font-black">Company</p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
              <a href="#demo">Book a Demo</a><a href="https://admin.melyos.io">Login</a><a href="/privacy">Privacy Policy</a><a href="/terms">Terms of Service</a>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-200">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
            <p>© {new Date().getFullYear()} MelyOS LLC. All rights reserved.</p>
            <p>Property Management, Reimagined.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
