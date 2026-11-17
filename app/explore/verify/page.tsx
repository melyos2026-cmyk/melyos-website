"use client";
import { useEffect, useState } from "react";
// Nov 17: confirm a boater's email (link from the welcome email).
export default function Verify() {
  const [m, setM] = useState("Confirming…");
  useEffect(() => {
    const token = new URLSearchParams(location.search).get("token") || "";
    fetch("/api/explore/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "verify", token }) })
      .then((r) => r.json()).then((j) => setM(j.ok ? "✓ Your email is confirmed. You can now write reviews." : j.error || "This link is invalid.")).catch(() => setM("Try again in a minute."));
  }, []);
  return <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-[#071A33]"><div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-sm"><p className="text-sm font-black uppercase tracking-[0.18em] text-[#0284c7]">MelyOS Explore</p><p className="mt-3 text-xl font-black">{m}</p><a href="/explore/account" className="mt-6 inline-block rounded-xl bg-[#08B8D8] px-5 py-3 font-black text-white">My account</a></div></main>;
}
