"use client";
import { useEffect, useState } from "react";
import { useBoater, post } from "./useBoater";

// Nov 17 (per Mely): on every Explore listing — ♡ Save, Request a slip / site, reviews (read + write).
type L = { state: string; listing_key: string; listing_name: string; kind: string; slip?: string };
const inp = "w-full rounded-xl border border-slate-300 px-3 py-2.5 text-[15px] outline-none focus:border-[#08B8D8]";
const Stars = ({ n, size = "text-base" }: { n: number; size?: string }) => <span className={`${size} text-amber-500`} aria-label={`${n} of 5 stars`}>{"★★★★★".slice(0, Math.round(n))}<span className="text-slate-300">{"★★★★★".slice(Math.round(n))}</span></span>;

export function FavoriteButton(l: L) {
  const { me, reload } = useBoater();
  const on = !!me?.favorites?.some((f: any) => f.listing_key === l.listing_key);
  const [busy, setBusy] = useState(false);
  async function toggle() {
    if (!me?.boater) { location.href = `/explore/account?next=${encodeURIComponent(location.pathname)}`; return; }
    setBusy(true); try { await post("/api/explore/me", { action: "favorite", on: !on, ...l, listing_kind: l.kind }); await reload(); } finally { setBusy(false); }
  }
  return <button type="button" disabled={busy} onClick={toggle} className={`rounded-xl border px-4 py-2.5 text-sm font-black transition ${on ? "border-rose-300 bg-rose-50 text-rose-700" : "border-white/30 bg-white/10 text-white hover:bg-white/20"}`}>{on ? "♥ Saved" : "♡ Save"}</button>;
}

