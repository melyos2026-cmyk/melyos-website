import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import { STATES, type Row } from "./components/explore/states";
import { FEATURED } from "./components/explore/featured";
import { listingPath } from "./components/explore/slug";

// Nov 17 (per Mely): every Explore listing page too (~24,000 — under the 50,000 limit of one sitemap).
function listings(): string[] {
  const out: string[] = [];
  for (const st of Object.keys(STATES)) {
    let rows: Row[] = [];
    try { rows = JSON.parse(fs.readFileSync(path.join(process.cwd(), `public/explore/${st}.json`), "utf8")).rows || []; } catch {}
    const feat = FEATURED[st] || [], names = new Set(feat.map((r) => r[1].toLowerCase()));
    for (const r of [...feat, ...rows.filter((r) => !names.has(String(r[1]).toLowerCase()))]) out.push(`https://melyos.io${listingPath(st, r)}`);
  }
  return [...new Set(out)];
}

// Oct 21 (per Mely): pages Google should know about.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: "https://melyos.io/", lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: "https://melyos.io/rv-park-software", lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: "https://melyos.io/marina-software", lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: "https://melyos.io/campground-software", lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: "https://melyos.io/interactive-property-map", lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: "https://melyos.io/customer-portal-software", lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: "https://melyos.io/tenant-screening-software", lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: "https://melyos.io/ai-assistant-for-rv-parks-and-marinas", lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: "https://melyos.io/point-of-sale-software", lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: "https://melyos.io/billing-payments-software", lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: "https://melyos.io/online-reservation-software", lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: "https://melyos.io/contract-e-signature-software", lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: "https://melyos.io/marina-fuel-dock-software", lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: "https://melyos.io/dry-stack-software", lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: "https://melyos.io/features", lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: "https://melyos.io/pricing", lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: "https://melyos.io/demo", lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: "https://melyos.io/refer", lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: "https://melyos.io/careers", lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: "https://melyos.io/about", lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: "https://melyos.io/explore", lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...["marinas", "rv-parks", "campgrounds"].map((k) => ({ url: `https://melyos.io/explore/${k}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.9 })),
    ...Object.keys(STATES).map((s) => ({ url: `https://melyos.io/explore/${s.toLowerCase()}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...listings().map((url) => ({ url, lastModified: now, changeFrequency: "monthly" as const, priority: 0.4 })),
    { url: "https://melyos.io/privacy", lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: "https://melyos.io/terms", lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
