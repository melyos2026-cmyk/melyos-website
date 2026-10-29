import type { Metadata } from "next";
import SiteHeader from "../components/site/Header";
import SiteFooter from "../components/site/Footer";
import DemoSection from "../components/site/DemoSection";
import { PageHero, FeaturesSection, MapSection, RvMarinaSection, PortalSection, ServicesSection, IndustriesSection } from "../components/site/Sections";

export const metadata: Metadata = {
  title: "Features",
  description: "All MelyOS features: interactive property map, online reservations, card and bank payments with autopay, billing, customer portal in three languages, contracts and resident agreements with e-signature, background checks, waitlist, Rec Hall requests, marketplace, Send to Collections, point of sale, messages, maintenance, staff roles, reports, QuickBooks export and an AI assistant.",
  alternates: { canonical: "/features" },
};

export default function Page() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#071A33]">
      <SiteHeader />
      <PageHero kicker="The MelyOS platform" title="Every tool your property needs, connected" text="One system for the map, bookings, billing, contracts, the customer portal and daily operations. Every screen talks to the others." image="/interactive-slips-2026.jpg" imageAlt="MelyOS interactive map" />
      <FeaturesSection />
      <MapSection />
      <RvMarinaSection />
      <PortalSection />
      <ServicesSection />
      <IndustriesSection />
      <DemoSection />
      <SiteFooter />
    </main>
  );
}
