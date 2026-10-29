import { NextRequest, NextResponse } from "next/server";
import { sendLead, tooMany, geoOf } from "@/app/lib/leads";

// Oct 29 (per Mely — Referral Program): the referral form on /refer. Sent and saved like the demo
// form (email to MelyOS + MelyOS Insights). No tax ID is collected here: a W-9 is requested
// by email only when a cash reward is earned.
const s = (v: unknown, n: number) => String(v ?? "").trim().slice(0, n);
const okEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

export async function POST(req: NextRequest) {
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  if (tooMany(`refer:${ip}`)) return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  const b = await req.json().catch(() => ({}));
  const yourName = s(b.yourName, 120), yourEmail = s(b.yourEmail, 160), yourPhone = s(b.yourPhone, 40);
  const isClient = b.isClient === true;
  const clientPark = s(b.clientPark, 160);
  const parkName = s(b.parkName, 160), contactName = s(b.contactName, 120);
  const contactEmail = s(b.contactEmail, 160), contactPhone = s(b.contactPhone, 40);
  const location = s(b.location, 120), notes = s(b.notes, 1000);
  if (!yourName || !okEmail(yourEmail) || !yourPhone) {
    return NextResponse.json({ error: "Please enter your name, a valid email and your phone." }, { status: 400 });
  }
  if (!parkName || (!contactPhone && !okEmail(contactEmail))) {
    return NextResponse.json({ error: "Please enter the property's name and a phone or email for its contact." }, { status: 400 });
  }
  if (b.agree !== true) return NextResponse.json({ error: "Please confirm you are 18 or older and agree to the program terms." }, { status: 400 });
  const message = [
    "REFERRAL (Referral Program)",
    `Referred by: ${yourName} · ${yourEmail} · ${yourPhone}`,
    isClient ? `Referrer is a MelyOS client${clientPark ? `: ${clientPark}` : ""} (may choose 20% of setup fee or 1 free month)` : "Referrer is not a MelyOS client (cash reward: 20% of setup fee; W-9 needed before payment)",
    `Referred property: ${parkName}${location ? ` (${location})` : ""}`,
    `Property contact: ${contactName || "—"} · ${contactEmail || "—"} · ${contactPhone || "—"}`,
    notes ? `Notes: ${notes}` : "",
  ].filter(Boolean).join("\n");
  try {
    await sendLead({
      source: "referral",
      ...geoOf(req.headers),
      name: contactName || parkName,
      business: parkName,
      email: okEmail(contactEmail) ? contactEmail : undefined,
      phone: contactPhone,
      message,
    });
  } catch (e: any) {
    console.error("referral:", e?.message);
    return NextResponse.json({ error: "We couldn't send your referral. Please email info@melyos.io or try again." }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
