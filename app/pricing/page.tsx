import type { Metadata } from "next";
import SiteHeader from "../components/site/Header";
import SiteFooter from "../components/site/Footer";
import DemoSection from "../components/site/DemoSection";
import { PageHero, PricingSection, HowItWorksSection, FaqSection } from "../components/site/Sections";

export const metadata: Metadata = {
  title: "Pricing",
  description: "MelyOS pricing is built around your property: a one-time done-for-you setup and a simple monthly platform fee, month to month with no long-term contract. Request a custom quote.",
  alternates: { canonical: "/pricing" },
};

export default function Page() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#071A33]">
      <SiteHeader />
      <PageHero kicker="Pricing" title="A quote built around your property" text="No packages that don't fit. After a short call we send you a custom quote: a one-time setup done by our team and a simple monthly platform fee." />
      <PricingSection />
      <HowItWorksSection />
      <FaqSection items={[
        ["Is there a long-term contract?", "No. The platform is month to month."],
        ["What is included in the setup?", "Your website on your domain, your property map, spaces, rates, fees and contracts configured, help bringing in your current customers, and staff training."],
        ["Are there card processing fees?", "Card and bank processing fees may apply to online payments. We explain them in your quote."],
        ["How do I get a price?", "Book a free demo or email info@melyos.io. We answer with a custom quote for your property."],
      ]} />
      <DemoSection />
      <SiteFooter />
    </main>
  );
}
