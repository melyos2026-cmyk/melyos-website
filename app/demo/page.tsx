import type { Metadata } from "next";
import SiteHeader from "../components/site/Header";
import SiteFooter from "../components/site/Footer";
import DemoSection from "../components/site/DemoSection";
import { SeeItLiveSection } from "../components/site/Sections";

export const metadata: Metadata = {
  title: "Book a Free Demo",
  description: "Book a free MelyOS demo for your RV park, marina or campground. See the live map, bookings, payments, contracts and customer portal working, and get a custom quote.",
  alternates: { canonical: "/demo" },
};

export default function Page() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#071A33]">
      <SiteHeader />
      <div className="pt-28 md:pt-32" />
      <DemoSection />
      <SeeItLiveSection />
      <SiteFooter />
    </main>
  );
}
