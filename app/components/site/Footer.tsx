import { NAV } from "./data";
import { Mail } from "lucide-react";

export default function SiteFooter() {
  return (
    <>
      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-4 lg:px-8">
          <div className="md:col-span-2">
            <img src="/melyos-logo-trimmed.png" alt="MelyOS" className="h-14 w-auto" />
            <p className="mt-4 max-w-md leading-7 text-slate-600">Property management software for RV parks, marinas, campgrounds, communities and storage properties. MelyOS LLC, Kissimmee, Florida.</p>
            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-bold text-slate-700">
              <span>Online payment processing · Background checks · Works with</span>
              <img src="/quickbooks-logo.png" alt="Intuit QuickBooks" className="h-6 w-auto object-contain" />
            </div>
            <p className="mt-3 flex items-center gap-2 text-slate-600"><Mail className="h-4 w-4 text-[#079db9]" aria-hidden /><a className="underline" href="mailto:info@melyos.io">info@melyos.io</a></p>
          </div>
          <div>
            <p className="font-black">Platform</p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
              {NAV.map(([h, l]) => <a key={h} href={h}>{l === "Platform" ? "Features" : l}</a>)}
            </div>
          </div>
          <div>
            <p className="font-black">Company</p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
              <a href="/demo">Book a Demo</a><a href="https://admin.melyos.io">Login</a><a href="/privacy">Privacy Policy</a><a href="/terms">Terms of Service</a>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-200">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
            <p>© {new Date().getFullYear()} MelyOS LLC. All rights reserved.</p>
            <p>Property Management, Reimagined.</p>
          </div>
          <p className="pb-6 text-center text-sm text-slate-500">Powered by <a href="https://melyos.io" className="font-bold text-[#0aa6c2] hover:underline">MelyOS.io</a></p>
        </div>
      </footer>
    </>
  );
}
