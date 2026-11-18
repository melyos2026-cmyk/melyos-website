"use client";
import { useState } from "react";
const inp = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-[15px] outline-none focus:border-[#08B8D8]";
// Nov 17: owner claim form (who you are + the correct info for the listing).
export default function ClaimForm({ state, listingKey, phone, website, kind }: { state: string; listingKey: string; phone: string; website: string; kind: string }) {
  const [f, setF] = useState<any>({ edits: { phone, website } });
  const [st, setSt] = useState<{ busy?: boolean; err?: string; done?: boolean }>({});
  const set = (k: string, v: any) => setF((x: any) => ({ ...x, [k]: v }));
  const setE = (k: string, v: any) => setF((x: any) => ({ ...x, edits: { ...x.edits, [k]: v } }));
  // Nov 18 (per Mely): the owner's own map (with permission to use it) and photos, uploaded with the claim
  const [maps, setMaps] = useState<File[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [consent, setConsent] = useState(false);
  const unit = kind === "m" ? "slip" : "site";
  async function upload(file: File, k: "map" | "photo") {
    const type = file.type || (/\.pdf$/i.test(file.name) ? "application/pdf" : /\.heic$/i.test(file.name) ? "image/heic" : "");
    const s = await fetch("/api/explore/claim-upload", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ state, listing_key: listingKey, kind: k, contentType: type, size: file.size }) }).then((x) => x.json()).catch(() => ({ error: "Upload failed." }));
    if (!s.signedUrl) throw new Error(s.error || "Upload failed.");
    const put = await fetch(s.signedUrl, { method: "PUT", headers: { "Content-Type": type, "x-upsert": "false" }, body: file });
    if (!put.ok) throw new Error(`Couldn't upload ${file.name}. Try again.`);
    return { kind: k, path: s.path, name: file.name };
  }
  async function go(e: React.FormEvent) {
    e.preventDefault();
    if (maps.length && !consent) { setSt({ err: "Check the box to let us use your map." }); return; }
    setSt({ busy: true });
    let files: any[] = [];
    try {
      for (const m of maps) files.push(await upload(m, "map"));
      for (const p of photos) files.push(await upload(p, "photo"));
    } catch (x: any) { setSt({ err: x.message }); return; }
    const r = await fetch("/api/explore/claim", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...f, state, listing_key: listingKey, files, map_consent: consent }) }).then((x) => x.json()).catch(() => ({ error: "Try again." }));
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
        {kind === "m" && <><input className={inp} inputMode="decimal" placeholder="Gas price today ($/gal)" value={f.edits.fuel_gas || ""} onChange={(e) => setE("fuel_gas", e.target.value)} />
          <input className={inp} inputMode="decimal" placeholder="Diesel price today ($/gal)" value={f.edits.fuel_diesel || ""} onChange={(e) => setE("fuel_diesel", e.target.value)} /></>}
        <textarea className={`${inp} sm:col-span-2`} rows={4} placeholder="Short description of your property" value={f.edits.description || ""} onChange={(e) => setE("description", e.target.value)} />
      </div></div>
      <div className="rounded-2xl border-2 border-dashed border-[#08B8D8]/60 bg-cyan-50/50 p-4">
        <p className="font-black">🗺️ Have a map of your {kind === "m" ? "marina" : "property"}? Upload it</p>
        <p className="mt-1 text-sm text-slate-600">Your site plan, brochure map or even a photo of the map in your office. We use it to build your <b>live {unit} map</b> — guests see which {unit}s are open and request (or book) the exact one.</p>
        <input type="file" multiple accept="image/*,application/pdf" className="mt-3 block w-full text-sm" onChange={(e) => setMaps(Array.from(e.target.files || []).slice(0, 4))} aria-label="Your property map" />
        {maps.length > 0 && <label className="mt-3 flex items-start gap-2 text-[13px] text-slate-700"><input type="checkbox" className="mt-0.5 h-4 w-4 accent-[#08B8D8]" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
          <span>I own this map or have the right to share it, and I give MelyOS LLC permission to use it to build my property&apos;s interactive map and show it on MelyOS Explore and my MelyOS pages.</span></label>}
      </div>
      <div className="rounded-2xl border border-slate-200 p-4">
        <p className="font-black">📸 Photos of your property</p>
        <p className="mt-1 text-sm text-slate-600">Up to 6. The first one becomes your listing photo.</p>
        <input type="file" multiple accept="image/*" className="mt-3 block w-full text-sm" onChange={(e) => setPhotos(Array.from(e.target.files || []).slice(0, 6))} aria-label="Photos of your property" />
      </div>
      {st.err && <p className="text-sm font-bold text-red-600">{st.err}</p>}
      <button disabled={st.busy} className="w-full rounded-xl bg-[#08B8D8] py-3.5 text-lg font-black text-white disabled:opacity-60">{st.busy ? (maps.length || photos.length ? "Uploading…" : "Sending…") : "Claim it free"}</button>
    </form>
  );
}
