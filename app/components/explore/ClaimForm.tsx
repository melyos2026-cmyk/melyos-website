"use client";
import { useState } from "react";
const inp = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-[15px] outline-none focus:border-[#08B8D8]";
// Nov 17: owner claim form (who you are + the correct info for the listing).
export default function ClaimForm({ state, listingKey, phone, website, kind }: { state: string; listingKey: string; phone: string; website: string; kind: string }) {
  const [f, setF] = useState<any>({ edits: { phone, website } });
  const [st, setSt] = useState<{ busy?: boolean; err?: string; done?: boolean }>({});
  const set = (k: string, v: any) => setF((x: any) => ({ ...x, [k]: v }));
  const setE = (k: string, v: any) => setF((x: any) => ({ ...x, edits: { ...x.edits, [k]: v } }));
  async function go(e: React.FormEvent) {
    e.preventDefault(); setSt({ busy: true });
    const r = await fetch("/api/explore/claim", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...f, state, listing_key: listingKey }) }).then((x) => x.json()).catch(() => ({ error: "Try again." }));
    setSt(r.ok ? { done: true } : { err: r.error });
  }
  if (st.done) return <div className="mt-6 rounded-3xl border-2 border-emerald-300 bg-emerald-50 p-6"><p className="text-xl font-black text-emerald-800">✓ Claim received</p><p className="mt-2 text-emerald-900">We'll contact you to confirm it. Check your email for a copy.</p></div>;
  return (
    <form onSubmit={go} className="mt-6 space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <input type="text" className="hidden" tabIndex={-1} autoComplete="off" onChange={(e) => set("website_hp", e.target.value)} />
      <div><p className="mb-2 font-black">About you</p><div className="grid gap-2 sm:grid-cols-2">
        <input required className={inp} placeholder="Your name" value={f.name || ""} onChange={(e) => set("name", e.target.value)} />
        <select className={inp} value={f.role || ""} onChange={(e) => set("role", e.target.value)}><option value="">Your role</option><option>Owner</option><option>General manager</option><option>Dockmaster / office manager</option><option>Other staff</option></select>
        <input required type="email" className={inp} placeholder="Work email" value={f.email || ""} onChange={(e) => set("email", e.target.value)} />
        <input type="tel" className={inp} placeholder="Phone" value={f.phone || ""} onChange={(e) => set("phone", e.target.value)} />
      </div></div>
      <div><p className="mb-2 font-black">The correct info for your listing</p><div className="grid gap-2 sm:grid-cols-2">
        <input className={inp} placeholder="Public phone" value={f.edits.phone || ""} onChange={(e) => setE("phone", e.target.value)} />
        <input className={inp} placeholder="Website" value={f.edits.website || ""} onChange={(e) => setE("website", e.target.value)} />
        <input className={inp} placeholder={kind === "m" ? "Number of slips" : "Number of sites"} value={f.edits.spaces || ""} onChange={(e) => setE("spaces", e.target.value)} />
        <input className={inp} placeholder={kind === "m" ? "Max boat length (ft)" : "Max RV length (ft)"} value={f.edits.max_length || ""} onChange={(e) => setE("max_length", e.target.value)} />
        <input className={`${inp} sm:col-span-2`} placeholder="Rates (e.g. $2.50/ft per night · monthly from $650)" value={f.edits.rates || ""} onChange={(e) => setE("rates", e.target.value)} />
        <input className={`${inp} sm:col-span-2`} placeholder={kind === "m" ? "Amenities (fuel, pump-out, 30/50/100 amp, showers…)" : "Amenities (full hookups, Wi-Fi, pool, laundry…)"} value={f.edits.amenities || ""} onChange={(e) => setE("amenities", e.target.value)} />
        <input className={`${inp} sm:col-span-2`} placeholder="Photo link (https://… a photo of your property)" value={f.edits.photo_url || ""} onChange={(e) => setE("photo_url", e.target.value)} />
        {kind === "m" && <><input className={inp} inputMode="decimal" placeholder="Gas price today ($/gal)" value={f.edits.fuel_gas || ""} onChange={(e) => setE("fuel_gas", e.target.value)} />
          <input className={inp} inputMode="decimal" placeholder="Diesel price today ($/gal)" value={f.edits.fuel_diesel || ""} onChange={(e) => setE("fuel_diesel", e.target.value)} /></>}
        <textarea className={`${inp} sm:col-span-2`} rows={4} placeholder="Short description of your property" value={f.edits.description || ""} onChange={(e) => setE("description", e.target.value)} />
      </div></div>
      {st.err && <p className="text-sm font-bold text-red-600">{st.err}</p>}
      <button disabled={st.busy} className="w-full rounded-xl bg-[#08B8D8] py-3.5 text-lg font-black text-white disabled:opacity-60">{st.busy ? "Sending…" : "Claim it free"}</button>
    </form>
  );
}
