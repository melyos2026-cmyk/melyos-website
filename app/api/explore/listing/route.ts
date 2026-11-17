import { NextRequest, NextResponse } from "next/server";
import { exploreApi } from "@/app/lib/explore";
// Nov 17: public — one listing's approved reviews + owner info.
export async function GET(req: NextRequest) {
  const key = new URL(req.url).searchParams.get("key") || "";
  const r = await exploreApi("listing", { listing_key: key });
  return NextResponse.json(r.ok ? r.data : { reviews: [], avg: null, count: 0 }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
}
