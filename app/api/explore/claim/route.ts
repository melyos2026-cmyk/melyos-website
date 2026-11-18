import { NextRequest, NextResponse } from "next/server";
import { tooMany, geoOf, recordLead } from "@/app/lib/leads";
import { exploreApi, findListing, nice, sendMail, mailWrap, escH } from "@/app/lib/explore";
import { KIND } from "@/app/components/explore/states";

// Nov 17 (per Mely): an owner / manager claims their listing and proposes the correct info. MelyOS approves it
// (Insights → Explore); then their info shows on the map and requests for that listing are emailed to them.
const done = (data: any, status = 200) => NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
export async function POST(req: NextRequest) {
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  if (tooMany(`ex-claim:${ip}`, 5)) return done({ error: "Too many requests. Please try again later." }, 429);
  const b = await req.json().catch(() => ({}));
  if (b.website_hp) return done({ ok: true });
  const st = String(b.state || "").toUpperCase();
  const row = await findListing(st, String(b.listing_key || ""));
  if (!row) return done({ error: "We couldn't find that place." }, 404);
  const name = nice(row[1]);
  const r = await exploreApi("claim", { listing_key: row[7], listing_name: name, listing_kind: row[0], state: st, name: b.name, role: b.role, email: b.email, phone: b.phone, edits: b.edits, files: b.files, map_consent: !!b.map_consent, ...geoOf(req.headers) });
  if (!r.ok) return done({ error: r.data.error }, r.status);
  await recordLead({ source: "explore_claim", name: String(b.name || "").slice(0, 120), business: name, email: String(b.email || ""), phone: String(b.phone || "").slice(0, 40) || undefined, propertyType: KIND[row[0]]?.label, message: `Explore claim (${st})`, ...geoOf(req.headers) });
  await sendMail(String(b.email), `We got your claim — ${name}`, mailWrap("Thanks — we're checking it",
    `<p>We received your claim for <b>${escH(name)}</b>. We'll confirm it with you in 1–2 business days. After that, your information shows on MelyOS Explore and slip / site requests for your property come straight to your email.</p>`));
  return done({ ok: true });
}
