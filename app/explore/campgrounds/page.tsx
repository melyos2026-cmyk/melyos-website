import type { Metadata } from "next";
import KindLanding from "../KindLanding";

export const metadata: Metadata = {
  title: "Search Campgrounds",
  description: "Find campgrounds in every U.S. state on an interactive map and request a site in one tap. Free for campers.",
  alternates: { canonical: "/explore/campgrounds" },
};

export default function Page() {
  return <KindLanding kind="c" />;
}
