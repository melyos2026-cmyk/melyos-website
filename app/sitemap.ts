import type { MetadataRoute } from "next";

// Oct 21 (per Mely): pages Google should know about.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: "https://melyos.io/", lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: "https://melyos.io/rv-park-software", lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: "https://melyos.io/marina-software", lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: "https://melyos.io/campground-software", lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: "https://melyos.io/features", lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: "https://melyos.io/pricing", lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: "https://melyos.io/demo", lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: "https://melyos.io/about", lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: "https://melyos.io/privacy", lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: "https://melyos.io/terms", lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
