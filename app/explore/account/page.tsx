import type { Metadata } from "next";
import SiteHeader from "../../components/site/Header";
import SiteFooter from "../../components/site/Footer";
import AccountView from "../../components/explore/AccountView";
export const metadata: Metadata = { title: "My account — MelyOS Explore", robots: { index: false } };
export default function Page() {
  return (<main className="min-h-screen overflow-x-hidden bg-slate-50 text-[#071A33]"><SiteHeader /><section className="pt-24"><div className="mx-auto max-w-4xl px-5 py-10"><AccountView /></div></section><SiteFooter /></main>);
}
