import type { Metadata } from "next";
import SiteHeader from "../components/site/Header";
import SiteFooter from "../components/site/Footer";
import { PageHero } from "../components/site/Sections";
import { eyebrow, h2 } from "../components/site/data";

// Nov 17 (per Mely): Careers page with links to the Sales Partner application and the Referral Program.
export const metadata: Metadata = {
  title: "Careers",
  description: "Work with MelyOS: become a Sales Partner or refer RV parks, campgrounds and marinas and earn a reward.",
  alternates: { canonical: "/careers" },
  openGraph: {
    title: "Careers at MelyOS",
    description: "Become a Sales Partner or join the Referral Program.",
    url: "https://melyos.io/careers",
    siteName: "MelyOS",
    type: "website",
  },
};

const ROLES = [
  {
    kicker: "Sales Partner",
    title: "Sell MelyOS and earn monthly",
    text: "Bring RV parks, campgrounds and marinas to MelyOS. Use the leads we give you or find your own. Work from anywhere, on your own schedule.",
    earn: "20% of the setup fee + 10% of the monthly plan for 12 paid months",
    href: "https://admin.melyos.io/sales/apply",
    cta: "Apply as a Sales Partner",
    dark: true,
  },
  {
    kicker: "Referral Program",
    title: "Know a property? Refer it",
    text: "No application needed. Tell us about an RV park, campground or marina, and we take it from there.",
    earn: "20% of the setup fee, once",
    href: "/refer",
    cta: "Refer a property",
    dark: false,
  },
];

export default function Page() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#071A33]">
      <SiteHeader />
      <PageHero kicker="Careers" title="Grow with MelyOS" text="We help RV parks, campgrounds and marinas run their business. Join us as a Sales Partner, or earn by referring a property." />

      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className={eyebrow}>Open opportunities</p>
          <h2 className={h2}>Which one is for you?</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {ROLES.map((r) => (
              <div key={r.kicker} className={`flex flex-col rounded-3xl p-7 ${r.dark ? "bg-[#071A33] text-white" : "border border-slate-200 bg-cyan-50"}`}>
                <p className={`text-sm font-black uppercase tracking-[0.18em] ${r.dark ? "text-[#39d5ee]" : "text-[#079db9]"}`}>{r.kicker}</p>
                <h3 className="mt-3 text-2xl font-black">{r.title}</h3>
                <p className={`mt-3 leading-7 ${r.dark ? "text-slate-300" : "text-slate-600"}`}>{r.text}</p>
                <p className={`mt-5 font-bold ${r.dark ? "text-white" : "text-[#071A33]"}`}>You earn: {r.earn}</p>
                <a href={r.href} className="mt-6 inline-block self-start rounded-xl bg-[#08B8D8] px-6 py-3 font-black text-white transition hover:bg-[#079db9]">{r.cta}</a>
              </div>
            ))}
          </div>
          <p className="mt-10 text-slate-600">Questions? Email <a className="font-bold underline" href="mailto:info@melyos.io">info@melyos.io</a>.</p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
