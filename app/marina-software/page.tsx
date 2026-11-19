import type { Metadata } from "next";
import SiteHeader from "../components/site/Header";
import SiteFooter from "../components/site/Footer";
import DemoSection from "../components/site/DemoSection";
import {PageHero, CapabilityGrid, HowItWorksSection, FaqSection, OnePlanSection } from "../components/site/Sections";
import ExperienceSection from "../components/site/ExperienceSection";

export const metadata: Metadata = {
  title: "Marina Management Software",
  description: "Marina software with an interactive slip map for wet slips, lift slips and dry storage, online slip reservations, contracts with e-signature, fuel dock and ship store point of sale, dry stack launches, boater accounts, billing with autopay and Send to Collections.",
  alternates: { canonical: "/marina-software" },
};

// Nov 18 (per Mely — "no enseñar todo lo que hacemos"): outcomes, not the list of modules.
const items: [string, string][] = [
  ["Slips that book themselves", "Boaters pick their slip and pay online, at any hour."],
  ["Payments without chasing", "Slip fees, reminders and receipts run on their own."],
  ["Your docks at a glance", "Know who is in every slip and what is owed, anytime."],
  ["Ready for public marinas", "Clear records and reports for city and county marinas."],
];

export default function Page() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#071A33]">
      <SiteHeader />
      <PageHero kicker="Marina management software" title="A marina office that runs itself" text="Slips, boaters, contracts, the fuel dock and the ship store in one platform, built around a live map of your docks and set up for you by our team." image="/interactive-slips-2026.jpg" imageAlt="Interactive marina slip map with an available slip selected" />
      <ExperienceSection />
      <CapabilityGrid kicker="What changes for you" title="Your marina, running smoother" items={items} />
      <HowItWorksSection />
      <OnePlanSection />
      <FaqSection items={[
        ["Do you support dry storage and lift slips?", "Yes. Wet slips, lift slips and dry storage are all supported, each with its own rates and on the same map."],
        ["Can boaters sign their slip contract online?", "Yes. The office sends the contract, the boater signs from their phone, and the invoices are created automatically."],
        ["Does it work for city or county marinas?", "Yes. Every payment is tied to an employee and a shift close, with resident and non-resident pricing and fee schedules with effective dates."],
        ["How much does it cost?", "Each marina gets a custom quote after a short call: a one-time setup and a monthly platform fee — month to month, or locked for 2 years with a 24-month agreement."],
      ]} />
      <DemoSection />
      <SiteFooter />
    </main>
  );
}
