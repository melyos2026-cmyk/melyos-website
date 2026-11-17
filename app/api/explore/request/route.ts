import { NextRequest, NextResponse } from "next/server";
import { tooMany, geoOf } from "@/app/lib/leads";
import { exploreApi, currentSession, findListing, sendMail, mailWrap, escH, nice, listingPath } from "@/app/lib/explore";
import { KIND, STATES } from "@/app/components/explore/states";

// Nov 17 (per Mely): "Request a slip / site" on ANY Explore listing. Saved in admin.melyos.io; the boater gets a
// confirmation; if the owner claimed the listing, the request is emailed to them (reply goes straight to the boater);
// MelyOS gets a bell + phone alert (a non-client getting requests = a sales call).
const done = (data: any, status = 200) => NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
const STAY: Record<string, string> = { night: "Nightly", week: "Weekly", month: "Monthly", season: "Seasonal", year: "Annual" };

export async function POST(req: NextRequest) {
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  if (tooMany(`ex-req:${ip}`, 8)) return done({ error: "Too many requests. Please try again later." }, 429);
  const b = await req.json().catch(() => ({}));
  if (b.website_hp) return done({ ok: true });
  const st = String(b.state || "").toUpperCase();
  const row = await findListing(st, String(b.listing_key || ""));
  if (!row) return done({ error: "We couldn't find that place." }, 404);
  const s = await currentSession();
  const name = nice(row[1]), kind = KIND[row[0]];
  const r = await exploreApi("request", { ...(s || {}), listing_key: row[7], listing_name: name, listing_kind: row[0], state: st,
    name: b.name, email: b.email, phone: b.phone, arrive: b.arrive, depart: b.depart, stay_type: b.stay_type, vessel: b.vessel, message: b.message, ...geoOf(req.headers) });
  if (!r.ok) return done({ error: r.data.error }, r.status);
  const unit = row[0] === "m" ? "slip" : "site";
  const v = b.vessel || {};
  const vline = [v.kind, v.length_ft && `${v.length_ft} ft`, v.beam_ft && `beam ${v.beam_ft} ft`, v.draft_ft && `draft ${v.draft_ft} ft`, v.power_amp && `${v.power_amp}`].filter(Boolean).join(" · ");
  const rows = [["Dates", `${b.arrive || "—"} → ${b.depart || "—"}`], ["Stay", STAY[b.stay_type] || "—"], [row[0] === "m" ? "Boat" : "RV / camper", vline || "—"], ["Name", b.name], ["Email", b.email], ["Phone", b.phone || "—"], ["Message", b.message || "—"]];
  const table = `<table cellpadding="6" style="border-collapse:collapse;width:100%;font-size:14px">${rows.map(([k, x]) => `<tr style="border-top:1px solid #e2e8f0"><td style="width:35%"><b>${escH(k)}</b></td><td>${escH(x)}</td></tr>`).join("")}</table>`;
  const link = `https://melyos.io${listingPath(st, row)}`;
  if (r.data.owner_email) {
    await sendMail(r.data.owner_email, `New ${unit} request — ${b.name} (via MelyOS Explore)`, mailWrap(`New ${unit} request for ${escH(name)}`,
      `<p>A ${kind.label === "Marina" ? "boater" : "guest"} asked for a ${unit} through MelyOS Explore. <b>Reply to this email</b> to answer them directly.</p>${table}<p style="font-size:13px;color:#475569;margin-top:16px">Want these requests to book and pay by themselves on your own live map? <a href="https://melyos.io/demo" style="color:#0284c7">See MelyOS</a>.</p>`), String(b.email));
  }
  await sendMail(String(b.email), `Your ${unit} request — ${name}`, mailWrap(`We got your request`,
    `<p>Your request for <b>${escH(name)}</b> (${escH(STATES[st][0])}) was sent${r.data.owner_email ? " to the property" : ""}. ${r.data.owner_email ? "They'll reply to you by email or phone." : "We're contacting the property for you — you can also call them directly."}</p>${table}<p style="margin-top:16px"><a href="${link}" style="color:#0284c7">See the listing</a>${row[5] ? ` · Phone: ${escH(row[5])}` : ""}</p>`));
  return done({ ok: true, forwarded: !!r.data.owner_email });
}
