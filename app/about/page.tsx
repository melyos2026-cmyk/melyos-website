import type { Metadata } from "next";
import SiteHeader from "../components/site/Header";
import SiteFooter from "../components/site/Footer";
import DemoSection from "../components/site/DemoSection";
import { PageHero, HowItWorksSection } from "../components/site/Sections";
import { eyebrow, h2, cta } from "../components/site/data";

// Oct 21 (per Mely): About Us with the founder's story and photo.
// Woman-owned / Hispanic-owned stated as fact; NOT "certified" until the OSD certification is granted.
export const metadata: Metadata = {
  title: { absolute: "About MelyOS | Woman-Owned Property Management Software from Florida" },
  description: "MelyOS LLC is a woman-owned, Hispanic-owned company in Kissimmee, Florida. Founded by Melissa Santiago, it builds property management software for RV parks, marinas and campgrounds next to the owners and staff who use it.",
  alternates: { canonical: "/about" },
};

const values: [string, string][] = [
  ["Honest pricing", "One plan with everything included, month to month. No add-on modules and no long contracts."],
  ["Your data stays yours", "Your customers' information is never shared or sold, and every property only sees its own."],
  ["Clear records", "Every payment, contract and change is tracked, ready for your accountant or a city audit."],
  ["Easy to learn", "Software your staff can pick up in an afternoon, with Mely, our AI assistant, there to help."],
];

export default function Page() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#071A33]">
      <SiteHeader />
      <PageHero kicker="About MelyOS" title="Built in Kissimmee, Florida, side by side with the people who run the property" text="MelyOS LLC is a woman-owned, Hispanic-owned Florida company. We build every feature next to park and marina owners and their front-office staff, and we set up each property ourselves." image="/interactive-slips-2026.jpg" imageAlt="MelyOS interactive marina map built for a property" />

      {/* Our story */}
      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 md:grid-cols-[320px_1fr] lg:gap-16 lg:px-8">
          <figure className="mx-auto w-full max-w-[320px] text-center">
            <img src="/founder-melissa.jpg" alt="Melissa Santiago, founder of MelyOS" className="aspect-square w-full rounded-full object-cover shadow-xl ring-4 ring-cyan-100" />
            <figcaption className="mt-5">
              <p className="text-lg font-black">Melissa Santiago</p>
              <p className="text-sm font-semibold text-slate-500">Founder, MelyOS LLC</p>
            </figcaption>
          </figure>
          <div>
            <p className={eyebrow}>Our story</p>
            <h2 className={h2}>It started inside a real RV park</h2>
            <div className="mt-6 space-y-4 text-lg leading-8 text-slate-600">
              <p>MelyOS started in 2026 inside a working RV park. Our founder, Melissa Santiago, spent months next to the park&apos;s front office, watching how residents paid rent, how lots were booked, how contracts were signed, and how much of the day went to paperwork and phone calls.</p>
              <p>She built MelyOS to fix that: one system, built around a live map of the property, that handles reservations, payments, contracts and the customer portal, so the office can spend its time on people instead of spreadsheets.</p>
              <p>That first park still runs on MelyOS every day. Every feature since then, from marinas and fuel docks to dry stack launches, was built the same way: next to the owners and staff who use it.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission and how we work */}
      <section className="bg-slate-50 py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-2 lg:px-8">
          <div>
            <p className={eyebrow}>Our mission</p>
            <h2 className="text-3xl font-black tracking-tight">The tools the big operators have, without the complexity</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">We give independent RV parks, marinas and campgrounds one connected platform, without add-on modules or long contracts.</p>
          </div>
          <div>
            <p className={eyebrow}>How we work</p>
            <ul className="space-y-4 text-lg leading-8 text-slate-600">
              <li className="flex gap-3"><span className="mt-1 font-black text-[#08B8D8]">✓</span><span>We start with how your property works today, not with a template.</span></li>
              <li className="flex gap-3"><span className="mt-1 font-black text-[#08B8D8]">✓</span><span>Our team builds your website, draws your map and sets up your rates, contracts and staff accounts for you.</span></li>
              <li className="flex gap-3"><span className="mt-1 font-black text-[#08B8D8]">✓</span><span>You talk to the same people before and after launch.</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="mx-auto mb-10 max-w-3xl text-center"><p className={eyebrow}>What we stand for</p><h2 className={h2}>How we treat your property and your customers</h2></div>
          <div className="grid gap-5 sm:grid-cols-2">
            {values.map(([t, s]) => (
              <article key={t} className="rounded-3xl border border-slate-200 bg-white p-7">
                <h3 className="text-lg font-black">{t}</h3>
                <p className="mt-2 leading-7 text-slate-600">{s}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Woman-owned */}
      <section className="bg-[#06182e] py-16 text-white md:py-20">
        <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-300">A Florida company</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Woman-owned and Hispanic-owned</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">MelyOS LLC is based in Kissimmee, Florida, and proudly founded and owned by a Hispanic woman. We serve private and municipal properties across the United States, and we work with you in English or Spanish. <span className="font-bold text-white">Se habla español.</span></p>
          <a href="/demo" className={`${cta} mt-8 inline-block`}>Book a demo</a>
        </div>
      </section>

      <HowItWorksSection />
      <DemoSection />
      <SiteFooter />
    </main>
  );
}
