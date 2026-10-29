import type { Metadata } from "next";
import SiteHeader from "../components/site/Header";
import SiteFooter from "../components/site/Footer";
import { PageHero, FaqSection } from "../components/site/Sections";
import ReferForm from "../components/site/ReferForm";
import ReferShare from "../components/site/ReferShare";
import { eyebrow, h2 } from "../components/site/data";

// Oct 29 (per Mely): Referral Program (RV parks, campgrounds and marinas).
export const metadata: Metadata = {
  title: "Referral Program",
  description: "Know an RV park, campground or marina that could use MelyOS? Refer them: you earn 20% of their one-time setup fee, and they get their first month free.",
  alternates: { canonical: "/refer" },
};

const STEPS: [string, string][] = [
  ["Tell us about the property", "Send the property's name and how to reach the owner or manager. Anyone can refer: owners, staff, residents, vendors and friends."],
  ["We take it from there", "We contact the property, show them MelyOS and send them a custom quote. We let you know how it goes."],
  ["You earn when they join", "When the property signs and pays its setup fee, you earn your reward, and they get their first month free."],
];

const TERMS = [
  "Anyone 18 or older can refer. You can't refer yourself or a property you own or manage.",
  "A property counts once. If more than one person refers the same property, the first referral we receive counts.",
  "The property must be new to MelyOS (not already a customer or already talking with us).",
  "The reward is earned only when the referred property signs and pays its one-time setup fee. It is paid 30 days after that payment, as long as the setup fee was not refunded.",
  "Reward: 20% of the referred property's one-time setup fee, paid once. If you are a MelyOS customer, you can choose 1 free month of your platform fee instead.",
  "The referred property gets its first month of the platform fee free.",
  "Cash rewards are paid by bank transfer or Zelle. Before we pay a cash reward, we ask for a completed IRS Form W-9. If you receive $600 or more in a calendar year, we may send you a Form 1099. We never ask for tax ID numbers on this website.",
  "MelyOS may change or end this program at any time. Rewards already earned will still be paid.",
];

export default function Page() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#071A33]">
      <SiteHeader />
      <PageHero kicker="Referral Program" title="Know a property that needs MelyOS?" text="Refer an RV park, campground or marina. You earn 20% of their one-time setup fee, and they get their first month free." />

      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className={eyebrow}>How it works</p>
          <h2 className={h2}>Three simple steps</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {STEPS.map(([t, d], i) => (
              <div key={t} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#071A33] text-sm font-black text-white">{i + 1}</div>
                <h3 className="mt-4 text-lg font-black">{t}</h3>
                <p className="mt-2 leading-7 text-slate-600">{d}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <div className="rounded-3xl bg-[#071A33] p-7 text-white">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#39d5ee]">You earn</p>
              <p className="mt-3 text-3xl font-black">20% of the setup fee</p>
              <p className="mt-3 leading-7 text-slate-300">A one-time reward for each property that joins. MelyOS customers can choose 1 free month instead.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-cyan-50 p-7">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#079db9]">The property gets</p>
              <p className="mt-3 text-3xl font-black">First month free</p>
              <p className="mt-3 leading-7 text-slate-600">Their first month of the platform fee is on us.</p>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-5 rounded-3xl border border-slate-200 p-7 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-black">Share the program</h3>
              <p className="mt-1 text-slate-600">Send this page to someone who knows an RV park, campground or marina.</p>
            </div>
            <ReferShare />
          </div>
        </div>
      </section>

      <ReferForm />

      <section className="px-5 pb-16 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 p-7">
          <h2 className="text-2xl font-black">Program terms</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-7 text-slate-600">
            {TERMS.map((t) => <li key={t}>{t}</li>)}
          </ul>
          <p className="mt-4 text-sm text-slate-500">Questions? Email <a className="font-bold underline" href="mailto:info@melyos.io">info@melyos.io</a>.</p>
        </div>
      </section>

      <FaqSection items={[
        ["Do I have to own a property to refer one?", "No. Anyone 18 or older can refer an RV park, campground or marina: owners, staff, residents, vendors or friends."],
        ["When do I get paid?", "30 days after the property you referred pays its setup fee."],
        ["Why do you need a W-9?", "Before paying a cash reward we ask for an IRS Form W-9 so we can report payments correctly. We send it to you by email; we never ask for tax ID numbers on this website."],
      ]} />
      <SiteFooter />
    </main>
  );
}
