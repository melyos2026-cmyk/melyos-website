import { NextRequest, NextResponse } from "next/server";
import { tooMany } from "@/app/lib/leads";
import { exploreApi, sessionValue, cookieOpts, COOKIE, currentSession, sendMail, mailWrap, btn, escH } from "@/app/lib/explore";

// Nov 17 (per Mely): Explore accounts for boaters / RVers / campers.
// POST { action: signup | login | logout | forgot | reset | verify | resend }
const SITE = "https://melyos.io";
const verifyMail = (name: string, tk: string) => mailWrap(`Welcome aboard, ${escH(name.split(" ")[0])}!`,
  `<p>Confirm your email to write reviews and keep your requests in one place.</p><p>${btn(`${SITE}/explore/verify?token=${tk}`, "Confirm my email")}</p>`);

export async function POST(req: NextRequest) {
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  const b = await req.json().catch(() => ({}));
  const done = (data: any, status = 200) => NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
  const withSession = (boater: any) => { const res = done({ ok: true, boater }); res.cookies.set(COOKIE, sessionValue(boater.id, boater.session_version), cookieOpts); return res; };

  if (b.action === "logout") { const res = done({ ok: true }); res.cookies.set(COOKIE, "", { ...cookieOpts, maxAge: 0 }); return res; }
  if (tooMany(`ex-auth:${ip}`, 20, 15 * 60_000)) return done({ error: "Too many tries. Wait a few minutes." }, 429);

  if (b.action === "signup") {
    if (b.website_hp) return done({ ok: true });
    const r = await exploreApi("signup", { name: b.name, email: b.email, phone: b.phone, password: b.password });
    if (!r.ok) return done({ error: r.data.error }, r.status);
    await sendMail(r.data.boater.email, "Confirm your email — MelyOS Explore", verifyMail(r.data.boater.name, r.data.verify_token));
    return withSession(r.data.boater);
  }
  if (b.action === "login") {
    const r = await exploreApi("login", { email: b.email, password: b.password });
    return r.ok ? withSession(r.data.boater) : done({ error: r.data.error }, r.status);
  }
  if (b.action === "verify") {
    const r = await exploreApi("verify", { token: b.token });
    return r.ok ? done({ ok: true }) : done({ error: r.data.error }, r.status);
  }
  if (b.action === "resend") {
    const s = await currentSession(); if (!s) return done({ error: "Sign in first." }, 401);
    const r = await exploreApi("resend_verify", s);
    if (!r.ok) return done({ error: r.data.error }, r.status);
    if (r.data.verify_token) await sendMail(r.data.email, "Confirm your email — MelyOS Explore", verifyMail(r.data.name, r.data.verify_token));
    return done({ ok: true });
  }
  if (b.action === "forgot") {
    const r = await exploreApi("forgot", { email: b.email });
    if (r.ok && r.data.reset_token) await sendMail(r.data.email, "Reset your password — MelyOS Explore", mailWrap("Reset your password",
      `<p>Hi ${escH(String(r.data.name).split(" ")[0])}, tap the button to choose a new password. The link works for 1 hour.</p><p>${btn(`${SITE}/explore/reset?token=${r.data.reset_token}`, "Choose a new password")}</p><p style="color:#64748b;font-size:13px">If you didn't ask for this, ignore this email.</p>`));
    return done({ ok: true });
  }
  if (b.action === "reset") {
    const r = await exploreApi("reset", { token: b.token, password: b.password });
    return r.ok ? withSession(r.data.boater) : done({ error: r.data.error }, r.status);
  }
  return done({ error: "Unknown action." }, 400);
}
