import { NextRequest, NextResponse } from "next/server";
import { exploreApi, currentSession, findListing, nice } from "@/app/lib/explore";

// Nov 18 (per Mely): a signed-in boater reports today's fuel price at a marina (shows on the map with "updated X days ago").
const done = (data: any, status = 200) => NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
export async function POST(req: NextRequest) {
  const s = await currentSession(); if (!s) return done({ error: "Sign in to report a price." }, 401);
  const b = await req.json().catch(() => ({}));
  const st = String(b.state || "").toUpperCase();
  const row = await findListing(st, String(b.listing_key || ""));
  if (!row || row[0] !== "m") return done({ error: "We couldn't find that marina." }, 404);
  const r = await exploreApi("fuel_report", { ...s, listing_key: row[7], listing_name: nice(row[1]), state: st, gas: b.gas, diesel: b.diesel });
  return r.ok ? done({ ok: true }) : done({ error: r.data.error }, r.status);
}
