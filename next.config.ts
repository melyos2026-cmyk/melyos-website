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
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
