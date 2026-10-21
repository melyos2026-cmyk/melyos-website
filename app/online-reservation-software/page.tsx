import type { Metadata } from "next";
import SiteHeader from "../components/site/Header";
import SiteFooter from "../components/site/Footer";
import DemoSection from "../components/site/DemoSection";
import { PageHero, CapabilityGrid, FlowSection, OnePlanSection, FaqSection } from "../components/site/Sections";

// Oct 21 (per Mely): solution page for Google ("RV park reservation software", "marina reservation software").
export const metadata: Metadata = {
  title: "Online Reservation Software for RV Parks, Campgrounds and Marinas",
  description: "Guests pick their exact site or slip on a live map, choose dates and pay online. Nightly, weekly and monthly stays, seasonal rates, no double bookings, and confirmations sent automatically.",
  alternates: { canonical: "/online-reservation-software" },
};

const items: [string, string][] = [
  ["Pick the exact space on a map", "Guests see your real property, which lots, sites or slips are open, and tap the one they want."],
  ["Dates that can't double book", "The calendar blocks dates already taken, across online bookings and the ones your office adds."],
  ["Nightly, weekly and monthly", "Every stay length with its own rate, plus seasonal pricing and member or resident rates."],
  ["Pay online", "Guests pay by card when they book. The processing fee is shown before they pay, and the money goes to your bank."],
  ["Fits the boat or the RV", "Marina guests filter slips by boat length; RV guests see each site's size and hookups."],
  ["Long stays become leases", "Stays longer than a month send the guest to your lease application instead of a short booking."],
  ["Confirmations sent for you", "The guest gets a confirmation email and the space shows as reserved on your map right away."],
  ["Answers in any language", "Mely, the AI assistant on your website, answers guests' questions about stays and rates 24/7."],
  ["Your website, your brand", "Reservations live on your own website and domain, with your photos, rates and rules."],
];

export default function Page() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#071A33]">
      <SiteHeader />
      <PageHero kicker="Online reservations" title="Guests pick their spot on the map and pay online" text="Your property's real map on your own website. Guests choose the exact site or slip and the dates, see the price and book in minutes, day or night." image="/hero-tablet-2026.jpg" imageAlt="Guest booking a site on an interactive property map" />
      <CapabilityGrid kicker="Reservations" title="Bookings that run themselves" items={items} />
      <FlowSection kicker="How it works" title="From the map to a confirmed stay" steps={[
        ["The guest picks a spot", "On your website they open the live map and tap an open site or slip that fits."],
        ["Dates and price", "They choose the dates, see the exact price for that stay and pay online."],
        ["Confirmed everywhere", "The guest gets the confirmation and the space is reserved on your map and calendar."],
      ]} />
      <OnePlanSection />
      <FaqSection items={[
        ["Is online booking an extra module?", "No. Reservations are included in the same MelyOS plan as the map, contracts and billing."],
        ["Can guests book from their phone?", "Yes. The map and checkout work on any phone, tablet or computer."],
        ["Do I pay a commission per booking?", "No booking commissions. Card and bank processing fees may apply to online payments, and we explain them in your quote."],
        ["Can my office add bookings too?", "Yes. Bookings made by the office block the same dates, so nothing is booked twice."],
      ]} />
      <DemoSection />
      <SiteFooter />
    </main>
  );
}
