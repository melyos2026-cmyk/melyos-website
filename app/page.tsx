"use client";

import { useEffect, useState } from "react";

const heroSlides = [
  {
    image: "/hero-interactive-map.png",
    label: "PROPERTY MANAGEMENT",
    title: "Run Your Property.",
    highlightedTitle: "Not Your Day.",
    description:
      "Manage reservations, residents, payments, maintenance, billing and daily operations from one powerful platform.",
  },
];

const features = [
  {
    icon: "🗺️",
    title: "Interactive Maps",
    description:
      "See availability, occupancy, reservations and maintenance status directly from your property map.",
  },
  {
    icon: "📅",
    title: "Reservations",
    description:
      "Manage online bookings, availability, deposits, check-ins and check-outs from one place.",
  },
  {
    icon: "💳",
    title: "Payments & Billing",
    description:
      "Create invoices, collect payments and manage recurring rent, utilities and additional charges.",
  },
  {
    icon: "🏠",
    title: "Resident Portal",
    description:
      "Give residents secure access to balances, payments, documents, leases and maintenance requests.",
  },
  {
    icon: "🤖",
    title: "Ask Mely",
    description:
      "Use AI assistance to answer questions, streamline daily tasks and help your team work faster.",
  },
  {
    icon: "🛠️",
    title: "Maintenance",
    description:
      "Track service requests, photos, priorities, assignments, notes and completion status.",
  },
];

const industries = [
  {
    icon: "🚐",
    title: "RV Parks",
    description:
      "Manage lots, residents, reservations, utilities and property operations.",
  },
  {
    icon: "🏕️",
    title: "Campgrounds",
    description:
      "Handle short-term stays, availability, amenities and guest communication.",
  },
  {
    icon: "⚓",
    title: "Marinas",
    description:
      "Organize slips, vessel information, reservations, billing and customer records.",
  },
  {
    icon: "🏘️",
    title: "Mobile Home Communities",
    description:
      "Manage residents, leases, recurring rent, maintenance and documents.",
  },
  {
    icon: "🚐",
    title: "RV Storage",
    description:
      "Track spaces, occupancy, recurring charges and customer information.",
  },
  
];

const portalFeatures = [
  "View outstanding balances",
  "Make secure online payments",
  "Review invoices and payment history",
  "Submit maintenance requests",
  "Access leases and documents",
  "Manage vehicles and occupants",
];

