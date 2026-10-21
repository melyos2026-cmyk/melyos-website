import type { Metadata } from "next";
import SiteHeader from "../components/site/Header";
import SiteFooter from "../components/site/Footer";
import DemoSection from "../components/site/DemoSection";
import { PageHero, CapabilityGrid, FlowSection, OnePlanSection, FaqSection } from "../components/site/Sections";

// Oct 21 (per Mely): solution page for Google ("dry stack software").
export const metadata: Metadata = {
  title: "Dry Stack Marina Software",
  description: "Dry stack software for marinas: boaters request a launch from their phone, the dock team works from a launch board, boats are tracked by rack and every request has a status the boater can follow.",
  alternates: { canonical: "/dry-stack-software" },
};

const items: [string, string][] = [
  ["Launch requests from the phone", "Boaters pick the day and time they want their boat in the water, and when they plan to be back."],
  ["Launch board for the dock team", "Every request for the day in order, with boat, rack and time, so forklift operators know what is next."],
  ["Status the boater can follow", "Requested, confirmed, in the water and back on the rack. The boater sees each change in their account."],
  ["Racks on your map", "Every rack is on the live map of your marina with its size, rate and the boat stored on it."],
  ["Requests from anywhere", "Requests come from the boater's account, a phone call taken by staff or the Mely AI assistant."],
  ["Rack rates and contracts", "Annual, seasonal and monthly rack rates per foot, with storage contracts signed online."],
  ["Boats with several spaces", "An owner with a wet slip and a rack sees the launch button only under the boat stored on the rack."],
  ["No past dates", "Boaters can only pick upcoming times, and the return time has to be after the launch."],
  ["Same account for everything", "Rack storage, fuel, ship store and dockage in one boater account and one set of reports."],
];

export default function Page() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#071A33]">
      <SiteHeader />
      <PageHero kicker="Dry stack marina software" title="Boat in the water, without the phone calls" text="Boaters request a launch from their phone, your dock team works from one launch board, and every boat is tracked by rack on your live marina map." image="/interactive-slips-2026.jpg" imageAlt="Interactive marina map with slips and racks" />
      <CapabilityGrid kicker="Dry stack" title="Launches organized from request to return" items={items} />
      <FlowSection kicker="How it works" title="Three steps, no phone tag" steps={[
        ["The boater asks", "From their account they tap the boat on the rack and choose the launch time and the return time."],
        ["The dock team confirms", "The request appears on the launch board. Staff confirm it and the boater sees the confirmation."],
        ["Launch and return", "Staff mark the boat in the water and back on the rack. Everything stays in the boat's history."],
      ]} />
      <OnePlanSection />
      <FaqSection items={[
        ["Is dry stack an extra module?", "No. Dry stack launches are included in the same MelyOS plan as slips, contracts, billing and the fuel dock."],
        ["Do boaters need an app?", "No. They use their account on your marina website from any phone. No download needed."],
        ["Can staff add a request taken by phone?", "Yes. Staff can add requests from the office, and the boater sees them in their account."],
        ["Do racks show on the marina map?", "Yes. Racks are on the same live map as wet slips and lifts, each with its own rates."],
      ]} />
      <DemoSection />
      <SiteFooter />
    </main>
  );
}
