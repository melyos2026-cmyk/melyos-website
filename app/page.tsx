"use client";

// Oct 21 (per Mely): melyos.io home. Header, footer, demo form and sections are shared
// with the other pages (app/components/site). Only features that exist; no prices.
import SiteHeader from "./components/site/Header";
import SiteFooter from "./components/site/Footer";
import DemoSection from "./components/site/DemoSection";
import { FeaturesSection, MapSection, RvMarinaSection, SeeItLiveSection, PortalSection, IndustriesSection, HowItWorksSection, TrustSection, ServicesSection, PricingSection } from "./components/site/Sections";
import { cta } from "./components/site/data";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#071A33]">
      <SiteHeader />

      {/* Hero */}
      <section id="home" className="relative overflow-hidden bg-[#06182e] pt-20 md:pt-24">
        <img src="/hero-tablet-2026.jpg" alt="Marina and RV park interactive maps managed with MelyOS on a tablet" className="block h-auto w-full md:absolute md:inset-x-0 md:top-24 md:h-[calc(100%-6rem)] md:object-cover md:object-right" />
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
              <a href="/demo" className={`${cta} text-center sm:px-8 sm:py-4`}>Book a Free Demo</a>
              <a href="/features" className="rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 text-center font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20 sm:px-8 sm:py-4">Explore the Platform</a>
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

      <FeaturesSection />
      <MapSection />
      <RvMarinaSection />
      <SeeItLiveSection />
      <PortalSection />
      <IndustriesSection />
      <HowItWorksSection />
      <TrustSection />
      <ServicesSection />
      <PricingSection />
      <DemoSection />
      <SiteFooter />
    </main>
  );
}
