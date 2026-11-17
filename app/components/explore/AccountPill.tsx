"use client";
import { useBoater } from "./useBoater";

// Nov 17: "Sign in" / "My trips" on the Explore pages.
export default function AccountPill({ dark = true }: { dark?: boolean }) {
  const { me } = useBoater();
  const cls = dark ? "border-white/30 bg-white/10 text-white hover:bg-white/20" : "border-slate-300 bg-white text-[#071A33] hover:bg-slate-50";
  return <a href="/explore/account" className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-black transition ${cls}`}>
    {me?.boater ? <>⛵ {me.boater.name.split(" ")[0]} · My account</> : "Sign in / Create account"}</a>;
}
