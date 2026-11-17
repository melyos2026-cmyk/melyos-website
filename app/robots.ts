import type { MetadataRoute } from "next";

// Oct 21 (per Mely): let search engines read the site; keep test pages out.
// Nov 17 (per Mely): link-preview bots (Facebook, WhatsApp, LinkedIn…) may read /questionnaire so a shared
// link shows its preview; search engines still stay out of it.
const PREVIEW_BOTS = ["facebookexternalhit", "Facebot", "meta-externalagent", "WhatsApp", "Twitterbot", "LinkedInBot", "Slackbot", "TelegramBot", "Discordbot", "Pinterestbot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...PREVIEW_BOTS.map((userAgent) => ({ userAgent, allow: "/", disallow: ["/api/", "/preview", "/coming-soon"] })),
      { userAgent: "*", allow: "/", disallow: ["/api/", "/preview", "/coming-soon", "/questionnaire"] },
    ],
    sitemap: "https://melyos.io/sitemap.xml",
    host: "https://melyos.io",
  };
}
