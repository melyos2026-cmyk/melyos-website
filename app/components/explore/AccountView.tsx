"use client";
import { useEffect, useState } from "react";
import { useBoater, post } from "./useBoater";

// Nov 17 (per Mely): MelyOS Explore account — sign in / create account / forgot password; then profile, my boats & RVs,
// saved places, my requests and my reviews.
const inp = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-[15px] outline-none focus:border-[#08B8D8]";
const card = "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm";
const KINDL: Record<string, string> = { m: "Marina", r: "RV park", c: "Campground" };
const STATUS: Record<string, string> = { new: "Sent", forwarded: "Sent to the property", owner_replied: "They replied", booked: "Booked ✓", closed: "Closed" };
const slug = (s: string) => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 70) || "place";
const href = (x: any) => `/explore/${String(x.state).toLowerCase()}/${slug(x.listing_name)}--${x.listing_key}`;
const fmt = (d: string) => new Date(d.length === 10 ? d + "T12:00:00Z" : d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: d.length === 10 ? "UTC" : "America/New_York" });

export default function AccountView() {
  const { me, reload } = useBoater();
  if (!me) return <p className="text-slate-500">Loading…</p>;
  return me.boater ? <Dashboard me={me} reload={reload} /> : <SignIn onDone={reload} />;
}

function SignIn({ onDone }: { onDone: () => void }) {
  const [mode, setMode] = useState<"in" | "up" | "forgot">("in");
  const [f, setF] = useState<any>({});
  const [st, setSt] = useState<{ busy?: boolean; err?: string; msg?: string }>({});
  const next = typeof window !== "undefined" ? new URLSearchParams(location.search).get("next") : null;
  async function go(e: React.FormEvent) {
    e.preventDefault(); setSt({ busy: true });
    try {
      if (mode === "forgot") { await post("/api/explore/auth", { action: "forgot", email: f.email }); setSt({ msg: "If there's an account with that email, we sent a link to reset the password." }); return; }
      await post("/api/explore/auth", { action: mode === "up" ? "signup" : "login", ...f });
      if (next && next.startsWith("/explore")) { location.href = next; return; }
      onDone();
    } catch (er: any) { setSt({ err: er.message }); }
  }
  return (
    <div className="mx-auto max-w-md">
      <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0284c7]">MelyOS Explore</p>
      <h1 className="mt-1 text-3xl font-black">{mode === "up" ? "Create your free account" : mode === "forgot" ? "Reset your password" : "Sign in"}</h1>
      <p className="mt-2 text-slate-600">Save marinas, RV parks and campgrounds, keep your boats & RVs, and send requests in one tap.</p>
      <form onSubmit={go} className={`${card} mt-6 space-y-3`}>
        <input type="text" className="hidden" tabIndex={-1} autoComplete="off" onChange={(e) => setF((x: any) => ({ ...x, website_hp: e.target.value }))} />
        {mode === "up" && <input required className={inp} placeholder="Your name" autoComplete="name" value={f.name || ""} onChange={(e) => setF((x: any) => ({ ...x, name: e.target.value }))} />}
        <input required type="email" className={inp} placeholder="Email" autoComplete="email" value={f.email || ""} onChange={(e) => setF((x: any) => ({ ...x, email: e.target.value }))} />
        {mode === "up" && <input type="tel" className={inp} placeholder="Phone (optional)" autoComplete="tel" value={f.phone || ""} onChange={(e) => setF((x: any) => ({ ...x, phone: e.target.value }))} />}
        {mode !== "forgot" && <input required type="password" minLength={mode === "up" ? 8 : 1} className={inp} placeholder={mode === "up" ? "Password (8+ characters)" : "Password"} autoComplete={mode === "up" ? "new-password" : "current-password"} value={f.password || ""} onChange={(e) => setF((x: any) => ({ ...x, password: e.target.value }))} />}
        {st.err && <p className="text-sm font-bold text-red-600">{st.err}</p>}
        {st.msg && <p className="text-sm font-bold text-emerald-700">{st.msg}</p>}
        <button disabled={st.busy} className="w-full rounded-xl bg-[#08B8D8] py-3 text-lg font-black text-white disabled:opacity-60">{st.busy ? "…" : mode === "up" ? "Create account" : mode === "forgot" ? "Send the link" : "Sign in"}</button>
        {mode === "up" && <p className="text-xs text-slate-500">By creating an account you agree to the <a className="underline" href="/terms">Terms</a> and <a className="underline" href="/privacy">Privacy Policy</a>.</p>}
      </form>
      <div className="mt-4 space-y-1 text-center text-sm">
        {mode !== "up" && <p>New here? <button className="font-black text-[#0284c7]" onClick={() => { setMode("up"); setSt({}); }}>Create a free account</button></p>}
        {mode !== "in" && <p>Have an account? <button className="font-black text-[#0284c7]" onClick={() => { setMode("in"); setSt({}); }}>Sign in</button></p>}
        {mode === "in" && <p><button className="text-slate-600 underline" onClick={() => { setMode("forgot"); setSt({}); }}>Forgot your password?</button></p>}
      </div>
    </div>
  );
}

