import type { Metadata } from "next";
import { redirect } from "next/navigation";

// /search → the Explore map (Florida first).
export const metadata: Metadata = { title: "Search Marinas, RV Parks & Campgrounds", robots: { index: false } };
export default function Page() { redirect("/explore/fl"); }
