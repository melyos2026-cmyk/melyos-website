import type { MetadataRoute } from "next";

// Oct 21 (per Mely): let search engines read the site; keep test pages out.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/preview", "/coming-soon"] }],
    sitemap: "https://melyos.io/sitemap.xml",
    host: "https://melyos.io",
  };
}
