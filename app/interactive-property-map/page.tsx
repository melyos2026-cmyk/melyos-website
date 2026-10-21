import type { Metadata } from "next";
import SiteHeader from "../components/site/Header";
import SiteFooter from "../components/site/Footer";
import DemoSection from "../components/site/DemoSection";
import { PageHero, CapabilityGrid, FlowSection, OnePlanSection, FaqSection } from "../components/site/Sections";

// Oct 21 (per Mely): solution page for Google ("interactive RV park map", "interactive marina slip map").
export const metadata: Metadata = {
  title: "Interactive Map for RV Parks, Campgrounds and Marinas",
  description: "A live, interactive map of your RV park, campground or marina. Every lot, site or slip shows if it is open, occupied, reserved or under maintenance, with photos, size and hookups, on your website and in your office.",
  alternates: { canonical: "/interactive-property-map" },
};

const items: [string, string][] = [
  ["Your real property", "Drawn over an aerial view of your own park or marina, so guests recognize every road, dock and building."],
  ["Status by color", "Open, occupied, reserved or under maintenance, updated the moment something changes."],
  ["Details on every space", "Tap a lot or slip to see its photo, size, hookups, price and when it opens."],
  ["On your website", "Guests browse the map, filter by RV or boat length and book the exact space they want."],
  ["In your office", "Staff see the same live map, open any space and go straight to the customer, invoice or contract."],
  ["Wet slips, lifts, racks and lots", "Marina slips, lift slips, dry storage racks, RV lots, campsites, cabins and storage spaces on one map."],
  ["Connected to everything", "Bookings, move-ins, move-outs, contracts and maintenance change the map automatically."],
  ["Built for you", "Our team draws your map during setup. You can update the details of each space anytime."],
  ["Works on any screen", "Phones, tablets and computers, for guests and for staff."],
];

export default function Page() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#071A33]">
      <SiteHeader />
      <PageHero kicker="Interactive property map" title="Your whole property, live on one map" text="Every lot, site or slip on a real map of your property, showing what is open right now. Guests book from it on your website and your staff run the office from it." image="/hero-tablet-2026.jpg" imageAlt="Interactive RV park and marina map on a tablet" />
      <CapabilityGrid kicker="Interactive map" title="The heart of MelyOS" items={items} />
      <FlowSection kicker="How it works" title="From aerial photo to live map" steps={[
        ["We draw your map", "During setup our team traces every space over an aerial view of your property."],
        ["We connect your data", "Sizes, hookups, photos and rates are added to each space, along with your current customers."],
        ["It stays live", "Bookings, contracts and move-outs update the map on their own, on your website and in the office."],
      ]} />
      <OnePlanSection />
      <FaqSection items={[
        ["Is the map an extra module?", "No. The interactive map is included in the same MelyOS plan as reservations, contracts and billing."],
        ["Do I have to draw the map myself?", "No. Our team builds it for you during setup. You can edit each space's details later."],
        ["Can guests book from the map?", "Yes. They tap an open space on your website, choose dates and pay online."],
        ["Does it work for marinas?", "Yes. Wet slips, lift slips and dry storage racks each show with their own size and rates."],
      ]} />
      <DemoSection />
      <SiteFooter />
    </main>
  );
}
