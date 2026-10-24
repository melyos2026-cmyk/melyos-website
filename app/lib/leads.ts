// Oct 20 (per Mely): leads from melyos.io (demo form + Mely chat) are emailed
// to MelyOS from noreply@melyos.io. LEADS_EMAIL sets who receives them
// (default melyos2026@gmail.com). Needs RESEND_API_KEY in this Vercel project.
// Server-only.

export type Lead = {
  name?: string;
  business?: string;
  email?: string;
  phone?: string;
  propertyType?: string;
  spaces?: string | number;
  message?: string;
  source: "demo_form" | "mely_chat" | "questionnaire";
  country?: string | null;   // Oct 24: visitor's country/region (from the request), for Insights
  region?: string | null;
};

// Oct 24 (per Mely): every lead is also saved in MelyOS Insights (admin.melyos.io → Insights → melyos.io),
// so none is lost in the inbox. Best effort: the email still goes out if this fails.
export async function recordLead(lead: Lead) {
  try {
    await fetch(`${process.env.MELYOS_ADMIN_ORIGIN || "https://admin.melyos.io"}/api/public/melyos-site`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "lead", ...lead }),
      signal: AbortSignal.timeout(4000),
    });
  } catch { /* never block the visitor */ }
}
export function geoOf(headers: Headers) {
  let region = headers.get("x-vercel-ip-country-region") || "";
  try { region = decodeURIComponent(region); } catch {}
  return { country: headers.get("x-vercel-ip-country") || null, region: region || null };
}

const esc = (v: any) => String(v ?? "").replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c] as string)).slice(0, 2000);

// Simple in-memory guard against floods (per server instance).
const hits = new Map<string, number[]>();
export function tooMany(key: string, max = 5, windowMs = 60 * 60 * 1000) {
  const now = Date.now();
  const list = (hits.get(key) || []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(key, list);
  return list.length > max;
}

export async function sendLead(lead: Lead) {
  await recordLead(lead);
  if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is not set.");
  const rows: [string, any][] = [
    ["Name", lead.name], ["Business", lead.business], ["Email", lead.email], ["Phone", lead.phone],
    ["Property type", lead.propertyType], ["Spaces", lead.spaces], ["Message", lead.message],
  ];
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.LEADS_FROM_EMAIL || "MelyOS <noreply@melyos.io>",
      to: process.env.LEADS_EMAIL || "melyos2026@gmail.com",
      reply_to: lead.email || undefined,
      subject: `New MelyOS lead (${lead.source === "mely_chat" ? "Mely chat" : lead.source === "questionnaire" ? "questionnaire" : "demo form"}): ${String(lead.business || lead.name || "").slice(0, 80)}`,
      html: `<div style="font-family:Arial,sans-serif"><h2>New lead from melyos.io</h2><table cellpadding="6">${rows
        .filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== "")
        .map(([k, v]) => `<tr><td><b>${k}</b></td><td>${esc(v)}</td></tr>`)
        .join("")}</table></div>`,
    }),
  });
  if (!res.ok) throw new Error(`Email failed (${res.status})`);
}