export function RequestForm(l: L) {
  const { me } = useBoater();
  const unit = l.kind === "m" ? "slip" : "site";
  const [f, setF] = useState<any>({ stay_type: "night", vessel: { kind: l.kind === "m" ? "boat" : "rv" } });
  const [st, setSt] = useState<{ busy?: boolean; err?: string; done?: boolean; forwarded?: boolean }>({});
  useEffect(() => {
    if (!me?.boater) return;
    const v = me.vessels?.[0];
    setF((x: any) => ({ ...x, name: x.name || me.boater!.name, email: x.email || me.boater!.email, phone: x.phone || me.boater!.phone || "", ...(v && !x.vessel?.length_ft ? { vessel: { kind: v.kind, length_ft: v.length_ft || "", beam_ft: v.beam_ft || "", draft_ft: v.draft_ft || "", power_amp: v.power_amp || "", name: v.name || "" } } : {}) }));
  }, [me]);
  const set = (k: string, v: any) => setF((x: any) => ({ ...x, [k]: v }));
  const setV = (k: string, v: any) => setF((x: any) => ({ ...x, vessel: { ...x.vessel, [k]: v } }));
  async function send(e: React.FormEvent) {
    e.preventDefault(); setSt({ busy: true });
    try { const r = await post("/api/explore/request", { ...f, state: l.state, listing_key: l.listing_key, slip: l.slip }); setSt({ done: true, forwarded: r.forwarded }); }
    catch (er: any) { setSt({ err: er.message }); }
  }
  if (st.done) return <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-6"><p className="text-xl font-black text-emerald-800">✓ Request sent</p>
    <p className="mt-2 text-emerald-900">{st.forwarded ? `${l.listing_name} got your request and will reply to you directly.` : `We're contacting ${l.listing_name} for you. Check your email for a copy.`}</p>
    {!me?.boater && <p className="mt-3 text-sm text-emerald-900"><a className="font-bold underline" href="/explore/account">Create a free account</a> to keep your requests, boats and favorite places in one place.</p>}</div>;
  return (
    <form onSubmit={send} className="space-y-3">
      <input type="text" name="website_hp" className="hidden" tabIndex={-1} autoComplete="off" onChange={(e) => set("website_hp", e.target.value)} />
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm font-bold">Arrive<input type="date" className={inp} value={f.arrive || ""} onChange={(e) => set("arrive", e.target.value)} /></label>
        <label className="text-sm font-bold">Leave<input type="date" className={inp} value={f.depart || ""} onChange={(e) => set("depart", e.target.value)} /></label>
      </div>
      <label className="block text-sm font-bold">Stay
        <select className={inp} value={f.stay_type} onChange={(e) => set("stay_type", e.target.value)}>
          <option value="night">Nightly</option><option value="week">Weekly</option><option value="month">Monthly</option><option value="season">Seasonal</option><option value="year">Annual</option>
        </select></label>
      <div className="rounded-xl bg-slate-50 p-3">
        <p className="mb-2 text-sm font-black">{l.kind === "m" ? "Your boat" : "Your RV / camper"}</p>
        <div className="grid grid-cols-2 gap-2">
          <select className={inp} value={f.vessel.kind} onChange={(e) => setV("kind", e.target.value)}>
            {l.kind === "m" ? <><option value="boat">Boat</option><option value="other">Other</option></> : <><option value="rv">RV / motorhome</option><option value="trailer">Travel trailer</option><option value="tent">Tent</option><option value="other">Other</option></>}
          </select>
          <input className={inp} inputMode="decimal" placeholder="Length (ft)" value={f.vessel.length_ft || ""} onChange={(e) => setV("length_ft", e.target.value)} />
          {l.kind === "m" ? <><input className={inp} inputMode="decimal" placeholder="Beam (ft)" value={f.vessel.beam_ft || ""} onChange={(e) => setV("beam_ft", e.target.value)} />
            <input className={inp} inputMode="decimal" placeholder="Draft (ft)" value={f.vessel.draft_ft || ""} onChange={(e) => setV("draft_ft", e.target.value)} /></>
            : <select className={inp} value={f.vessel.power_amp || ""} onChange={(e) => setV("power_amp", e.target.value)}><option value="">Power</option><option>30 amp</option><option>50 amp</option><option>No power</option></select>}
        </div>
        {l.kind === "m" && <select className={`${inp} mt-2`} value={f.vessel.power_amp || ""} onChange={(e) => setV("power_amp", e.target.value)}><option value="">Shore power</option><option>30 amp</option><option>50 amp</option><option>100 amp</option><option>None</option></select>}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <input required className={inp} placeholder="Your name" value={f.name || ""} onChange={(e) => set("name", e.target.value)} />
        <input required type="email" className={inp} placeholder="Email" value={f.email || ""} onChange={(e) => set("email", e.target.value)} />
        <input className={inp} type="tel" placeholder="Phone (optional)" value={f.phone || ""} onChange={(e) => set("phone", e.target.value)} />
      </div>
      <textarea className={inp} rows={3} placeholder="Anything they should know? (optional)" value={f.message || ""} onChange={(e) => set("message", e.target.value)} />
      {st.err && <p className="text-sm font-bold text-red-600">{st.err}</p>}
      <button disabled={st.busy} className="w-full rounded-xl bg-[#08B8D8] px-6 py-3.5 text-lg font-black text-white transition hover:bg-[#079db9] disabled:opacity-60">{st.busy ? "Sending…" : l.slip ? `Request ${unit} ${l.slip}` : `Request a ${unit}`}</button>
      <p className="text-xs text-slate-500">Free. Your request goes to the property; they confirm availability and price with you.</p>
    </form>
  );
}