export default function Home() {
  const [currentHero, setCurrentHero] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentHero((previous) => (previous + 1) % heroSlides.length);
    }, 6000);

    return () => window.clearInterval(interval);
  }, []);

  const currentSlide = heroSlides[currentHero];

  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#071A33]">
    <header className="fixed top-0 z-50 w-full border-b border-slate-200/70 bg-white/95 shadow-sm backdrop-blur-xl">
  <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-5 lg:px-8">
    <a href="#home" aria-label="MelyOS home" className="flex items-center">
      <img
        src="/melyos-logo-transparent.png"
        alt="MelyOS"
        className="h-16 w-auto object-contain"
      />
    </a>

    <nav className="hidden items-center gap-10 text-[15px] font-bold text-slate-700 lg:flex">
      <a
        className="transition hover:text-[#08B8D8]"
        href="#features"
      >
        Features
      </a>

      <a
        className="transition hover:text-[#08B8D8]"
        href="#industries"
      >
        Industries
      </a>

      <a
        className="transition hover:text-[#08B8D8]"
        href="#portal"
      >
        Resident Portal
      </a>

      <a
        className="transition hover:text-[#08B8D8]"
        href="#pricing"
      >
        Pricing
      </a>

      <a
        className="transition hover:text-[#08B8D8]"
        href="#demo"
      >
        Demo
      </a>
    </nav>

    <div className="hidden items-center gap-4 lg:flex">
      <a
        href="https://admin.melyos.io"
        className="rounded-xl px-4 py-3 font-bold text-slate-700 transition hover:bg-slate-100 hover:text-[#08B8D8]"
      >
        Login
      </a>

      <a
        href="#demo"
        className="rounded-xl bg-[#08B8D8] px-7 py-3.5 font-black text-white shadow-lg shadow-cyan-500/25 transition hover:-translate-y-0.5 hover:bg-[#079db9] hover:shadow-xl"
      >
        Book a Demo
      </a>
    </div>

    <button
      type="button"
      aria-label="Open navigation menu"
      aria-expanded={mobileMenuOpen}
      onClick={() => setMobileMenuOpen((open) => !open)}
      className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-2xl text-[#071A33] transition hover:border-cyan-300 hover:bg-cyan-50 lg:hidden"
    >
      {mobileMenuOpen ? "×" : "☰"}
    </button>
  </div>

  {mobileMenuOpen && (
    <div className="border-t border-slate-200 bg-white px-5 py-5 shadow-lg lg:hidden">
      <nav className="flex flex-col gap-4 font-bold text-slate-700">
        <a onClick={() => setMobileMenuOpen(false)} href="#features">
          Features
        </a>
        <a onClick={() => setMobileMenuOpen(false)} href="#industries">
          Industries
        </a>
        <a onClick={() => setMobileMenuOpen(false)} href="#portal">
          Resident Portal
        </a>
        <a onClick={() => setMobileMenuOpen(false)} href="#pricing">
          Pricing
        </a>
        <a onClick={() => setMobileMenuOpen(false)} href="#demo">
          Demo
        </a>
        <a href="https://admin.melyos.io">Login</a>

        <a
          onClick={() => setMobileMenuOpen(false)}
          href="#demo"
          className="mt-2 rounded-xl bg-[#08B8D8] px-5 py-3 text-center text-white"
        >
          Book a Demo
        </a>
      </nav>
    </div>
  )}
</header>

      <section
        id="home"
        className="relative flex min-h-[760px] items-center overflow-hidden pt-20"
      >
        {heroSlides.map((slide, index) => (
          <img
            key={slide.image}
            src={slide.image}
            alt=""
            aria-hidden="true"
className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ${
  index === currentHero ? "opacity-100" : "opacity-0"
}`}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/45 to-transparent" />
       <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-24 lg:px-8">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/85 px-4 py-2 text-xs font-black tracking-[0.18em] text-[#079db9] shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#08B8D8]" />
              {currentSlide.label}
            </div>

<h1 className="text-3xl font-black leading-tight tracking-tight text-[#071A33] sm:text-4xl lg:text-5xl">
              {currentSlide.title}
              <span className="mt-2 block text-[#08B8D8]">
                {currentSlide.highlightedTitle}
              </span>
            </h1>

<p className="mt-5 max-w-md text-[15px] leading-7 text-slate-700 sm:text-base">
              {currentSlide.description}
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a
                href="#demo"
                className="rounded-xl bg-[#08B8D8] px-8 py-4 text-center font-black text-white shadow-xl shadow-cyan-500/20 transition hover:-translate-y-1 hover:bg-[#079db9]"
              >
                Book a Demo
              </a>

              <a
                href="#platform-preview"
                className="rounded-xl border border-slate-200 bg-white/90 px-8 py-4 text-center font-black text-[#071A33] shadow-xl transition hover:-translate-y-1 hover:border-cyan-300"
              >
                Explore the Platform
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm font-bold text-slate-600">
              <span>✓ Interactive maps</span>
              <span>✓ Resident portal</span>
              <span>✓ Payments and billing</span>
            </div>
          </div>

          <div className="absolute bottom-10 left-5 flex gap-2 lg:left-8">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.image}
                type="button"
                aria-label={`Show hero slide ${index + 1}`}
                onClick={() => setCurrentHero(index)}
                className={`h-2.5 rounded-full transition-all ${
                  currentHero === index
                    ? "w-10 bg-[#08B8D8]"
                    : "w-2.5 bg-slate-400/60"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-100 bg-slate-50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 py-8 text-center md:grid-cols-4 lg:px-8">
          {[
            ["One Platform", "For your entire operation"],
            ["Real-Time", "Property visibility"],
            ["Secure", "Role-based access"],
            ["Built to Scale", "From one property to many"],
          ].map(([title, text]) => (
            <div key={title}>
              <p className="font-black text-[#071A33]">{title}</p>
              <p className="mt-1 text-sm text-slate-500">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="scroll-mt-24 py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <p className="mb-3 font-black uppercase tracking-[0.18em] text-[#08B8D8]">
              One connected system
            </p>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
              Everything you need to operate your property
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Replace scattered spreadsheets, disconnected tools and manual
              processes with one platform built around your property.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
         {features.map((feature) => (
  <a
    key={feature.title}
    href={
      feature.title === "Interactive Maps"
        ? "#platform-preview"
        : feature.title === "Resident Portal"
        ? "#portal"
        : "#demo"
    }
    className="group block cursor-pointer rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-cyan-400 hover:shadow-xl"
  >
    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-2xl transition duration-300 group-hover:scale-110">
      {feature.icon}
    </div>

    <h3 className="text-xl font-black">{feature.title}</h3>

    <p className="mt-3 leading-7 text-slate-600">
      {feature.description}
    </p>
  </a>
))}
          </div>
        </div>
      </section>

      <section
        id="platform-preview"
        className="scroll-mt-24 bg-[#06182e] py-24 text-white"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="mb-3 font-black uppercase tracking-[0.18em] text-[#39d5ee]">
              Interactive property management
            </p>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
              See your entire property at a glance
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              View available, occupied, reserved and maintenance spaces
              directly from a visual map created for your property.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                "Live availability",
                "Color-coded space status",
                "Clickable lots and slips",
                "Property amenities",
                "Reservation details",
                "Maintenance visibility",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <span className="text-[#39d5ee]">✓</span>
                  <span className="font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-5 rounded-[36px] bg-cyan-400/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[28px] border border-white/15 bg-white p-3 shadow-2xl">
              <img
            src="/marina-interactive-map.png"
            alt="Interactive marina slip reservation map"
            className="aspect-[4/3] w-full rounded-2xl object-cover"
            />
            </div>

            <div className="absolute -bottom-6 -left-4 rounded-2xl border border-slate-200 bg-white p-4 text-[#071A33] shadow-2xl sm:-left-8">
             <p className="text-xs font-black uppercase tracking-wide text-slate-400">
  Slip 7
</p>

<p className="mt-1 font-black text-lg">
  Available
</p>

<p className="mt-2 text-sm text-slate-500">
  Accommodates vessels up to 40 ft
</p>

<p className="text-sm text-slate-500">
  Water • 30 AMP Power • Dock Access
</p>
            </div>
          </div>
        </div>
      </section>

      <section id="industries" className="scroll-mt-24 py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mb-14 max-w-3xl">
            <p className="mb-3 font-black uppercase tracking-[0.18em] text-[#08B8D8]">
              Built for your industry
            </p>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
              One platform. Multiple property types.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              MelyOS adapts to the way your property operates, whether you
              manage lots, slips, units, residents or short-term guests.
            </p>
          </div>

<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {industries.map((industry) => (
              <article
                key={industry.title}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-7 transition hover:bg-white hover:shadow-xl"
              >
                <div className="text-3xl">{industry.icon}</div>
                <h3 className="mt-5 text-xl font-black">{industry.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">
                  {industry.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="portal" className="scroll-mt-24 bg-slate-50 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2 lg:px-8">
          <div className="order-2 lg:order-1">
            <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-2xl">
              <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <p className="text-sm font-black text-slate-400">
                    RESIDENT PORTAL
                  </p>
                  <p className="mt-1 text-xl font-black">Welcome Back</p>
                </div>
                <div className="h-11 w-11 rounded-full bg-cyan-100" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["Current Balance", "$1,250.00"],
                  ["Next Payment", "August 1"],
                  ["Lease Status", "Active"],
                  ["Open Requests", "1"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-sm font-bold text-slate-500">{label}</p>
                    <p className="mt-2 text-xl font-black">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl bg-[#08B8D8] p-5 text-white">
                <p className="font-black">Make a Payment</p>
                <p className="mt-1 text-sm text-cyan-50">
                  Review your balance and securely submit payment.
                </p>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <p className="mb-3 font-black uppercase tracking-[0.18em] text-[#08B8D8]">
              Resident self-service
            </p>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
              Give residents access without adding more work
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Residents can securely manage important information and complete
              common tasks without calling the office.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {portalFeatures.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-sm font-black text-[#079db9]">
                    ✓
                  </span>
                  <span className="font-semibold text-slate-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-24 py-24">
        <div className="mx-auto max-w-5xl px-5 text-center lg:px-8">
          <p className="mb-3 font-black uppercase tracking-[0.18em] text-[#08B8D8]">
            Simple starting point
          </p>
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
            Built around your property
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Pricing may vary based on property size, required modules,
            onboarding and custom configuration.
          </p>

          <div className="mx-auto mt-12 max-w-xl rounded-[32px] border-2 border-cyan-300 bg-white p-8 text-left shadow-2xl">
            <p className="font-black uppercase tracking-wide text-[#08B8D8]">
              MelyOS Platform
            </p>

            <div className="mt-6 border-b border-slate-200 pb-6">
              <p className="text-sm font-bold text-slate-500">Starting at</p>
              <p className="mt-1 text-5xl font-black">
                $199
                <span className="text-lg font-bold text-slate-500">/month</span>
              </p>
            </div>

            <div className="mt-6 space-y-4">
              {[
                "Interactive property management",
                "Resident and customer accounts",
                "Billing and payment management",
                "Maintenance request tracking",
                "Documents and leases",
                "Staff accounts and permissions",
              ].map((item) => (
                <div key={item} className="flex gap-3 font-semibold">
                  <span className="text-[#08B8D8]">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <p className="mt-7 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              Setup and onboarding start at $499. Transaction and processing
              fees may apply.
            </p>

            <a
              href="#demo"
              className="mt-7 block rounded-xl bg-[#08B8D8] px-7 py-4 text-center font-black text-white transition hover:bg-[#079db9]"
            >
              Request Custom Pricing
            </a>
          </div>
        </div>
      </section>

      <section id="demo" className="scroll-mt-24 px-5 pb-24 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[36px] bg-[#071A33] px-6 py-16 text-white sm:px-10 lg:px-16">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_440px]">
            <div>
              <p className="mb-3 font-black uppercase tracking-[0.18em] text-[#39d5ee]">
                Book a personalized demo
              </p>
              <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
                See how MelyOS can work for your property
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                Tell us about your business and we will show you the tools most
                relevant to your property and daily operations.
              </p>
            </div>

            <form
              className="rounded-3xl bg-white p-6 text-[#071A33] shadow-2xl"
              onSubmit={(event) => event.preventDefault()}
            >
              <div className="grid gap-4">
                <input
                  type="text"
                  placeholder="Full name"
                  className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-400"
                />
                <input
                  type="text"
                  placeholder="Business name"
                  className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-400"
                />
                <input
                  type="email"
                  placeholder="Business email"
                  className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-400"
                />
                <select
                  defaultValue=""
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-400"
                >
                  <option value="" disabled>
                    Property type
                  </option>
                  <option>RV Park</option>
                  <option>Campground</option>
                  <option>Marina</option>
                  <option>Mobile Home Community</option>
                  <option>RV Storage</option>
                  <option>Self Storage</option>
                  <option>Other</option>
                </select>
                <input
                  type="number"
                  placeholder="Number of spaces"
                  className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-[#08B8D8] px-6 py-4 font-black text-white transition hover:bg-[#079db9]"
                >
                  Request My Demo
                </button>
              </div>

              <p className="mt-4 text-center text-xs leading-5 text-slate-500">
                Submitting this form does not create an account or commit you
                to a purchase.
              </p>
            </form>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-4 lg:px-8">
          <div className="md:col-span-2">
            <img
              src="/melyos-logo-transparent.png"
              alt="MelyOS"
              className="h-14 w-auto"
            />
            <p className="mt-4 max-w-md leading-7 text-slate-600">
              Modern property management software for RV parks, campgrounds,
              marinas, communities and storage properties.
            </p>
          </div>

          <div>
            <p className="font-black">Platform</p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
              <a href="#features">Features</a>
              <a href="#industries">Industries</a>
              <a href="#portal">Resident Portal</a>
              <a href="#pricing">Pricing</a>
            </div>
          </div>

          <div>
            <p className="font-black">Company</p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
              <a href="#demo">Book a Demo</a>
              <a href="https://admin.melyos.io">Login</a>
              <a href="/privacy">Privacy Policy</a>
              <a href="/terms">Terms of Service</a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
            <p>© {new Date().getFullYear()} MelyOS. All rights reserved.</p>
            <p>Property Management, Reimagined.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}