// Nov 19 (per Mely): a short story video (no screens) replaced the 2-minute walkthrough, which now lives only
// inside the Sales Partner portal for live meetings.
// Nov 17 (per Mely): the 2-minute MelyOS video, served from melyos.io itself (no YouTube branding or
// suggested videos). Shown on the home page under the hero and on /demo above the form.
export default function VideoSection({ compact = false }: { compact?: boolean }) {
  return (
    <section id="video" className={`scroll-mt-24 px-5 lg:px-8 ${compact ? "pt-10" : "py-14 md:py-20"}`}>
      <div className={`mx-auto ${compact ? "max-w-3xl" : "max-w-5xl"}`}>
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#079db9]">Watch</p>
          <h2 className={`mt-2 font-black ${compact ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"}`}>See how your property can run itself</h2>
          {!compact && <p className="mt-4 text-lg leading-8 text-slate-600">From the chaos of the first of the month to evenings off — in 42 seconds.</p>}
        </div>
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-[#071A33] shadow-xl">
          <video className="block aspect-video w-full" controls playsInline preload="metadata" poster="/video/melyos-story-poster.jpg">
            <source src="/video/melyos-story-2026.mp4?v=4" type="video/mp4" />
          </video>
        </div>
        {!compact && (
          <div className="mt-8 text-center">
            <a href="/demo" className="inline-block rounded-xl bg-[#08B8D8] px-7 py-3.5 font-black text-white transition hover:bg-[#079db9]">Book a Free Demo</a>
          </div>
        )}
      </div>
    </section>
  );
}