export function Reviews(l: L) {
  const { me, reload } = useBoater();
  const [d, setD] = useState<{ reviews: any[]; avg: number | null; count: number } | null>(null);
  const [f, setF] = useState<any>({ rating: 0 });
  const [st, setSt] = useState<{ busy?: boolean; err?: string; done?: boolean }>({});
  useEffect(() => { fetch(`/api/explore/listing?key=${encodeURIComponent(l.listing_key)}`).then((r) => r.json()).then(setD).catch(() => setD({ reviews: [], avg: null, count: 0 })); }, [l.listing_key]);
  const mine = me?.reviews?.find((r: any) => r.listing_key === l.listing_key);
  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!f.rating) { setSt({ err: "Pick 1 to 5 stars." }); return; }
    setSt({ busy: true });
    try { await post("/api/explore/review", { ...f, state: l.state, listing_key: l.listing_key }); setSt({ done: true }); reload(); } catch (er: any) { setSt({ err: er.message }); }
  }
  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-3">
        <h2 className="text-2xl font-black">Reviews</h2>
        {d?.avg != null && <span className="flex items-center gap-2"><Stars n={d.avg} size="text-xl" /><b>{d.avg.toFixed(1)}</b><span className="text-slate-500">({d.count})</span></span>}
      </div>
      {!d ? <p className="mt-3 text-slate-500">Loading…</p> : !d.reviews.length ? <p className="mt-3 text-slate-500">No reviews yet. Stayed here? Be the first.</p>
        : <ul className="mt-4 space-y-4">{d.reviews.map((r) => <li key={r.id} className="rounded-2xl border border-slate-200 p-4">
          <div className="flex flex-wrap items-center gap-2"><Stars n={r.rating} /><b>{r.title || ""}</b></div>
          <p className="mt-1 whitespace-pre-line text-slate-700">{r.body}</p>
          <p className="mt-2 text-xs text-slate-500">{r.by}{r.stayed_on ? ` · stayed ${new Date(r.stayed_on + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" })}` : ""}</p>
          {r.owner_reply && <div className="mt-3 rounded-xl bg-sky-50 p-3 text-sm"><b>Response from the owner:</b> {r.owner_reply}</div>}
        </li>)}</ul>}
      <div className="mt-6 rounded-2xl bg-slate-50 p-4">
        {!me?.boater ? <p className="text-slate-700"><a className="font-black text-[#0284c7] underline" href={`/explore/account?next=${typeof window !== "undefined" ? encodeURIComponent(location.pathname) : ""}`}>Sign in</a> to write a review.</p>
          : st.done || mine ? <p className="font-bold text-emerald-700">✓ Thanks! {mine?.status === "approved" ? "Your review is live." : "Your review shows after a quick check."}</p>
          : !me.boater.email_verified ? <p className="text-slate-700">Confirm your email to write a review — check your inbox, or <a className="font-bold underline" href="/explore/account">resend the link</a>.</p>
          : <form onSubmit={send} className="space-y-3">
            <p className="font-black">Write a review</p>
            <div className="flex gap-1">{[1, 2, 3, 4, 5].map((n) => <button type="button" key={n} onClick={() => setF((x: any) => ({ ...x, rating: n }))} className={`text-3xl ${n <= f.rating ? "text-amber-500" : "text-slate-300"}`} aria-label={`${n} stars`}>★</button>)}</div>
            <input className={inp} placeholder="Title (optional)" maxLength={100} value={f.title || ""} onChange={(e) => setF((x: any) => ({ ...x, title: e.target.value }))} />
            <textarea required minLength={20} className={inp} rows={4} placeholder="How was your stay? (at least 20 characters)" value={f.body || ""} onChange={(e) => setF((x: any) => ({ ...x, body: e.target.value }))} />
            <label className="block text-sm font-bold">When did you stay? (optional)<input type="month" className={inp} onChange={(e) => setF((x: any) => ({ ...x, stayed_on: e.target.value ? `${e.target.value}-01` : "" }))} /></label>
            {st.err && <p className="text-sm font-bold text-red-600">{st.err}</p>}
            <button disabled={st.busy} className="rounded-xl bg-[#071A33] px-6 py-3 font-black text-white disabled:opacity-60">{st.busy ? "Sending…" : "Post review"}</button>
          </form>}
      </div>
    </div>
  );
}
