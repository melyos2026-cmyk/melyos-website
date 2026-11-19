import type { Metadata } from "next";
import SiteHeader from "../components/site/Header";
import SiteFooter from "../components/site/Footer";
import DemoSection from "../components/site/DemoSection";
import {PageHero, CapabilityGrid, HowItWorksSection, FaqSection, OnePlanSection } from "../components/site/Sections";
import ExperienceSection from "../components/site/ExperienceSection";

export const metadata: Metadata = {
  title: "RV Park Management Software",
  description: "RV park software with a live interactive lot map, online reservations, lease applications with background checks, resident portal, rent and utility billing, propane sales, Send to Collections and more. Set up for you by MelyOS.",
  alternates: { canonical: "/rv-park-software" },
};

// Nov 18 (per Mely — "no enseñar todo lo que hacemos"): outcomes, not the list of modules.
const items: [string, string][] = [
  ["Rent arrives on time", "Reminders, autopay and receipts go out on their own. You stop chasing."],
  ["Your lots stay full", "Guests find you and book their exact spot, day and night."],
  ["You know who moves in", "Every new resident is checked before they move in."],
  ["Less office, more life", "Fewer calls, no paper, and your whole park clear at a glance."],
];

export default function Page() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#071A33]">
      <SiteHeader />
      <PageHero kicker="RV park management software" title="Run your RV park from one live map" text="Reservations, long-term residents, billing and the front office in one platform, built around a map of your own park and set up for you by our team." image="/hero-interactive-map.png" imageAlt="Interactive RV park lot map on a tablet" />
      <ExperienceSection />
      <CapabilityGrid kicker="What changes for you" title="Your park, running smoother" items={items} />
      <HowItWorksSection />
      <OnePlanSection />
      <FaqSection items={[
        ["Does it work for both short stays and long-term residents?", "Yes. Nightly, weekly and monthly reservations live on the same map as your long-term residents and their leases."],
        ["Can residents pay online?", "Yes. Residents pay rent and other charges by card from the portal, can set up autopay, and the money goes to your own bank account."],
        ["Do you move our current residents into the system?", "We help bring your current residents, lots and balances into MelyOS during setup."],
        ["How much does it cost?", "Each park gets a custom quote after a short call: a one-time setup and a monthly platform fee — month to month, or locked for 2 years with a 24-month agreement."],
      ]} />
      <DemoSection />
      <SiteFooter />
    </main>
  );
}
