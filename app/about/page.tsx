import type { Metadata } from "next";
import SiteHeader from "../components/site/Header";
import SiteFooter from "../components/site/Footer";
import DemoSection from "../components/site/DemoSection";
import { PageHero, TrustSection, HowItWorksSection } from "../components/site/Sections";

export const metadata: Metadata = {
  title: { absolute: "About MelyOS | Property Management Software from Florida" },
  description: "MelyOS LLC builds property management software for RV parks, marinas and campgrounds from Kissimmee, Florida, working side by side with the owners and staff who use it.",
  alternates: { canonical: "/about" },
};

export default function Page() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#071A33]">
      <SiteHeader />
      <PageHero kicker="About MelyOS" title="Software built next to the people who run the property" text="MelyOS LLC is a Florida company in Kissimmee. We build every feature with park and marina owners and their front-office staff, and we set up each property ourselves." />
      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-3 lg:px-8">
          {[
            ["Our mission", "Give independent RV parks, marinas and campgrounds the same tools the big operators have, without the complexity or the long contracts."],
            ["How we work", "We start with how your property works today, then build your website, your map and your setup around it. You talk to the same team before and after launch."],
            ["What we care about", "Clear records, honest pricing, your customers' data kept private, and software your staff can learn in an afternoon."],
          ].map(([t, s]) => (
            <article key={t}><h2 className="text-2xl font-black">{t}</h2><p className="mt-3 leading-7 text-slate-600">{s}</p></article>
          ))}
        </div>
      </section>
      <TrustSection />
      <HowItWorksSection />
      <DemoSection />
      <SiteFooter />
    </main>
  );
}
