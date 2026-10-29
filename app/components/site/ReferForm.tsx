"use client";

import { useState } from "react";
import { eyebrow, h2 } from "./data";

// Oct 29 (per Mely): Referral Program form → /api/referral.
const input = "w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-400";

export default function ReferForm() {
  const [f, setF] = useState({ yourName: "", yourEmail: "", yourPhone: "", isClient: false, clientPark: "", parkName: "", location: "", contactName: "", contactEmail: "", contactPhone: "", notes: "", agree: false });
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [err, setErr] = useState("");
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF({ ...f, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending"); setErr("");
    try {
      const r = await fetch("/api/referral", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Something went wrong.");
      setState("sent");
    } catch (x: any) { setErr(x.message); setState("error"); }
  }

  return (
    <section id="refer" className="scroll-mt-24 px-5 pb-16 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <p className={eyebrow}>Referral Program</p>
        <h2 className={h2}>Send us a referral</h2>
        <form onSubmit={submit} className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
          {state === "sent" ? (
            <div className="py-10 text-center">
              <p className="text-2xl font-black">Thank you!</p>
              <p className="mt-3 text-slate-600">We received your referral. We will contact the property and keep you posted.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              <fieldset className="grid gap-4">
                <legend className="mb-1 text-sm font-black uppercase tracking-[0.14em] text-slate-500">About you</legend>
                <div className="grid gap-4 sm:grid-cols-3">
                  <input className={input} required placeholder="Your full name" value={f.yourName} onChange={set("yourName")} />
                  <input className={input} required type="email" placeholder="Your email" value={f.yourEmail} onChange={set("yourEmail")} />
                  <input className={input} required type="tel" placeholder="Your phone" value={f.yourPhone} onChange={set("yourPhone")} />
                </div>
                <label className="flex items-center gap-3 text-slate-700">
                  <input type="checkbox" className="h-5 w-5 accent-[#08B8D8]" checked={f.isClient} onChange={set("isClient")} />
                  I'm a MelyOS customer
                </label>
                {f.isClient && <input className={input} placeholder="Your property name" value={f.clientPark} onChange={set("clientPark")} />}
              </fieldset>
              <fieldset className="grid gap-4">
                <legend className="mb-1 text-sm font-black uppercase tracking-[0.14em] text-slate-500">The property you're referring</legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input className={input} required placeholder="RV park, campground or marina name" value={f.parkName} onChange={set("parkName")} />
                  <input className={input} placeholder="City and state" value={f.location} onChange={set("location")} />
                  <input className={input} placeholder="Owner or manager name" value={f.contactName} onChange={set("contactName")} />
                  <input className={input} type="tel" placeholder="Their phone" value={f.contactPhone} onChange={set("contactPhone")} />
                  <input className={`${input} sm:col-span-2`} type="email" placeholder="Their email" value={f.contactEmail} onChange={set("contactEmail")} />
                </div>
                <textarea className={input} rows={3} placeholder="Anything we should know? (optional)" value={f.notes} onChange={set("notes")} />
              </fieldset>
              <label className="flex items-start gap-3 text-sm text-slate-600">
                <input type="checkbox" required className="mt-0.5 h-5 w-5 accent-[#08B8D8]" checked={f.agree} onChange={set("agree")} />
                <span>I am 18 or older and agree to the program terms below. I have the property contact's permission to share their information.</span>
              </label>
              <button type="submit" disabled={state === "sending"} className="rounded-xl bg-[#08B8D8] px-6 py-4 font-black text-white transition hover:bg-[#079db9] disabled:opacity-60">
                {state === "sending" ? "Sending…" : "Send referral"}
              </button>
              {state === "error" && <p className="text-center text-sm text-red-600">{err}</p>}
              <p className="text-center text-xs text-slate-500">Please give a phone or email for the property's contact. We never ask for tax ID numbers on this form.</p>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
