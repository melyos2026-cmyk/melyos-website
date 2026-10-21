import type { Metadata } from "next";
import SiteHeader from "../components/site/Header";
import SiteFooter from "../components/site/Footer";
import DemoSection from "../components/site/DemoSection";
import { PageHero, CapabilityGrid, ServicesSection, HowItWorksSection, PortalSection, FaqSection } from "../components/site/Sections";

export const metadata: Metadata = {
  title: "Marina Management Software",
  description: "Marina software with an interactive slip map for wet slips, lift slips and dry storage, online slip reservations, contracts with e-signature, fuel dock and ship store point of sale, dry stack launches and boater accounts.",
  alternates: { canonical: "/marina-software" },
};

const items: [string, string][] = [
  ["Interactive slip map", "Wet slips, lift slips and dry storage on a live map. Boaters filter by length and reserve online."],
  ["Rates per slip or per foot", "Annual, seasonal, monthly, weekly and daily rates, with resident and non-resident pricing."],
  ["Contracts & renewals", "Slip agreements signed online with the price from your rates, and annual renewals sent in one click."],
  ["Fuel dock", "Sell fuel by gallon or dollar amount, track pumps and tank levels, deliveries and low-fuel alerts."],
  ["Ship store", "Point of sale with barcode scanning, inventory, low-stock alerts and charge-to-account."],
  ["Dry stack launches", "Boaters ask for their boat in the water from their phone; your team works from a launch board."],
  ["Boater accounts", "Boats, slip, balance, invoices, contracts and messages in one place for every boat owner."],
  ["Waitlist & event rooms", "Waitlist with slip offers, meeting-room bookings, insurance and registration expirations."],
  ["Built for municipal marinas", "Shift close-out per employee and a record for every payment, ready for city and county audits."],
];

export default function Page() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#071A33]">
      <SiteHeader />
      <PageHero kicker="Marina management software" title="A marina office that runs itself" text="Slips, boaters, contracts, the fuel dock and the ship store in one platform, built around a live map of your docks and set up for you by our team." image="/interactive-slips-2026.jpg" imageAlt="Interactive marina slip map with an available slip selected" />
      <CapabilityGrid kicker="Built for marinas, private & municipal" title="Everything from the dock to the office" items={items} />
      <PortalSection />
      <ServicesSection />
      <HowItWorksSection />
      <FaqSection items={[
        ["Do you support dry storage and lift slips?", "Yes. Wet slips, lift slips and dry storage are all supported, each with its own rates and on the same map."],
        ["Can boaters sign their slip contract online?", "Yes. The office sends the contract, the boater signs from their phone, and the invoices are created automatically."],
        ["Does it work for city or county marinas?", "Yes. Every payment is tied to an employee and a shift close, with resident and non-resident pricing and fee schedules with effective dates."],
        ["How much does it cost?", "Each marina gets a custom quote after a short call: a one-time setup and a monthly platform fee, month to month."],
      ]} />
      <DemoSection />
      <SiteFooter />
    </main>
  );
}
