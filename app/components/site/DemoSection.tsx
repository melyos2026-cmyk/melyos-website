"use client";

import { useState } from "react";
import { Mail, MessageCircle, h2 } from "./data";

export default function DemoSection() {
  const [demo, setDemo] = useState({ name: "", business: "", email: "", phone: "", propertyType: "", spaces: "" });
  const [demoState, setDemoState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [demoError, setDemoError] = useState("");
  async function submitDemo(event: React.FormEvent) {
    event.preventDefault();
    setDemoState("sending");
    setDemoError("");
    try {
      const r = await fetch("/api/demo-request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(demo) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Something went wrong.");
      setDemoState("sent");
    } catch (e: any) {
      setDemoError(e.message);
      setDemoState("error");
    }
  }
  return (
    <>
      {/* Demo form */}
      <section id="demo" className="scroll-mt-24 px-5 pb-24 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[36px] bg-[#071A33] px-6 py-16 text-white sm:px-10 lg:px-16">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_440px]">
            <div>
              <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-[#39d5ee]">Book a free demo</p>
              <h2 className={h2}>See MelyOS working for your property</h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">Tell us about your property. We will show you the tools that matter to you and send you a custom quote, with no obligation.</p>
              <div className="mt-8 space-y-2 text-slate-200">
                <p className="flex items-center gap-2"><Mail className="h-5 w-5 text-[#39d5ee]" aria-hidden /><a className="font-bold underline" href="mailto:info@melyos.io">info@melyos.io</a></p>
                <p className="flex items-center gap-2"><MessageCircle className="h-5 w-5 text-[#39d5ee]" aria-hidden />Or chat with Mely, bottom right, any time.</p>
              </div>
            </div>
            <form className="rounded-3xl bg-white p-6 text-[#071A33] shadow-2xl" onSubmit={submitDemo}>
              {demoState === "sent" ? (
                <div className="py-10 text-center"><p className="text-2xl font-black">Thank you!</p><p className="mt-3 text-slate-600">We received your request. The MelyOS team will contact you soon to schedule your demo.</p></div>
              ) : (
                <div className="grid gap-4">
                  <input type="text" required value={demo.name} onChange={(e) => setDemo({ ...demo, name: e.target.value })} placeholder="Full name" className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-400" />
                  <input type="text" value={demo.business} onChange={(e) => setDemo({ ...demo, business: e.target.value })} placeholder="Business name" className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-400" />
                  <input type="email" required value={demo.email} onChange={(e) => setDemo({ ...demo, email: e.target.value })} placeholder="Business email" className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-400" />
                  <input type="tel" value={demo.phone} onChange={(e) => setDemo({ ...demo, phone: e.target.value })} placeholder="Phone (optional)" className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-400" />
                  <select value={demo.propertyType} onChange={(e) => setDemo({ ...demo, propertyType: e.target.value })} className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-400">
                    <option value="" disabled>Property type</option>
                    <option>RV Park</option><option>Marina</option><option>Campground</option><option>Mobile Home Community</option><option>RV / Boat Storage</option><option>Government property</option><option>Other</option>
                  </select>
                  <input type="number" value={demo.spaces} onChange={(e) => setDemo({ ...demo, spaces: e.target.value })} placeholder="Number of lots, sites or slips" className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-400" />
                  <button type="submit" disabled={demoState === "sending"} className="rounded-xl bg-[#08B8D8] px-6 py-4 font-black text-white transition hover:bg-[#079db9] disabled:opacity-60">{demoState === "sending" ? "Sending…" : "Request my demo"}</button>
                  {demoState === "error" && <p className="text-center text-sm text-red-600">{demoError}</p>}
                </div>
              )}
              <p className="mt-4 text-center text-xs leading-5 text-slate-500">Submitting this form does not create an account or commit you to a purchase.</p>
            </form>
          </div>
        </div>
      </section>

    </>
  );
}
