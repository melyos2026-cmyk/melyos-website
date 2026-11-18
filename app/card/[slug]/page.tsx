import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCard, tel } from "./data";

// Nov 18 (per Mely): a Sales Partner's digital business card — opens on the client's phone: call, text, email,
// save the contact, watch the MelyOS video and book a demo (the demo request carries the partner's name).
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCard(slug);
  if (!c) return { title: "MelyOS", robots: { index: false, follow: false } };
  const title = `${c.name} — Sales Partner, MelyOS`;
  const description = "Property management software for RV parks, marinas & campgrounds. Tap to call, save my contact or book a free demo.";
  return { title, description, robots: { index: false, follow: false },
    openGraph: { title, description, url: `https://melyos.io/card/${c.slug}`, siteName: "MelyOS", type: "profile", images: [{ url: "/melyos-share.jpg", width: 1200, height: 630, alt: "MelyOS" }] } };
}

const NAVY = "#0B1F3A", TEAL = "#0F7A8A";
function Btn({ href, children, primary, ext }: { href: string; children: React.ReactNode; primary?: boolean; ext?: boolean }) {
  return <a href={href} {...(ext ? { target: "_blank", rel: "noopener" } : {})} className={`flex min-h-[52px] items-center justify-center rounded-xl px-4 text-[15px] font-semibold tracking-wide transition active:scale-[0.98] ${primary ? "text-white" : "bg-white ring-1 ring-[#d9dee6]"}`} style={primary ? { background: NAVY } : { color: NAVY }}>{children}</a>;
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await getCard(slug);
  if (!c) notFound();
  const phone = tel(c.phone);
  return (
    <main className="min-h-screen bg-[#EEF1F5] px-4 py-8 sm:py-14" style={{ color: NAVY }}>
      <div className="mx-auto max-w-md overflow-hidden rounded-2xl bg-[#FBFAF7] shadow-[0_20px_60px_-20px_rgba(11,31,58,0.35)] ring-1 ring-[#e3e6eb]">
        <div className="px-8 pb-8 pt-9">
          <div className="flex items-start justify-between gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/melyos-logo-mark.png" alt="MelyOS" className="h-14 w-auto" />
            <div className="text-right">
              <p className="text-[11px] font-semibold tracking-[0.28em]">MELYOS LLC</p>
              <p className="mt-1 text-[12px] text-[#5B6B7F]">Property Management Software</p>
            </div>
          </div>
          <h1 className="mt-10 font-serif text-[40px] leading-[1.1]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>{c.name}</h1>
          <div className="mt-4 h-[2px] w-12" style={{ background: TEAL }} />
          <p className="mt-3 text-[12px] font-semibold tracking-[0.32em]" style={{ color: TEAL }}>SALES PARTNER</p>
          <dl className="mt-7 space-y-2 text-[16px]">
            {c.phone && <div className="flex gap-4"><dt className="w-4 text-[13px] font-semibold leading-6" style={{ color: TEAL }}>T</dt><dd><a href={`tel:${phone}`}>{c.phone}</a></dd></div>}
            {c.email && <div className="flex gap-4"><dt className="w-4 text-[13px] font-semibold leading-6" style={{ color: TEAL }}>E</dt><dd className="break-all"><a href={`mailto:${c.email}`}>{c.email}</a></dd></div>}
            <div className="flex gap-4"><dt className="w-4 text-[13px] font-semibold leading-6" style={{ color: TEAL }}>W</dt><dd><a href="https://melyos.io">melyos.io</a></dd></div>
          </dl>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {phone && <Btn href={`tel:${phone}`} primary>Call</Btn>}
            {phone && <Btn href={`sms:${phone}`}>Text</Btn>}
            {c.email && <Btn href={`mailto:${c.email}?subject=${encodeURIComponent("MelyOS")}`}>Email</Btn>}
            <Btn href={`/card/${c.slug}/contact`}>Save contact</Btn>
          </div>
          <div className="mt-3 grid gap-3">
            <Btn href={`/?partner=${encodeURIComponent(c.slug)}#demo`} primary>Book a free demo</Btn>
          </div>
        </div>
        <div className="border-t border-[#e3e6eb] bg-white px-8 py-7">
          <p className="text-[13px] font-semibold tracking-[0.2em]" style={{ color: TEAL }}>SEE MELYOS IN ONE MINUTE</p>
          <video className="mt-3 w-full rounded-xl bg-black" controls playsInline preload="none" poster="/video/melyos-video-poster.jpg"><source src="/video/melyos-video-2026.mp4?v=2" type="video/mp4" /></video>
          <p className="mt-4 text-[14px] leading-6 text-[#46566b]">A live map of your property with online reservations and payments, contracts, billing and a resident portal, all in one place. One plan, every tool included. Month-to-month.</p>
        </div>
        <div className="h-[6px]" style={{ background: `linear-gradient(${TEAL} 0 33%, ${NAVY} 33% 100%)` }} />
      </div>
      <p className="mx-auto mt-5 max-w-md text-center text-[12px] text-[#5B6B7F]">RV Parks · Marinas · Campgrounds · Kissimmee, Florida · MelyOS office (407) 564-6640</p>
    </main>
  );
}
