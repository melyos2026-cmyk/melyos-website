// Nov 17 (per Mely): MelyOS Explore network — server-only helpers for melyos.io.
// Data lives in admin.melyos.io (/api/public/explore, signed with MELYOS_SITE_SECRET). The boater's session is a
// signed cookie here ("mx_b": id.sv.exp.hmac); sv = session_version on the server (a password reset ends old sessions).
import crypto from "crypto";
import { cookies } from "next/headers";
import { STATES, type Row } from "../components/explore/states";
import { FEATURED } from "../components/explore/featured";

const ORIGIN = process.env.MELYOS_ADMIN_ORIGIN || "https://admin.melyos.io";
const SECRET = process.env.MELYOS_SITE_SECRET || "";
export const COOKIE = "mx_b";
const DAYS = 60;

export async function exploreApi<T = any>(action: string, payload: Record<string, unknown> = {}): Promise<{ ok: boolean; status: number; data: T & { error?: string } }> {
  if (!SECRET) return { ok: false, status: 500, data: { error: "Explore isn't set up yet." } as any };
  try {
    const r = await fetch(`${ORIGIN}/api/public/explore`, { method: "POST", headers: { "Content-Type": "application/json", "x-site-secret": SECRET }, body: JSON.stringify({ action, ...payload }), cache: "no-store", signal: AbortSignal.timeout(10000) });
    const data = await r.json().catch(() => ({ error: "Something went wrong." }));
    return { ok: r.ok, status: r.status, data };
  } catch { return { ok: false, status: 502, data: { error: "Explore is not reachable right now. Try again in a minute." } as any }; }
}

const sign = (s: string) => crypto.createHmac("sha256", `explore:${SECRET}`).update(s).digest("base64url");
export function sessionValue(id: string, sv: number) {
  const exp = Math.floor(Date.now() / 1000) + DAYS * 86400;
  const body = `${id}.${sv}.${exp}`;
  return `${body}.${sign(body)}`;
}
export function parseSession(v: string | undefined | null): { boater_id: string; sv: number } | null {
  if (!v || !SECRET) return null;
  const p = v.split(".");
  if (p.length !== 4) return null;
  const body = p.slice(0, 3).join(".");
  const a = Buffer.from(sign(body)), b = Buffer.from(p[3]);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  if (Number(p[2]) < Date.now() / 1000) return null;
  return { boater_id: p[0], sv: Number(p[1]) };
}
export async function currentSession() { return parseSession((await cookies()).get(COOKIE)?.value); }
export const cookieOpts = { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/", maxAge: DAYS * 86400 };

// ---------- listings ----------
export { slugify, nice, listingPath, keyFromSlug } from "../components/explore/slug";

// The state files live in /public/explore (served as static files), read over HTTP from this same site —
// /public isn't bundled into server functions.
const cache = new Map<string, { at: number; rows: Row[] }>();
async function siteOrigin() {
  try { const { headers } = await import("next/headers"); const h = await headers(); const host = h.get("x-forwarded-host") || h.get("host"); if (host) return `${/localhost|127\.0\.0\.1/.test(host) ? "http" : "https"}://${host}`; } catch {}
  return "https://melyos.io";
}
export async function stateRows(st: string): Promise<Row[]> {
  st = st.toUpperCase();
  if (!STATES[st]) return [];
  const c = cache.get(st);
  if (c && Date.now() - c.at < 3600_000) return c.rows;
  let rows: Row[] = [];
  try { const r = await fetch(`${await siteOrigin()}/explore/${st}.json`, { next: { revalidate: 3600 } } as any); if (r.ok) rows = (await r.json()).rows || []; } catch {}
  const feat = FEATURED[st] || [];
  const names = new Set(feat.map((r) => r[1].toLowerCase()));
  const all = [...feat, ...rows.filter((r) => !names.has(String(r[1]).toLowerCase()))];
  if (rows.length) cache.set(st, { at: Date.now(), rows: all });
  return all;
}
// Nov 17: OpenStreetMap draft slip/site map for a listing (public/explore/drafts/{ST}/{key}.json), if the agent made one.
export async function draftMap(st: string, key: string): Promise<any | null> {
  if (!/^[A-Za-z0-9_-]{2,40}$/.test(key)) return null;
  try { const r = await fetch(`${await siteOrigin()}/explore/drafts/${st.toUpperCase()}/${key}.json`, { cache: "no-store" }); return r.ok ? await r.json() : null; } catch { return null; }
}
export async function findListing(st: string, key: string): Promise<Row | null> {
  return (await stateRows(st)).find((r) => r[7] === key) || null;
}

// ---------- email (Resend) ----------
const escH = (v: unknown) => String(v ?? "").replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c] as string));
export { escH };
export async function sendMail(to: string, subject: string, html: string, replyTo?: string) {
  if (!process.env.RESEND_API_KEY) return false;
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: "MelyOS Explore <noreply@melyos.io>", to, subject, html, ...(replyTo ? { reply_to: replyTo } : {}) }),
  }).catch(() => null);
  return !!r?.ok;
}
export function mailWrap(title: string, inner: string) {
  return `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#071A33">
  <div style="background:#071A33;color:#fff;padding:18px 22px;border-radius:14px 14px 0 0"><b style="font-size:18px">MelyOS Explore</b><div style="color:#39d5ee;font-size:12px;letter-spacing:.1em">MARINAS · RV PARKS · CAMPGROUNDS</div></div>
  <div style="border:1px solid #e2e8f0;border-top:0;padding:22px;border-radius:0 0 14px 14px"><h2 style="margin:0 0 12px;font-size:20px">${title}</h2>${inner}
  <p style="color:#64748b;font-size:12px;margin-top:24px">MelyOS · Kissimmee, Florida · <a href="https://melyos.io/explore" style="color:#0284c7">melyos.io/explore</a></p></div></div>`;
}
export const btn = (href: string, label: string) => `<a href="${href}" style="display:inline-block;background:#08B8D8;color:#fff;padding:12px 20px;border-radius:10px;font-weight:bold;text-decoration:none">${label}</a>`;

