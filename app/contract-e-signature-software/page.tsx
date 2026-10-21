import type { Metadata } from "next";
import SiteHeader from "../components/site/Header";
import SiteFooter from "../components/site/Footer";
import DemoSection from "../components/site/DemoSection";
import { PageHero, CapabilityGrid, FlowSection, OnePlanSection, FaqSection } from "../components/site/Sections";

// Oct 21 (per Mely): solution page for Google ("marina contract software", "RV park lease e-signature").
export const metadata: Metadata = {
  title: "Contract & E-signature Software for Marinas and RV Parks",
  description: "Send slip agreements and leases to sign online. Prices come from your rate table, invoices are created on signing, the signed PDF is saved with a certificate page, and annual renewals go out in one click.",
  alternates: { canonical: "/contract-e-signature-software" },
};

const items: [string, string][] = [
  ["Your own contract templates", "Write your slip agreement or lease once, with fields that fill in the customer, boat or RV, space, dates and price."],
  ["Price from your rate table", "The price comes from your rates, so contracts, invoices and the customer's account always match. Changing it needs a reason."],
  ["Signed from any phone", "The customer reads and signs online with a clean adopted signature. No printing, scanning or app."],
  ["Signature record", "Date, time, IP address and a fingerprint of the exact text signed are saved with every contract."],
  ["Signed PDF on file", "A professional PDF with a certificate page is saved in the customer's documents and in your office."],
  ["Invoices created on signing", "One invoice or monthly payments, plus extras and the security deposit from your fee schedule."],
  ["Annual renewals in one click", "Send renewal contracts to everyone due, with no double billing for renewals already invoiced."],
  ["Status at a glance", "Sent, viewed, signed or cancelled, with the date of each step, for every contract."],
  ["Works for marinas and RV parks", "Slip, lift and rack agreements for marinas; leases and stays for RV parks and campgrounds."],
];

export default function Page() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#071A33]">
      <SiteHeader />
      <PageHero kicker="Contracts & e-signature" title="Contracts signed online, billed the moment they're signed" text="Send slip agreements and leases with the right price, let customers sign from their phone, and get the signed PDF and the invoices without typing anything twice." image="/interactive-slips-2026.jpg" imageAlt="Interactive marina map used to pick the slip for a contract" />
      <CapabilityGrid kicker="Contracts" title="From template to signed PDF" items={items} />
      <FlowSection kicker="How it works" title="Send, sign, bill" steps={[
        ["Send the contract", "Pick the customer, the space and the dates. The price and extras fill in from your rates and fees."],
        ["The customer signs", "They get an email, read the agreement in their account and sign it from any phone."],
        ["Invoices and the PDF", "The invoices are created and the signed PDF is saved for you and for the customer."],
      ]} />
      <OnePlanSection />
      <FaqSection items={[
        ["Is e-signature an extra module?", "No. Contracts and e-signature are included in the same MelyOS plan as the map, reservations and billing."],
        ["Can I use my own contract wording?", "Yes. You write your own templates. We also give you a professional sample to start from."],
        ["What is saved when someone signs?", "The signed text, the date and time, the IP address, a fingerprint of the document and a PDF with a certificate page."],
        ["Can I send renewals to everyone at once?", "Yes. Renewal contracts go to every customer that is due in one step."],
      ]} />
      <DemoSection />
      <SiteFooter />
    </main>
  );
}
