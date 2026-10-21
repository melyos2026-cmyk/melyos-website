import type { Metadata } from "next";
import SiteHeader from "../components/site/Header";
import SiteFooter from "../components/site/Footer";
import DemoSection from "../components/site/DemoSection";
import { PageHero, CapabilityGrid, FlowSection, OnePlanSection, FaqSection } from "../components/site/Sections";

// Oct 21 (per Mely): solution page for Google ("AI assistant for RV parks", "AI chatbot for marinas").
export const metadata: Metadata = {
  title: "AI Assistant for RV Parks, Campgrounds and Marinas",
  description: "Mely, the MelyOS AI assistant, answers your guests 24/7 on your website in their own language, using your real rates, rules and services, and helps your staff find anything in the system.",
  alternates: { canonical: "/ai-assistant-for-rv-parks-and-marinas" },
};

const items: [string, string][] = [
  ["Answers 24/7", "Guests get answers at night, on weekends and on holidays, without waiting for the office to open."],
  ["In their own language", "Mely replies in the language the guest writes in: English, Spanish and many more."],
  ["Knows your property", "Rates, stay lengths, rules, amenities, fuel prices and store items come from your own system."],
  ["Sends guests to book", "When a guest is ready, Mely points them to the map to pick a space and book online."],
  ["Helps your staff", "In the office, staff ask Mely how to do something or where to find it, and get step-by-step help."],
  ["Knows its limits", "For anything it can't answer, Mely gives your office contact instead of guessing."],
  ["Private by design", "Mely never shares one customer's information with another person."],
  ["Your name and look", "Mely appears on your website as part of your brand."],
  ["On every page", "Guests open Mely from a button on any page of your website, on phone or computer."],
];

export default function Page() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#071A33]">
      <SiteHeader />
      <PageHero kicker="Mely, your AI assistant" title="An assistant that never closes the office" text="Mely answers your guests 24/7 on your website, in their own language, using your real rates and rules, and helps your staff find anything in MelyOS." image="/hero-marina-2026.jpg" imageAlt="Marina at sunset" />
      <CapabilityGrid kicker="AI assistant" title="Fewer calls, faster answers" items={items} />
      <FlowSection kicker="How it works" title="From question to booking" steps={[
        ["A guest asks", "On your website, in any language, at any hour: rates, availability, rules or services."],
        ["Mely answers", "With your property's real information, in the guest's language."],
        ["The guest books", "Mely sends them to the map to book, or to your office for anything else."],
      ]} />
      <OnePlanSection />
      <FaqSection items={[
        ["Is Mely an extra module?", "No. Mely is included in the same MelyOS plan as the map, reservations and billing."],
        ["Which languages does Mely speak?", "Mely answers in the language the guest writes in, including English and Spanish."],
        ["Where does Mely get its answers?", "From your own MelyOS setup: your rates, rules, services and prices."],
        ["Can Mely see customers' private data?", "Mely never shares one customer's information with anyone else."],
      ]} />
      <DemoSection />
      <SiteFooter />
    </main>
  );
}
