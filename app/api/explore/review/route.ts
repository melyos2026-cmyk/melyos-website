import { NextRequest, NextResponse } from "next/server";
import { exploreApi, currentSession, findListing, nice } from "@/app/lib/explore";

// Nov 17 (per Mely): a signed-in, email-confirmed boater reviews a listing (1–5 stars). Reviews show after MelyOS
// approves them (Insights → melyos.io → Explore).
const done = (data: any, status = 200) => NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
export async function POST(req: NextRequest) {
  const s = await currentSession(); if (!s) return done({ error: "Sign in to write a review." }, 401);
  const b = await req.json().catch(() => ({}));
  const st = String(b.state || "").toUpperCase();
  const row = await findListing(st, String(b.listing_key || ""));
  if (!row) return done({ error: "We couldn't find that place." }, 404);
  const r = await exploreApi("review", { ...s, listing_key: row[7], listing_name: nice(row[1]), state: st, rating: b.rating, title: b.title, body: b.body, stayed_on: b.stayed_on });
  return r.ok ? done({ ok: true }) : done({ error: r.data.error }, r.status);
}