function Dashboard({ me, reload }: { me: any; reload: () => void }) {
  const b = me.boater;
  const [p, setP] = useState({ name: b.name, phone: b.phone || "" });
  const [v, setV] = useState<any | null>(null);
  const [msg, setMsg] = useState("");
  useEffect(() => { setP({ name: b.name, phone: b.phone || "" }); }, [b.name, b.phone]);
  const act = async (body: any, ok = "") => { try { await post("/api/explore/me", body); setMsg(ok); setV(null); reload(); } catch (e: any) { setMsg(e.message); } };
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><p className="text-sm font-black uppercase tracking-[0.18em] text-[#0284c7]">MelyOS Explore</p><h1 className="text-3xl font-black">Hi, {b.name.split(" ")[0]} ⛵</h1></div>
        <div className="flex gap-2"><a href="/explore" className="rounded-xl bg-[#071A33] px-4 py-2.5 font-black text-white">Explore the map</a>
          <button className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 font-black" onClick={async () => { await post("/api/explore/auth", { action: "logout" }); location.href = "/explore"; }}>Sign out</button></div>
      </div>
      {!b.email_verified && <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 text-amber-900">Confirm your email ({b.email}) to write reviews. <button className="font-black underline" onClick={async () => { try { await post("/api/explore/auth", { action: "resend" }); setMsg("We sent you a new link."); } catch (e: any) { setMsg(e.message); } }}>Resend the link</button></div>}
      {msg && <p className="font-bold text-emerald-700">{msg}</p>}

      <div className={card}>
        <h2 className="text-xl font-black">My boats & RVs</h2>
        <p className="text-sm text-slate-500">Saved here, filled in for you on every request.</p>
        <ul className="mt-3 space-y-2">{(me.vessels || []).map((x: any) => <li key={x.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 px-4 py-3">
          <span><b>{x.name || (x.kind === "boat" ? "My boat" : "My RV")}</b> <span className="text-slate-600">· {x.kind}{x.make_model ? ` · ${x.make_model}` : ""}{x.length_ft ? ` · ${x.length_ft} ft` : ""}{x.beam_ft ? ` · beam ${x.beam_ft}` : ""}{x.draft_ft ? ` · draft ${x.draft_ft}` : ""}{x.power_amp ? ` · ${x.power_amp}` : ""}</span></span>
          <span className="flex gap-2"><button className="text-sm font-bold text-[#0284c7]" onClick={() => setV({ ...x })}>Edit</button><button className="text-sm font-bold text-red-600" onClick={() => confirm("Delete it?") && act({ action: "vessel_delete", id: x.id })}>Delete</button></span></li>)}</ul>
        {v ? <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <select className={inp} value={v.kind || "boat"} onChange={(e) => setV({ ...v, kind: e.target.value })}><option value="boat">Boat</option><option value="rv">RV / motorhome</option><option value="trailer">Travel trailer</option><option value="tent">Tent</option><option value="other">Other</option></select>
          <input className={inp} placeholder="Name (e.g. Sea Breeze)" value={v.name || ""} onChange={(e) => setV({ ...v, name: e.target.value })} />
          <input className={inp} placeholder="Make / model" value={v.make_model || ""} onChange={(e) => setV({ ...v, make_model: e.target.value })} />
          <input className={inp} inputMode="decimal" placeholder="Length (ft)" value={v.length_ft || ""} onChange={(e) => setV({ ...v, length_ft: e.target.value })} />
          <input className={inp} inputMode="decimal" placeholder="Beam (ft)" value={v.beam_ft || ""} onChange={(e) => setV({ ...v, beam_ft: e.target.value })} />
          <input className={inp} inputMode="decimal" placeholder="Draft (ft)" value={v.draft_ft || ""} onChange={(e) => setV({ ...v, draft_ft: e.target.value })} />
          <select className={inp} value={v.power_amp || ""} onChange={(e) => setV({ ...v, power_amp: e.target.value })}><option value="">Power</option><option>30 amp</option><option>50 amp</option><option>100 amp</option><option>No power</option></select>
          <div className="flex gap-2 sm:col-span-2"><button className="rounded-xl bg-[#08B8D8] px-5 py-2.5 font-black text-white" onClick={() => act({ action: "vessel_save", vessel: v }, "Saved.")}>Save</button><button className="rounded-xl border px-5 py-2.5 font-bold" onClick={() => setV(null)}>Cancel</button></div>
        </div> : <button className="mt-3 rounded-xl border-2 border-dashed border-slate-300 px-4 py-2.5 font-black text-slate-700" onClick={() => setV({ kind: "boat" })}>+ Add a boat or RV</button>}
      </div>

      <div className={card}>
        <h2 className="text-xl font-black">Saved places</h2>
        {!(me.favorites || []).length ? <p className="mt-2 text-slate-500">Tap ♡ Save on any marina, RV park or campground.</p>
          : <ul className="mt-3 grid gap-2 sm:grid-cols-2">{me.favorites.map((x: any) => <li key={x.listing_key}><a href={href(x)} className="block rounded-xl bg-slate-50 px-4 py-3 hover:bg-sky-50"><b>{x.listing_name}</b><span className="block text-sm text-slate-500">{KINDL[x.listing_kind] || "Place"} · {x.state}</span></a></li>)}</ul>}
      </div>

      <div className={card}>
        <h2 className="text-xl font-black">My requests</h2>
        {!(me.requests || []).length ? <p className="mt-2 text-slate-500">No requests yet. Find a place on the map and tap "Request a slip / site".</p>
          : <ul className="mt-3 space-y-2">{me.requests.map((x: any) => <li key={x.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 px-4 py-3"><a href={href(x)} className="font-bold hover:underline">{x.listing_name}</a>
            <span className="text-sm text-slate-600">{x.arrive ? `${fmt(x.arrive)} → ${x.depart ? fmt(x.depart) : "?"}` : fmt(x.created_at)} · <b>{STATUS[x.status] || x.status}</b></span></li>)}</ul>}
      </div>

      <div className={card}>
        <h2 className="text-xl font-black">My reviews</h2>
        {!(me.reviews || []).length ? <p className="mt-2 text-slate-500">Stayed somewhere? Leave a review on its page.</p>
          : <ul className="mt-3 space-y-2">{me.reviews.map((x: any) => <li key={x.id} className="rounded-xl bg-slate-50 px-4 py-3"><a href={href(x)} className="font-bold hover:underline">{x.listing_name}</a> <span className="text-amber-500">{"★".repeat(x.rating)}</span> <span className="text-sm text-slate-500">· {x.status === "approved" ? "Live" : x.status === "pending" ? "Being checked" : "Not published"}</span>{x.owner_reply && <p className="mt-1 text-sm"><b>Owner:</b> {x.owner_reply}</p>}</li>)}</ul>}
      </div>

      <div className={card}>
        <h2 className="text-xl font-black">Profile</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <input className={inp} value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} />
          <input className={inp} placeholder="Phone" value={p.phone} onChange={(e) => setP({ ...p, phone: e.target.value })} />
          <button className="rounded-xl bg-[#071A33] px-5 py-2.5 font-black text-white" onClick={() => act({ action: "profile", ...p }, "Saved.")}>Save</button>
        </div>
        <p className="mt-2 text-sm text-slate-500">{b.email}</p>
      </div>
    </div>
  );
}
