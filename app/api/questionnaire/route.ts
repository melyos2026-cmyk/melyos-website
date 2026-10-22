import { NextRequest, NextResponse } from "next/server";
import { tooMany } from "@/app/lib/leads";

// Oct 22 (per Mely): private onboarding questionnaire — answers are emailed to MelyOS.
const esc = (v: any) => String(v ?? "").replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c] as string)).slice(0, 3000);
const NAMES: Record<string, string> = { rv: "RV Park / Mobile Home", campground: "Campground", marina: "Marina" };

export async function POST(req: NextRequest) {
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  if (tooMany(`q:${ip}`, 5)) return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  const b = await req.json().catch(() => ({}));
  if (b.website_hp) return NextResponse.json({ success: true }); // bot trap
  const email = String(b.email || "").trim();
  if (!NAMES[b.type] || !String(b.name || "").trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter your name and a valid email." }, { status: 400 });
  }
  if (!process.env.RESEND_API_KEY) return NextResponse.json({ error: "We couldn't send it. Please email us." }, { status: 500 });
  const sections = (Array.isArray(b.answers) ? b.answers : []).slice(0, 20);
  const html = `<div style="font-family:Arial,sans-serif;max-width:720px"><h2>Questionnaire — ${NAMES[b.type]}</h2>${sections.map((s: any) =>
    `<h3 style="margin:18px 0 6px;color:#0369a1">${esc(s.title)}</h3><table cellpadding="6" style="border-collapse:collapse;width:100%">${(Array.isArray(s.rows) ? s.rows : []).slice(0, 40).map((r: any) =>
      `<tr style="border-top:1px solid #e2e8f0"><td style="width:45%;vertical-align:top"><b>${esc(r?.[0])}</b></td><td>${esc(r?.[1]) || '<span style="color:#94a3b8">—</span>'}</td></tr>`).join("")}</table>`).join("")}</div>`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.LEADS_FROM_EMAIL || "MelyOS <noreply@melyos.io>",
      to: process.env.LEADS_EMAIL || "melyos2026@gmail.com",
      reply_to: email,
      subject: `Questionnaire (${NAMES[b.type]}): ${String(b.business || b.name).slice(0, 80)}`,
      html,
    }),
  }).catch(() => null);
  if (!res || !res.ok) return NextResponse.json({ error: "We couldn't send it. Please try again or email us." }, { status: 500 });
  return NextResponse.json({ success: true });
}
