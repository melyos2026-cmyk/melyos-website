import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { currentSession } from "@/app/lib/explore";

// Nov 20 (per Mely): free arrival docks, boat ramps, piers and anchorages — only for boaters
// signed in with a free MelyOS Explore account (they are not on the public map).
// GET ?state=FL → { rows } (401 when not signed in). Data: data/docks/<ST>.json (scripts/explore_docks.py).
const done = (data: unknown, status = 200) => NextResponse.json(data, { status, headers: { "Cache-Control": "private, no-store" } });
export async function GET(req: NextRequest) {
  if (!(await currentSession())) return done({ error: "Create a free account to see docks and boat ramps." }, 401);
  const st = (new URL(req.url).searchParams.get("state") || "").toUpperCase();
  if (!/^[A-Z]{2}$/.test(st)) return done({ rows: [] });
  try {
    const j = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data/docks", `${st}.json`), "utf8"));
    return done({ rows: Array.isArray(j.rows) ? j.rows : [] });
  } catch { return done({ rows: [] }); }
}
