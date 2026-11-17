import { NextRequest, NextResponse } from "next/server";
import { exploreApi, currentSession } from "@/app/lib/explore";

// Nov 17 (per Mely): the signed-in boater — GET profile + boats + favorites + requests + reviews;
// POST { action: profile | vessel_save | vessel_delete | favorite, … }
const done = (data: any, status = 200) => NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
export async function GET() {
  const s = await currentSession(); if (!s) return done({ boater: null });
  const r = await exploreApi("me", s);
  return r.ok ? done(r.data) : done({ boater: null, error: r.status === 401 ? undefined : r.data.error });
}
export async function POST(req: NextRequest) {
  const s = await currentSession(); if (!s) return done({ error: "Sign in first." }, 401);
  const b = await req.json().catch(() => ({}));
  if (!["profile", "vessel_save", "vessel_delete", "favorite"].includes(b.action)) return done({ error: "Unknown action." }, 400);
  const { action, ...rest } = b;
  const r = await exploreApi(action, { ...rest, ...s });
  return r.ok ? done(r.data) : done({ error: r.data.error }, r.status);
}
