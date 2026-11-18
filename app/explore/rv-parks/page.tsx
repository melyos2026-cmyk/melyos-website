import type { Metadata } from "next";
import KindLanding from "../KindLanding";

export const metadata: Metadata = {
  title: "Search RV Parks",
  description: "Find RV parks and resorts in every U.S. state on an interactive map and request a site in one tap. Free for RVers.",
  alternates: { canonical: "/explore/rv-parks" },
};

export default function Page() {
  return <KindLanding kind="r" />;
}