// ---------- Nov 18 (per Mely): a request for an UNCLAIMED listing goes straight to the property too ----------
// We read the property's own website (home page, then its contact page) and take the public email it shows
// (mailto: first). Cached for the life of the server. Never a personal guess — only what their site publishes.
const contactCache = new Map<string, { email: string | null; at: number }>();
const BAD_MAIL = /(example\.|sentry|wixpress|godaddy|squarespace|domain\.com|yourdomain|email\.com|@2x|\.png|\.jpe?g|\.gif|\.webp|\.svg|noreply|no-reply|privacy@|abuse@|webmaster@|support@wix|ingest)/i;
async function pageText(url: string): Promise<string> {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 6000);
  try {
    const r = await fetch(url, { signal: ctl.signal, redirect: "follow", headers: { "User-Agent": "Mozilla/5.0 (compatible; MelyOSExplore/1.0; +https://melyos.io/explore)", Accept: "text/html" } });
    if (!r.ok || !String(r.headers.get("content-type") || "").includes("html")) return "";
    return (await r.text()).slice(0, 600_000);
  } catch { return ""; } finally { clearTimeout(t); }
}
function emailsIn(html: string, host: string): string[] {
  const dec = html.replace(/&#64;|&#x40;|\[at\]|\(at\)/gi, "@");
  const mailto = [...dec.matchAll(/mailto:([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/gi)].map((m) => m[1]);
  const plain = [...dec.matchAll(/\b([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})\b/gi)].map((m) => m[1]);
  const all = [...new Set([...mailto, ...plain].map((e) => e.toLowerCase()))].filter((e) => !BAD_MAIL.test(e) && e.length < 80);
  const base = host.replace(/^www\./, "").split(".").slice(-2).join(".");
  return all.sort((a, b) => Number(b.endsWith(base)) - Number(a.endsWith(base)) || Number(mailto.map((x) => x.toLowerCase()).includes(b)) - Number(mailto.map((x) => x.toLowerCase()).includes(a)));
}
export async function propertyEmail(website: string): Promise<string | null> {
  if (!/^https?:\/\//i.test(website || "")) return null;
  let u: URL; try { u = new URL(website); } catch { return null; }
  if (/facebook|instagram|google|yelp|tripadvisor|koa\.com|thousandtrails|sunoutdoors|suncommunities|campspot|\.gov$/i.test(u.hostname)) return null;
  const hit = contactCache.get(u.hostname);
  if (hit && Date.now() - hit.at < 7 * 864e5) return hit.email;
  let email: string | null = null;
  for (const path of ["", "/contact", "/contact-us", "/contactus"]) {
    const html = await pageText(path ? `${u.protocol}//${u.host}${path}` : u.toString());
    const found = html ? emailsIn(html, u.hostname) : [];
    if (found.length) { email = found[0]; break; }
  }
  contactCache.set(u.hostname, { email, at: Date.now() });
  return email;
}
