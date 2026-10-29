import type { Metadata } from "next";
import SiteHeader from "../components/site/Header";
import SiteFooter from "../components/site/Footer";
import DemoSection from "../components/site/DemoSection";
import { PageHero, CapabilityGrid, FlowSection, OnePlanSection, FaqSection } from "../components/site/Sections";

// Oct 21 (per Mely): solution page for Google ("RV park billing software", "marina billing software").
export const metadata: Metadata = {
  title: "Billing & Payments Software for RV Parks and Marinas",
  description: "Recurring rent and dockage invoices with pay ahead, card and bank (ACH) payments with autopay, metered electric and water, late fees, instant payout, statements, payment history, collections referrals and an export for QuickBooks Online.",
  alternates: { canonical: "/billing-payments-software" },
};

const items: [string, string][] = [
  ["Recurring invoices", "Monthly rent, dockage and storage invoices go out on their own, on the day you choose. Customers can pay next month ahead."],
  ["Autopay", "Customers save a card or bank account once and pay every month without thinking about it."],
  ["Metered utilities", "Enter electric or water readings for any meter type and the charges land on the right invoice."],
  ["Late fees on your schedule", "Your grace days and late fee amounts, applied automatically and the same for everyone."],
  ["Paid online, deposited to you", "Customers pay by card or bank (ACH) from their phone and the money goes straight to your own bank account."],
  ["Instant payout", "Need it today? Get your card payments in your bank in about 30 minutes, any day. The regular deposit stays free."],
  ["Returned bank payments", "If a bank payment is returned, the invoice reopens with your returned-payment fee and the customer is emailed."],
  ["First month done right", "Prorate the first partial month or bill it by the day, your choice."],
  ["Statements and history", "Every invoice, payment and refund on one statement, for the customer and for your office."],
  ["Refunds with approval", "Refunds are recorded with who asked, who approved and why."],
  ["Export for QuickBooks", "Customers, invoices and payments ready for QuickBooks Online, plus printable PDFs with your logo."],
  ["Send to Collections", "Refer overdue accounts of former residents to a licensed collections agency right from MelyOS — the park accepts the agency's terms once, sends accounts manually, and tracks status and recoveries in one place."],
];

export default function Page() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#071A33]">
      <SiteHeader />
      <PageHero kicker="Billing & payments" title="Get paid on time, every month" text="Invoices that go out on their own, autopay, utilities and late fees handled for you, and online payments that land in your own bank account." image="/interactive-slips-2026.jpg" imageAlt="Interactive property map with billing for each space" />
      <CapabilityGrid kicker="Billing & payments" title="Less chasing, more collecting" items={items} />
      <FlowSection kicker="How it works" title="From invoice to deposit" steps={[
        ["Invoices go out", "Rent, dockage, utilities and extras are billed on schedule and show in each customer's account."],
        ["Customers pay online", "From their account, by card, bank or autopay. Late fees apply on their own if they don't."],
        ["Money in your bank", "Payments are deposited to your account and appear in your reports and QuickBooks export."],
      ]} />
      <OnePlanSection />
      <FaqSection items={[
        ["Is billing an extra module?", "No. Billing and online payments are included in the same MelyOS plan as the map, reservations and contracts."],
        ["Where does the money go?", "Straight to your own bank account. MelyOS never holds your rent or dockage."],
        ["Are there card processing fees?", "Card and bank processing fees may apply to online payments. We explain them in your quote."],
        ["Does it work with QuickBooks?", "Yes. Export customers, invoices and payments for QuickBooks Online in a few clicks."],
      ]} />
      <DemoSection />
      <SiteFooter />
    </main>
  );
}
