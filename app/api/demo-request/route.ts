import { NextRequest, NextResponse } from "next/server";
import { sendLead, tooMany } from "@/app/lib/leads";

// Oct 20 (per Mely): the "Request My Demo" form used to go nowhere — it now
// emails the lead to MelyOS.
export async function POST(req: NextRequest) {
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  if (tooMany(`demo:${ip}`)) return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  const b = await req.json().catch(() => ({}));
  const email = String(b.email || "").trim();
  if (!String(b.name || "").trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter your name and a valid email." }, { status: 400 });
  }
  try {
    await sendLead({
      source: "demo_form",
      name: String(b.name).slice(0, 120),
      business: String(b.business || "").slice(0, 160),
      email,
      phone: String(b.phone || "").slice(0, 40),
      propertyType: String(b.propertyType || "").slice(0, 60),
      spaces: String(b.spaces || "").slice(0, 10),
      // Oct 21 (per Mely): MelyOS Explore "Claim it free" requests.
      message: b.claim ? `Claim request from MelyOS Explore: ${String(b.claim).slice(0, 160)}` : undefined,
    });
  } catch (e: any) {
    console.error("demo-request:", e?.message);
    return NextResponse.json({ error: "We couldn't send your request. Please email us or try again." }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
