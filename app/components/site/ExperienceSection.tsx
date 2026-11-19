import { h2 } from "./data";

// Nov 18 (per Mely — "vender experiencia, seguridad y confort", like Apple sells the experience, not the phone):
// what owners FEEL with MelyOS, without walking the public through every screen of the system.
const PILLARS: { tag: string; title: string; lines: string[] }[] = [
  { tag: "Experience", title: "Your guests feel it from the first click", lines: ["They pick their exact spot on your live map and book at midnight.", "Pay, sign and find everything on their phone.", "Your property looks like the best-run place in town."] },
  { tag: "Security", title: "You know what is happening, always", lines: ["You know who moves in before they move in.", "Every dollar is recorded, receipted and on time.", "Money owed gets followed up, even after they leave."] },
  { tag: "Comfort", title: "The work gets done without you chasing it", lines: ["Reminders, invoices and late fees go out on their own.", "Fewer calls, less paper, no spreadsheets at night.", "We set it up for you. You get your evenings back."] },
];

export default function ExperienceSection() {
  return (
    <section className="px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_440px]">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-[#079db9]">What you get</p>
            <h2 className={h2}>Not more software. A property that runs smoother.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">Tell us what you need and we show you exactly that — built around your property, set up by us.</p>
          </div>
          {/* Nov 18 (per Mely): the MelyOS bee juggling everything a property runs — sells the feeling, not the screens */}
          <video className="mx-auto w-full max-w-[440px] rounded-3xl shadow-xl ring-1 ring-slate-200" src="/video/melyos-bee-2026.mp4" poster="/video/melyos-bee-2026-poster.jpg"
            autoPlay muted loop playsInline preload="metadata" aria-label="The MelyOS bee juggling payments, the live map, reservations, contracts, screening, utilities, accounting and the customer portal" />
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {PILLARS.map((p) => (
            <article key={p.tag} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-[#079db9]">{p.tag}</div>
              <h3 className="mt-2 text-2xl font-black leading-tight text-[#071A33]">{p.title}</h3>
              <ul className="mt-4 space-y-2.5 text-[15px] leading-6 text-slate-600">
                {p.lines.map((l) => <li key={l} className="flex gap-2"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#08B8D8]" />{l}</li>)}
              </ul>
            </article>
          ))}
        </div>
        <a href="#demo" className="mt-8 inline-block rounded-xl bg-[#08B8D8] px-6 py-3.5 font-black text-white transition hover:bg-[#079db9]">Tell us what you need</a>
      </div>
    </section>
  );
}
