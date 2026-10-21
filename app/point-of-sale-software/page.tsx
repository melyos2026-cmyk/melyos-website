import type { Metadata } from "next";
import SiteHeader from "../components/site/Header";
import SiteFooter from "../components/site/Footer";
import DemoSection from "../components/site/DemoSection";
import { PageHero, CapabilityGrid, FlowSection, OnePlanSection, FaqSection } from "../components/site/Sections";

// Oct 21 (per Mely): solution page for Google ("marina ship store POS", "RV park point of sale").
export const metadata: Metadata = {
  title: "Point of Sale for Marina Ship Stores and RV Park Stores",
  description: "Point of sale for marina ship stores and RV park camp stores: barcode scanning with a scanner or a phone camera, items uploaded from a spreadsheet, inventory and low-stock alerts, propane and fuel sales, and charge to the customer's account.",
  alternates: { canonical: "/point-of-sale-software" },
};

const items: [string, string][] = [
  ["Scan barcodes your way", "Use a USB or Bluetooth barcode scanner at the counter, or the camera of any phone or tablet."],
  ["Upload your items in minutes", "Bring your whole catalog from a spreadsheet (CSV) with names, prices, barcodes and stock."],
  ["Inventory that counts itself", "Every sale lowers the stock. Low-stock alerts tell you what to reorder before it runs out."],
  ["Charge to the account", "Residents and boat owners can put purchases on their account and pay later with their rent or dockage."],
  ["Propane and fuel", "Sell propane by the gallon and fuel at the dock from the same system as the store."],
  ["Sales tax your way", "Set your tax rate once; receipts show the tax and the reports add it up for you."],
  ["Every sale tied to a shift", "Each employee opens and closes a shift with a drawer count, so the cash always adds up."],
  ["Reports and QuickBooks", "Sales by item, category, day and payment method, and an export for QuickBooks Online."],
  ["Your store on your website", "Show what you sell, like ice, bait, drinks and supplies, on your own website, with prices."],
];

export default function Page() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#071A33]">
      <SiteHeader />
      <PageHero kicker="Point of sale" title="A store counter that talks to the rest of your office" text="Scan, sell and track inventory for your ship store or camp store, and let customers charge purchases to the same account as their rent or dockage." image="/hero-marina-2026.jpg" imageAlt="Marina docks at sunset" />
      <CapabilityGrid kicker="Point of sale" title="Everything the counter needs" items={items} />
      <FlowSection kicker="How it works" title="Set up once, sell every day" steps={[
        ["Load your items", "Upload a spreadsheet or add items one by one with price, barcode and stock."],
        ["Scan and sell", "Scan with a scanner or a phone camera; pay by card or cash, or charge it to the account."],
        ["Close and count", "Close the shift with a drawer count. Stock, reports and the customer's account are already updated."],
      ]} />
      <OnePlanSection />
      <FaqSection items={[
        ["Is the point of sale an extra module?", "No. The point of sale is included in the same MelyOS plan as reservations, contracts and billing."],
        ["Which barcode scanners work?", "Any USB or Bluetooth scanner that types into the computer, or the camera of a phone or tablet."],
        ["Can I import my products?", "Yes. Upload a CSV spreadsheet with your items, prices, barcodes and stock."],
        ["Can customers charge purchases to their account?", "Yes. Purchases go on their account and they pay them online or at the office."],
      ]} />
      <DemoSection />
      <SiteFooter />
    </main>
  );
}
