import type { NextConfig } from "next";

// Oct 26 (security review): melyos.io can't be framed by other sites; safe defaults for browsers.
const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'; base-uri 'self'; object-src 'none'" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Nov 20: private dock data read by /api/explore/docks (signed-in boaters only)
  outputFileTracingIncludes: { '/api/explore/docks': ['./data/docks/**/*'] },
  async headers() {
    // Nov 21 (per Mely): the live demo maps (/explore/live/...) may be shown inside MelyOS park sites
    // (e.g. the Sunset Ridge demo at demo.melyos.io) — only MelyOS's own domains can frame them.
    const liveHeaders = [
      ...securityHeaders.filter((h) => h.key !== "X-Frame-Options" && h.key !== "Content-Security-Policy"),
      { key: "Content-Security-Policy", value: "frame-ancestors 'self' https://melyos.io https://*.melyos.io; base-uri 'self'; object-src 'none'" },
    ];
    return [
      { source: "/((?!explore/live/).*)", headers: securityHeaders },
      { source: "/explore/live/:path*", headers: liveHeaders },
    ];
  },
};

export default nextConfig;
