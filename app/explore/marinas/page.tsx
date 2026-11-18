import type { Metadata } from "next";
import KindLanding from "../KindLanding";

export const metadata: Metadata = {
  title: "Search Marinas",
  description: "Find marinas in every U.S. state on an interactive map and request a slip or mooring in one tap. Free for boaters.",
  alternates: { canonical: "/explore/marinas" },
};

export default function Page() {
  return <KindLanding kind="m" />;
}
