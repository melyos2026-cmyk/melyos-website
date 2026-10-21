import type { Metadata } from "next";
import SiteHeader from "../components/site/Header";
import SiteFooter from "../components/site/Footer";
import DemoSection from "../components/site/DemoSection";
import { PageHero, CapabilityGrid, FlowSection, OnePlanSection, FaqSection } from "../components/site/Sections";

// Oct 21 (per Mely): solution page for Google ("marina fuel dock software").
export const metadata: Metadata = {
  title: "Marina Fuel Dock Software",
  description: "Fuel dock software for marinas: sell fuel by the gallon or by dollar amount, track pumps and tank levels, log deliveries, get low-fuel alerts, charge fuel to a boater's account and post today's prices on your website.",
  alternates: { canonical: "/marina-fuel-dock-software" },
};

const items: [string, string][] = [
  ["Sell by gallon or dollar amount", "Ring up diesel or gas at the counter or the dock, with tax included or added, and a receipt for the boater."],
  ["Pumps and tanks", "Each pump is tied to its tank. Every sale lowers the tank level, so you always know how many gallons are left."],
  ["Deliveries log", "Record each fuel delivery with gallons and cost. Tank levels go back up and the history stays on file."],
  ["Low-fuel alerts", "Set a minimum for each tank and the office sees a warning before you run dry on a busy weekend."],
  ["Charge to the boater's account", "Members can put fuel on their account and pay it later with their dockage, online or at the office."],
  ["Today's prices on your website", "Change the price per gallon in one place and your website shows it right away."],
  ["Shift close and audit trail", "Every fuel sale is tied to the employee and the shift, ready for the end-of-day count and city or county audits."],
  ["Reports and QuickBooks", "Fuel sales by day, product and payment method, and an export for QuickBooks Online."],
  ["Same system as your slips", "Fuel, ship store, dockage and contracts in one boater account and one set of reports."],
];

export default function Page() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#071A33]">
      <SiteHeader />
      <PageHero kicker="Marina fuel dock software" title="Run the fuel dock from the same system as your slips" text="Sell fuel, watch your tanks and pumps, log deliveries and let members charge fuel to their account. Your website always shows today's prices." image="/hero-marina-2026.jpg" imageAlt="Marina docks with boats at sunset" />
      <CapabilityGrid kicker="Fuel dock" title="Everything the fuel dock needs" items={items} />
      <FlowSection kicker="How it works" title="From the pump to the report" steps={[
        ["Set your fuels and tanks", "Add diesel, gas or non-ethanol, the price per gallon and which pump draws from which tank."],
        ["Sell at the dock", "Staff ring up the sale by gallons or dollars; card, cash or charge to the boater's account."],
        ["Close the shift", "Fuel sales show in the shift close and the reports, and tank levels update on their own."],
      ]} />
      <OnePlanSection />
      <FaqSection items={[
        ["Is the fuel dock an extra module?", "No. The fuel dock is included in the same MelyOS plan as slips, contracts, billing and the ship store."],
        ["Can boaters charge fuel to their account?", "Yes. Members can charge fuel and pay it later online, together with their dockage."],
        ["Can I show fuel prices on my website?", "Yes. The price you set in the office shows on your marina website right away."],
        ["Does it connect to my pump controller?", "Today staff ring up each sale by gallons or dollar amount. Talk to us about your pump system during the demo."],
      ]} />
      <DemoSection />
      <SiteFooter />
    </main>
  );
}
