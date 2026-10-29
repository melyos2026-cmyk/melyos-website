"use client";

import { useState } from "react";
import { Link2, Mail, Linkedin, MessageCircle, Check } from "lucide-react";

// Oct 29 (per Mely): share the Referral Program — copy link, email, WhatsApp, LinkedIn.
const URL = "https://melyos.io/refer";
const MSG = "MelyOS runs RV parks, marinas and campgrounds from one system: live map, bookings, payments, contracts and a resident portal. Refer an RV park, campground or marina: you earn 20% of their setup fee and they get their first month free.";

export default function ReferShare({ dark = false }: { dark?: boolean }) {
  const [copied, setCopied] = useState(false);
  const btn = dark
    ? "inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
    : "inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-[#071A33] transition hover:border-[#08B8D8]";
  async function copy() {
    try { await navigator.clipboard.writeText(URL); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  }
  return (
    <div className="flex flex-wrap gap-3">
      <button type="button" onClick={copy} className={btn}>{copied ? <Check className="h-4 w-4" aria-hidden /> : <Link2 className="h-4 w-4" aria-hidden />}{copied ? "Link copied" : "Copy link"}</button>
      <a className={btn} href={`mailto:?subject=${encodeURIComponent("Software for your RV park, campground or marina: MelyOS")}&body=${encodeURIComponent(`${MSG}\n\n${URL}`)}`}><Mail className="h-4 w-4" aria-hidden />Email</a>
      <a className={btn} target="_blank" rel="noopener noreferrer" href={`https://wa.me/?text=${encodeURIComponent(`${MSG} ${URL}`)}`}><MessageCircle className="h-4 w-4" aria-hidden />WhatsApp</a>
      <a className={btn} target="_blank" rel="noopener noreferrer" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(URL)}`}><Linkedin className="h-4 w-4" aria-hidden />LinkedIn</a>
    </div>
  );
}
