import type { Metadata } from "next";
import SiteHeader from "../components/site/Header";
import SiteFooter from "../components/site/Footer";
import DemoSection from "../components/site/DemoSection";
import { PageHero, CapabilityGrid, ServicesSection, HowItWorksSection, FaqSection } from "../components/site/Sections";

export const metadata: Metadata = {
  title: "Campground Reservation Software",
  description: "Campground software with an interactive site map, online reservations and payments, seasonal rates, guest portal, propane sales, staff roles and an AI assistant that answers guests 24/7.",
  alternates: { canonical: "/campground-software" },
};

const items: [string, string][] = [
  ["Interactive site map", "Every site on a live map with photos, size and hookups. Guests choose their exact site and dates."],
  ["Online booking & payments", "Nightly, weekly and monthly stays paid online, with your own check-in and check-out times."],
  ["Seasonal pricing", "Different rates by season and by length of stay, kept in one place."],
  ["Guest and resident portal", "Guests and long-stay campers see their balance, pay online and download receipts."],
  ["Propane sales", "Sell propane at the office or online, with QR pickup codes."],
  ["Mely answers guests 24/7", "An AI assistant on your website that answers questions about sites, rates and availability in any language."],
];

export default function Page() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#071A33]">
      <SiteHeader />
      <PageHero kicker="Campground reservation software" title="Fill your campground, skip the phone tag" text="Guests pick their site on a live map and pay online, while your office runs the calendar, billing and the front desk from one platform." image="/hero-interactive-map.png" imageAlt="Interactive campground site map" />
      <CapabilityGrid kicker="Built for campgrounds" title="From the first booking to check-out" items={items} />
      <ServicesSection />
      <HowItWorksSection />
      <FaqSection items={[
        ["Can guests book a specific site?", "Yes. Guests choose the exact site on your map, see its photo and hookups, and pay online."],
        ["Do I need a new website?", "No extra work: MelyOS includes your campground's own website with the booking map, on your domain."],
        ["How much does it cost?", "Each campground gets a custom quote after a short call: a one-time setup and a monthly platform fee, month to month."],
      ]} />
      <DemoSection />
      <SiteFooter />
    </main>
  );
}
