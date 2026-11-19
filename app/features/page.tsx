import type { Metadata } from "next";
import SiteHeader from "../components/site/Header";
import SiteFooter from "../components/site/Footer";
import DemoSection from "../components/site/DemoSection";
import ExperienceSection from "../components/site/ExperienceSection";
import { PageHero, HowItWorksSection, OnePlanSection, IndustriesSection } from "../components/site/Sections";

// Nov 18 (per Mely — "vender experiencia, no enseñar todo"): the Platform page talks about results, not the
// full list of tools. The tool pages still exist (linked in the footer for Google).
export const metadata: Metadata = {
  title: "The Platform",
  description: "MelyOS runs your RV park, marina or campground in one system — payments on time, your live map booked 24/7, screening you can trust and an office with less paper. Set up for you, built around what your property needs.",
  alternates: { canonical: "/features" },
};

export default function Page() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#071A33]">
      <SiteHeader />
      <PageHero kicker="The MelyOS platform" title="Your property, running smoother" text="One system built around how your property works — set up for you. Tell us what you need and we show you exactly that." image="/interactive-slips-2026.jpg" imageAlt="MelyOS interactive map" featuresHref="#how-it-works" />
      <ExperienceSection />
      <HowItWorksSection />
      <IndustriesSection />
      <OnePlanSection />
      <DemoSection />
      <SiteFooter />
    </main>
  );
}
