import type { MetadataRoute } from "next";
import { STATES } from "./components/explore/states";

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
    { url: "https://melyos.io/about", lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: "https://melyos.io/explore", lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...Object.keys(STATES).map((s) => ({ url: `https://melyos.io/explore/${s.toLowerCase()}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 })),
    { url: "https://melyos.io/privacy", lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: "https://melyos.io/terms", lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
