"use client";

import { STATES } from "./states";

export default function StatePicker({ current, base = "/explore" }: { current?: string; base?: string }) {
  return (
    <select aria-label="Choose a state" value={current || ""} onChange={(e) => { if (e.target.value) window.location.href = `${base}/${e.target.value.toLowerCase()}`; }}
      className="rounded-xl border border-slate-300 bg-white px-4 py-3 font-bold text-[#071A33] outline-none focus:border-cyan-400">
      <option value="" disabled>Choose a state</option>
      {Object.entries(STATES).sort((a, b) => a[1][0].localeCompare(b[1][0])).map(([k, v]) => <option key={k} value={k}>{v[0]}</option>)}
    </select>
  );
}
