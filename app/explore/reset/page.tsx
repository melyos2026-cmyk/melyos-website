"use client";
import { useState } from "react";
// Nov 17: choose a new Explore password (link from the reset email, valid 1 hour).
export default function Reset() {
  const [pw, setPw] = useState(""), [st, setSt] = useState<{ busy?: boolean; err?: string }>({});
  async function go(e: React.FormEvent) {
    e.preventDefault(); setSt({ busy: true });
    const token = new URLSearchParams(location.search).get("token") || "";
    const r = await fetch("/api/explore/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "reset", token, password: pw }) }).then((x) => x.json()).catch(() => ({ error: "Try again." }));
    if (r.ok) location.href = "/explore/account"; else setSt({ err: r.error });
  }
  return <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-[#071A33]"><form onSubmit={go} className="w-full max-w-md space-y-3 rounded-3xl bg-white p-8 shadow-sm"><p className="text-sm font-black uppercase tracking-[0.18em] text-[#0284c7]">MelyOS Explore</p><h1 className="text-2xl font-black">Choose a new password</h1>
    <input required type="password" minLength={8} autoComplete="new-password" className="w-full rounded-xl border border-slate-300 px-3 py-2.5" placeholder="New password (8+ characters)" value={pw} onChange={(e) => setPw(e.target.value)} />
    {st.err && <p className="text-sm font-bold text-red-600">{st.err}</p>}
    <button disabled={st.busy} className="w-full rounded-xl bg-[#08B8D8] py-3 font-black text-white disabled:opacity-60">Save and sign in</button></form></main>;
}
