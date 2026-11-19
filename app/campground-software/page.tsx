import type { Metadata } from "next";
import SiteHeader from "../components/site/Header";
import SiteFooter from "../components/site/Footer";
import DemoSection from "../components/site/DemoSection";
import {PageHero, CapabilityGrid, HowItWorksSection, FaqSection, OnePlanSection } from "../components/site/Sections";
import ExperienceSection from "../components/site/ExperienceSection";

export const metadata: Metadata = {
  title: "Campground Reservation Software",
  description: "Campground software with an interactive site map, online reservations and payments, seasonal rates, guest portal, propane sales, staff roles, Send to Collections, QuickBooks export and an AI assistant that answers guests 24/7.",
  alternates: { canonical: "/campground-software" },
};

// Nov 18 (per Mely — "no enseñar todo lo que hacemos"): outcomes, not the list of modules.
const items: [string, string][] = [
  ["Booked while you sleep", "Campers choose their site and pay online, day and night."],
  ["Busy weekends, calm office", "Check-ins, payments and receipts are handled for you."],
  ["Every site earning", "Seasonal rates and a live map keep every site working."],
  ["Guests who come back", "An easy, modern experience from the very first click."],
];

export default function Page() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#071A33]">
      <SiteHeader />
      <PageHero kicker="Campground reservation software" title="Fill your campground, skip the phone tag" text="Guests pick their site on a live map and pay online, while your office runs the calendar, billing and the front desk from one platform." image="/hero-interactive-map.png" imageAlt="Interactive campground site map" />
      <ExperienceSection />
      <CapabilityGrid kicker="What changes for you" title="Your campground, running smoother" items={items} />
      <HowItWorksSection />
      <OnePlanSection />
      <FaqSection items={[
        ["Can guests book a specific site?", "Yes. Guests choose the exact site on your map, see its photo and hookups, and pay online."],
        ["Do I need a new website?", "No extra work: MelyOS includes your campground's own website with the booking map, on your domain."],
        ["How much does it cost?", "Each campground gets a custom quote after a short call: a one-time setup and a monthly platform fee — month to month, or locked for 2 years with a 24-month agreement."],
      ]} />
      <DemoSection />
      <SiteFooter />
    </main>
  );
}
