import type { Metadata } from "next";
import SiteHeader from "../components/site/Header";
import SiteFooter from "../components/site/Footer";
import DemoSection from "../components/site/DemoSection";
import { PageHero, CapabilityGrid, FlowSection, OnePlanSection, FaqSection } from "../components/site/Sections";

// Oct 21 (per Mely): solution page for Google ("RV park tenant screening", "RV park lease application").
// Never name the screening company.
export const metadata: Metadata = {
  title: "Online Applications & Background Checks for RV Parks",
  description: "Online lease applications for RV parks and mobile home communities with background checks, occupants, vehicles and pets. Review and approve from the office; the lease and the resident account are created for you.",
  alternates: { canonical: "/tenant-screening-software" },
};

const items: [string, string][] = [
  ["Online application", "Applicants apply from your website, with their RV, vehicles, occupants and pets."],
  ["Background checks built in", "Order a background check for each adult from the application. Results come back to your office."],
  ["Application fee collected", "The applicant pays the application and screening fees online when they apply."],
  ["Your rules", "You decide which stays need screening and what each fee is."],
  ["Review and approve", "See everything in one place and approve or decline with a note."],
  ["Lease created for you", "On approval the lease PDF is generated with your clauses and saved in the resident's documents."],
  ["Resident account ready", "The resident's portal account, the lot and the calendar are set up automatically."],
  ["Secure by design", "Applicant data is visible only to your office, never to other properties."],
  ["Same system as your park", "Applications, leases, billing and the map are all connected."],
];

export default function Page() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#071A33]">
      <SiteHeader />
      <PageHero kicker="Applications & screening" title="Know who moves in, before they move in" text="Online lease applications with background checks, reviewed and approved from your office. When you approve, the lease, the account and the lot are ready." image="/hero-tablet-2026.jpg" imageAlt="RV park map used to assign a lot to an approved applicant" />
      <CapabilityGrid kicker="Applications & screening" title="From application to move-in" items={items} />
      <FlowSection kicker="How it works" title="Apply, screen, approve" steps={[
        ["They apply online", "From your website, with their details, occupants, vehicles and pets, and pay the fees."],
        ["Screening runs", "Background checks are ordered for each adult and the results come back to your office."],
        ["You approve", "Approve with one click. The lease, the resident account and the lot are set up for you."],
      ]} />
      <OnePlanSection />
      <FaqSection items={[
        ["Are background checks included?", "The screening tool is included in your MelyOS plan. Each background check has a per-person cost, which you can pass to the applicant."],
        ["Can I skip screening for short stays?", "Yes. You decide which stays need an application and screening."],
        ["Who sees the applicant's information?", "Only your office. Applicant data is never shared with other properties."],
        ["Is the lease created automatically?", "Yes. On approval, the lease PDF is generated with your clauses and saved in the resident's documents."],
      ]} />
      <DemoSection />
      <SiteFooter />
    </main>
  );
}
