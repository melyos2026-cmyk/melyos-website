import { NextRequest, NextResponse } from "next/server";
import { tooMany } from "@/app/lib/leads";
import { exploreApi, findListing, nice } from "@/app/lib/explore";

// Nov 18 (per Mely): start an upload of the owner's own map / photos for a claim (admin.melyos.io makes a
// one-time upload link to a private bucket; the browser sends the file straight there).
const done = (data: any, status = 200) => NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
export async function POST(req: NextRequest) {
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  if (tooMany(`ex-claim-up:${ip}`, 30)) return done({ error: "Too many uploads. Try again later." }, 429);
  const b = await req.json().catch(() => ({}));
  const st = String(b.state || "").toUpperCase();
  const row = await findListing(st, String(b.listing_key || ""));
  if (!row) return done({ error: "We couldn't find that place." }, 404);
  const r = await exploreApi("claim_upload_url", { listing_key: row[7], listing_name: nice(row[1]), listing_kind: row[0], state: st, kind: b.kind, contentType: b.contentType, size: b.size });
  return r.ok ? done(r.data) : done({ error: r.data.error }, r.status);
}
