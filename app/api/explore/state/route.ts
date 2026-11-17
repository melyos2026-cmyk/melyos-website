import { NextRequest, NextResponse } from "next/server";
import { exploreApi } from "@/app/lib/explore";
// Nov 17: public — owner info + star averages for one state's map.
export async function GET(req: NextRequest) {
  const st = (new URL(req.url).searchParams.get("state") || "").toUpperCase();
  const r = await exploreApi("state", { state: st });
  return NextResponse.json(r.ok ? r.data : { overrides: {}, stars: {} }, { headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600" } });
}
