"use client";

import { useState } from "react";
import type { QType, Section } from "./questions";

export default function QuestionnaireForm({ type, name, sections }: { type: QType; name: string; sections: Section[] }) {
  const [vals, setVals] = useState<Record<string, string | string[]>>({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [sent, setSent] = useState(false);

  const set = (id: string, v: string | string[]) => setVals((p) => ({ ...p, [id]: v }));
  const toggle = (id: string, o: string) => {
    const cur = (vals[id] as string[]) || [];
    set(id, cur.includes(o) ? cur.filter((x) => x !== o) : [...cur, o]);
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    for (const s of sections) for (const f of s.fields) {
      if ("required" in f && f.required && !String(vals[f.id] || "").trim()) { setErr(`Please answer: ${f.label}`); document.getElementById(`q-${f.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" }); return; }
    }
    setBusy(true);
    const answers = sections.map((s) => ({
      title: s.title,
      rows: s.fields.map((f) => [f.label, Array.isArray(vals[f.id]) ? (vals[f.id] as string[]).join(", ") : String(vals[f.id] || "")]),
    }));
    const r = await fetch("/api/questionnaire", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, name: vals.name, business: vals.business, email: vals.email, phone: vals.phone, answers, website_hp: vals.website_hp }),
    }).catch(() => null);
    setBusy(false);
    if (!r || !r.ok) { const j = await r?.json().catch(() => ({})); setErr(j?.error || "We couldn't send it. Please try again."); return; }
    setSent(true); window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const input = "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-[15px] focus:outline-none focus:ring-2 focus:ring-sky-500";

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <img src="/icon.png" alt="" className="h-8 w-8 rounded" />
          <span className="font-bold text-slate-900">MelyOS</span>
        </div>
      </header>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {sent ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <h1 className="text-2xl font-bold text-slate-900">Thank you!</h1>
            <p className="mt-3 text-slate-600">We received your answers. We'll review them and contact you with next steps and your estimate.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-6">
            <div>
              <p className="text-sm font-semibold text-sky-700 uppercase tracking-wide">{name}</p>
              <h1 className="text-3xl font-bold text-slate-900 mt-1">Getting to know your property</h1>
              <p className="mt-2 text-slate-600">These answers help us set up MelyOS for you and prepare your estimate. It takes about 10 minutes. Answer what you can — anything you're not sure about, leave blank and we'll go over it together.</p>
            </div>
            <input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden value={(vals.website_hp as string) || ""} onChange={(e) => set("website_hp", e.target.value)} />
            {sections.map((s) => (
              <section key={s.title} className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5">
                <h2 className="text-lg font-bold text-slate-900">{s.title}</h2>
                {s.fields.map((f) => (
                  <div key={f.id} id={`q-${f.id}`}>
                    <label className="block text-sm font-semibold text-slate-800 mb-1.5">{f.label}{"required" in f && f.required && <span className="text-red-600"> *</span>}</label>
                    {f.hint && <p className="text-xs text-slate-500 mb-1.5">{f.hint}</p>}
                    {f.kind === "textarea" ? (
                      <textarea rows={3} className={input} placeholder={f.placeholder} value={(vals[f.id] as string) || ""} onChange={(e) => set(f.id, e.target.value)} />
                    ) : f.kind === "choice" ? (
                      <div className="flex flex-wrap gap-2">{f.options.map((o) => (
                        <button type="button" key={o} onClick={() => set(f.id, vals[f.id] === o ? "" : o)}
                          className={`px-3 py-2 rounded-lg border text-sm ${vals[f.id] === o ? "bg-sky-600 border-sky-600 text-white" : "bg-white border-slate-300 text-slate-700 hover:border-sky-400"}`}>{o}</button>
                      ))}</div>
                    ) : f.kind === "multi" ? (
                      <div className="flex flex-wrap gap-2">{f.options.map((o) => {
                        const on = ((vals[f.id] as string[]) || []).includes(o);
                        return <button type="button" key={o} onClick={() => toggle(f.id, o)}
                          className={`px-3 py-2 rounded-lg border text-sm ${on ? "bg-sky-600 border-sky-600 text-white" : "bg-white border-slate-300 text-slate-700 hover:border-sky-400"}`}>{on ? "✓ " : ""}{o}</button>;
                      })}</div>
                    ) : (
                      <input type={f.kind} inputMode={f.kind === "number" ? "numeric" : undefined} min={f.kind === "number" ? 0 : undefined} className={input} placeholder={f.placeholder} value={(vals[f.id] as string) || ""} onChange={(e) => set(f.id, e.target.value)} />
                    )}
                  </div>
                ))}
              </section>
            ))}
            {err && <p className="text-sm font-semibold text-red-700">{err}</p>}
            <button type="submit" disabled={busy} className="w-full sm:w-auto px-8 py-3 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 disabled:opacity-60">{busy ? "Sending…" : "Send my answers"}</button>
            <p className="text-xs text-slate-500">Your answers go only to the MelyOS team.</p>
          </form>
        )}
      </div>
    </main>
  );
}
