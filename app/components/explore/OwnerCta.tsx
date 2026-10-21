export default function OwnerCta() {
  return (
    <section className="px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[32px] bg-[#071A33] px-6 py-12 text-white sm:px-10 lg:flex lg:items-center lg:justify-between lg:gap-10">
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-[#39d5ee]">For owners and managers</p>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Is your marina, RV park or campground on the map?</h2>
          <p className="mt-4 text-lg leading-8 text-slate-300">Claim your listing for free. Correct your information, and see how MelyOS can give your property its own interactive map with online booking and payments.</p>
        </div>
        <a href="/demo?claim=" className="mt-8 inline-block whitespace-nowrap rounded-xl bg-[#08B8D8] px-7 py-4 font-black text-white transition hover:bg-[#079db9] lg:mt-0">Claim it free</a>
      </div>
    </section>
  );
}
