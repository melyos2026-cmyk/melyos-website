import { NextRequest, NextResponse } from "next/server";
import { tooMany } from "@/app/lib/leads";
import { exploreApi, findListing, nice } from "@/app/lib/explore";

// Nov 17 (per Mely): save a slip / site map from the editor (melyos.io/explore/{st}/{place}/slips?edit=TOKEN).
// admin.melyos.io checks the edit token (made in Insights → Explore → Slip maps).
const done = (data: any, status = 200) => NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(req: NextRequest) {
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  if (tooMany(`ex-slip:${ip}`, 60)) return done({ error: "Too many saves. Wait a minute." }, 429);
  const b = await req.json().catch(() => ({}));
  const st = String(b.state || "").toUpperCase();
  const row = await findListing(st, String(b.listing_key || ""));
  if (!row) return done({ error: "We couldn't find that place." }, 404);
  const r = await exploreApi("slipmap_save", { listing_key: row[7], listing_name: nice(row[1]), listing_kind: row[0], state: st, edit: b.edit, map: b.map });
  return r.ok ? done(r.data) : done({ error: r.data.error }, r.status);
}
