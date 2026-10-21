import type { MetadataRoute } from "next";

// Oct 21 (per Mely): pages Google should know about.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: "https://melyos.io/", lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: "https://melyos.io/privacy", lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: "https://melyos.io/terms", lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
