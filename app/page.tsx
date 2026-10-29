"use client";

// Oct 21 (per Mely): melyos.io home. Header, footer, demo form and sections are shared
// with the other pages (app/components/site). Only features that exist; no prices.
import SiteHeader from "./components/site/Header";
import SiteFooter from "./components/site/Footer";
import DemoSection from "./components/site/DemoSection";
import ReferShare from "./components/site/ReferShare";
import { HomeAudienceSection, HomePlatformSection, SeeItLiveSection, HowItWorksSection, TrustSection, ServicesSection, HomePricingBand, FaqSection, HOME_FAQ } from "./components/site/Sections";
import { cta } from "./components/site/data";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#071A33]">
      <SiteHeader />

      {/* Hero */}
      <section id="home" className="relative overflow-hidden bg-[#06182e] pt-20 md:pt-24">
        <img src="/hero-tablet-2026.jpg" alt="Marina and RV park interactive maps managed with MelyOS on a tablet" className="block h-auto w-full" />
        <div className="hidden xl:absolute xl:inset-x-0 xl:bottom-0 xl:top-24 xl:block xl:bg-gradient-to-r xl:from-[#06182e]/90 xl:via-[#06182e]/45 xl:via-[22%] xl:to-transparent xl:to-[34%]" />
        <div className="relative z-10 mx-auto max-w-7xl px-5 py-10 md:py-12 lg:px-8 xl:absolute xl:bottom-0 xl:left-0 xl:top-24 xl:flex xl:max-w-none xl:items-center xl:px-12 xl:py-0">
          <div className="max-w-xl text-white xl:max-w-[22rem]">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-white/10 px-3 py-1.5 text-[11px] font-black tracking-[0.18em] text-cyan-200 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#39d5ee]" /> RV PARKS · MARINAS · CAMPGROUNDS
            </div>
            <h1 className="text-4xl font-black leading-[1.05] tracking-tight lg:text-5xl xl:text-[2.4rem]">
              Run your property.
              <span className="mt-2 block text-[#39d5ee]">Not your day.</span>
            </h1>
            <p className="mt-4 max-w-md text-base leading-7 text-slate-200 xl:text-sm xl:leading-6">
              Reservations, payments, contracts and your customer portal, built around a live map of your property and set up for you.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row xl:mt-5 xl:gap-2.5">
              <a href="/demo" className={`${cta} whitespace-nowrap text-center xl:px-5 xl:py-3 xl:text-sm`}>Book a Free Demo</a>
              <a href="/features" className="rounded-xl border border-white/30 bg-white/10 whitespace-nowrap px-6 py-3.5 text-center font-black text-white xl:px-5 xl:py-3 xl:text-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20">Explore the Platform</a>
            </div>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-[13px] font-bold text-slate-200 xl:mt-4 xl:text-xs">
              <span>✓ Your own website & map</span><span>✓ Online payments</span><span>✓ Done-for-you setup</span>
            </div>
          </div>
        </div>
      </section>

      {/* Oct 29 (per Mely): reorganized home. Full feature lists moved to the detail pages
          (/features, /rv-park-software, /marina-software, /pricing); nothing was removed. */}
      <HomeAudienceSection />
      <HomePlatformSection />
      <ServicesSection />
      <HowItWorksSection />
      <SeeItLiveSection />
      <TrustSection />
      <HomePricingBand />
      <FaqSection items={HOME_FAQ} />
      {/* Oct 29 (per Mely): Referral Program band */}
      <section className="px-5 pb-16 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-[28px] bg-[#071A33] px-6 py-10 text-white sm:px-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#39d5ee]">Referral program</p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">Know a property that could use MelyOS?</h2>
            <p className="mt-3 leading-7 text-slate-300">Refer an RV park, campground or marina. You earn 20% of their one-time setup fee, and they get their first month free.</p>
            <a href="/refer" className="mt-5 inline-block rounded-xl bg-[#08B8D8] px-6 py-3 font-black text-white transition hover:bg-[#079db9]">Referral Program</a>
          </div>
          <ReferShare dark />
        </div>
      </section>
      <DemoSection />
      <SiteFooter />
    </main>
  );
}
