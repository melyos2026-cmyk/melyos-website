import type { Metadata } from "next";
import SiteHeader from "../components/site/Header";
import SiteFooter from "../components/site/Footer";
import DemoSection from "../components/site/DemoSection";
import { PageHero, CapabilityGrid, FlowSection, OnePlanSection, FaqSection } from "../components/site/Sections";

// Oct 21 (per Mely): solution page for Google ("RV park resident portal", "marina boater portal").
export const metadata: Metadata = {
  title: "Resident and Boater Portal for RV Parks and Marinas",
  description: "A customer portal for RV park residents and boat owners in English, Spanish or Portuguese: see the balance, pay by card or bank or set up autopay, sign contracts and agreements, download documents, request the Rec Hall, use the community marketplace and message the office, from any phone.",
  alternates: { canonical: "/customer-portal-software" },
};

const items: [string, string][] = [
  ["Balance and invoices", "Customers see what they owe, what is due and what is overdue, any time."],
  ["Pay online or autopay", "Pay by card or bank (ACH) from the phone, or turn on autopay. Next month's invoice can be paid ahead."],
  ["Contracts to sign", "Leases, slip agreements and resident agreements arrive in the account to read and sign online."],
  ["Documents and receipts", "Signed contracts, receipts and statements, ready to download."],
  ["Maintenance requests", "Send a request with photos and follow its status until it is done."],
  ["Messages with the office", "Notices from the office and private replies, without group chats."],
  ["Boats, RVs and vehicles", "Their boats, RV, vehicles and occupants on file, kept up to date."],
  ["Dry stack launches", "Boat owners ask for their boat in the water from the portal."],
  ["Community Marketplace", "Residents and boaters sell personal items and offer services to each other. Mely reviews every listing before it is published."],
  ["Rec Hall requests", "Residents request the Rec Hall or event room for a date and time, following your rules. The office approves or declines."],
  ["Their language, their alerts", "Residents use the portal in English, Spanish or Portuguese, with bell and phone alerts in their language when a payment is received, a late fee is added or a payment is returned."],
  ["Rentals and experiences", "Golf carts, boats, kayaks, tours and more, booked and paid from your website with online rental agreements."],
  ["Concierge requests", "Ice, provisions, catering, boat cleaning or crew to the slip, requested online and billed to the account."],
  ["Restaurant", "Menu, hours, delivery links and table reservations for the property's restaurant, with reservations visible in the customer's account."],
  ["Your brand, your website", "The portal lives on your own website, with your name and logo."],
];

export default function Page() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#071A33]">
      <SiteHeader />
      <PageHero kicker="Customer portal" title="Fewer calls to the office, happier customers" text="Residents and boat owners pay, sign, download documents and send requests from their phone, 24/7, on your own website." image="/interactive-slips-2026.jpg" imageAlt="Customer portal for a marina with slip details" />
      <CapabilityGrid kicker="Customer portal" title="Everything your customers ask the office for" items={items} />
      <FlowSection kicker="How it works" title="Ready on day one" steps={[
        ["We invite your customers", "During setup we bring your current customers in and they get access to their account."],
        ["They sign in", "From your website, on any phone. Boat owners sign in with just their email."],
        ["The office sees it all", "Payments, signatures, requests and messages show up in your office right away."],
      ]} />
      <OnePlanSection />
      <FaqSection items={[
        ["Is the portal an extra module?", "No. The customer portal is included in the same MelyOS plan as billing, contracts and the map."],
        ["Do customers need to download an app?", "No. The portal works on your website from any phone, tablet or computer."],
        ["Can customers set up autopay?", "Yes. They save a card or bank account once and their invoices are paid automatically."],
        ["Can the office send notices to everyone?", "Yes. Send a notice to one customer or a whole group; each one gets a private copy."],
      ]} />
      <DemoSection />
      <SiteFooter />
    </main>
  );
}
