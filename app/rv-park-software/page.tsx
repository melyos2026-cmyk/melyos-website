import type { Metadata } from "next";
import SiteHeader from "../components/site/Header";
import SiteFooter from "../components/site/Footer";
import DemoSection from "../components/site/DemoSection";
import { PageHero, CapabilityGrid, RvMarinaSection, ServicesSection, HowItWorksSection, PortalSection, FaqSection } from "../components/site/Sections";

export const metadata: Metadata = {
  title: "RV Park Management Software",
  description: "RV park software with a live interactive lot map, online reservations, lease applications with background checks, resident portal, rent and utility billing, propane sales and more. Set up for you by MelyOS.",
  alternates: { canonical: "/rv-park-software" },
};

const items: [string, string][] = [
  ["Interactive lot map", "Your real park drawn as a live map. Guests pick their exact lot and dates; your office sees who is where."],
  ["Online reservations", "Nightly, weekly and monthly stays with seasonal pricing. The calendar never double-books a lot."],
  ["Applications & background checks", "Long-term residents apply online with occupants, vehicles and pets, and screening is ordered from the application."],
  ["Resident portal", "Residents pay rent, set up autopay, download documents, send maintenance and move-out requests."],
  ["Rent & utility billing", "Recurring rent, electric meter readings (any meter type), laundry, late fees and statements."],
  ["Leases & e-signature", "Lease documents generated from your terms and signed online, saved to the resident's file."],
  ["Propane sales", "Sell propane at the office or online with QR pickup codes and per-product tax settings."],
  ["Rent-to-own & real estate", "Payment plans with progress tracking and a bill of sale on payoff, plus listings for homes for sale."],
  ["Storage lots & events", "RV and boat storage lots, park events calendar, and notices to every resident."],
];

export default function Page() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#071A33]">
      <SiteHeader />
      <PageHero kicker="RV park management software" title="Run your RV park from one live map" text="Reservations, long-term residents, billing and the front office in one platform, built around a map of your own park and set up for you by our team." image="/hero-interactive-map.png" imageAlt="Interactive RV park lot map on a tablet" />
      <CapabilityGrid kicker="Built for RV parks" title="Everything your park office handles" items={items} />
      <RvMarinaSection only="rv-parks" />
      <PortalSection />
      <ServicesSection />
      <HowItWorksSection />
      <FaqSection items={[
        ["Does it work for both short stays and long-term residents?", "Yes. Nightly, weekly and monthly reservations live on the same map as your long-term residents and their leases."],
        ["Can residents pay online?", "Yes. Residents pay rent and other charges by card from the portal, can set up autopay, and the money goes to your own bank account."],
        ["Do you move our current residents into the system?", "We help bring your current residents, lots and balances into MelyOS during setup."],
        ["How much does it cost?", "Each park gets a custom quote after a short call: a one-time setup and a monthly platform fee, month to month."],
      ]} />
      <DemoSection />
      <SiteFooter />
    </main>
  );
}
