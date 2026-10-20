import { NextRequest, NextResponse } from "next/server";
import { sendLead, tooMany } from "@/app/lib/leads";

// Oct 20 (per Mely): Mely on melyos.io — answers questions from FUTURE
// MelyOS clients (park, campground, marina and storage owners) and books
// demos. Never quotes prices (MelyOS doesn't publish pricing) and never
// shares anything about current clients. Needs ANTHROPIC_API_KEY and
// RESEND_API_KEY in this Vercel project.

export const maxDuration = 60;

const SYSTEM = `You are Mely, the friendly assistant on melyos.io, the website of MelyOS LLC (Kissimmee, Florida).
You talk to owners and managers of RV parks, campgrounds, marinas, mobile home communities, RV storage and self storage who are considering MelyOS.
Answer in the visitor's language (English or Spanish). Be warm, short (2–5 sentences), clear and professional. No emojis overload (one at most).

What MelyOS is: a property management platform built around each property, with:
- Interactive property map (availability, occupancy, reservations, maintenance status per lot/site/slip).
- Online reservations (availability, deposits, check-in/check-out times).
- Payments & billing: invoices, recurring rent, metered electric, late fees, online card payments, autopay, payouts to the property's own bank account.
- Resident / customer portal: balances, payments, documents, leases, maintenance requests, text-message alerts with consent.
- Rental applications online with background screening, lease documents, move-in/move-out.
- Maintenance requests with photos and status.
- Propane sales with QR pickup codes, storage lots, rent-to-own and real-estate listings for parks that need them.
- Marinas: slips with sizes, boat owners and insurance, waitlists, annual renewals, event rooms, transient rates.
- Daily cash close-out per employee shift, reports, staff logins and roles.
- Ask Mely: an AI assistant for the property's staff and a public chat for its residents and guests.
- A custom property website and setup/onboarding done by the MelyOS team, plus training.

Rules:
- NEVER give prices, fees, discounts or percentages. Say pricing depends on the property and the setup, and offer a personalized demo/quote.
- NEVER name or describe current clients, their data, or any vendor/processor behind the platform.
- Don't promise features that aren't listed; say the team will confirm in the demo.
- Legal, tax or contract questions → the MelyOS team will answer during the demo.
- When the visitor shows interest, offer to book a demo and collect: name, business/property name, email, phone (optional), property type, number of spaces/sites/slips. When you have at least name + email (and ideally business and type), call the save_lead tool ONCE, then confirm that the team will reach out soon.`;

const tools = [
  {
    name: "save_lead",
    description: "Send the visitor's demo request to the MelyOS team. Call once, only after the visitor gave at least name and email.",
    input_schema: {
      type: "object",
      properties: {
        name: { type: "string" }, business: { type: "string" }, email: { type: "string" }, phone: { type: "string" },
        propertyType: { type: "string" }, spaces: { type: "string" }, message: { type: "string", description: "What they want / notes" },
      },
      required: ["name", "email"],
    },
  },
];

export async function POST(req: NextRequest) {
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  if (tooMany(`mely:${ip}`, 60)) return NextResponse.json({ reply: "We're getting a lot of messages right now. Please try again later or use the demo form below." });
  if (!process.env.ANTHROPIC_API_KEY) return NextResponse.json({ reply: "Mely isn't available right now. Please use the demo form below and our team will contact you." });

  const body = await req.json().catch(() => ({}));
  const raw: any[] = Array.isArray(body.messages) ? body.messages.slice(-20) : [];
  const messages = raw
    .map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: String(m.content || "").slice(0, m.role === "assistant" ? 3000 : 1500) }))
    .filter((m) => m.content.trim());
  if (!messages.length || messages[messages.length - 1].role !== "user") return NextResponse.json({ reply: "Hi! How can I help?" });

  const api: any[] = [...messages];
  let leadSaved = false;
  for (let round = 0; round < 3; round++) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY!, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: process.env.MELY_MODEL || "claude-sonnet-4-6", max_tokens: 600, system: SYSTEM, tools, messages: api }),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error("mely (melyos.io):", data?.error);
      return NextResponse.json({ reply: "Sorry, I had trouble answering. Please try again or use the demo form below." });
    }
    if (data.stop_reason === "tool_use") {
      api.push({ role: "assistant", content: data.content });
      const results = [];
      for (const b of data.content) {
        if (b.type !== "tool_use") continue;
        let out = "Saved. The team will contact the visitor.";
        if (b.name === "save_lead" && !leadSaved) {
          const email = String(b.input?.email || "").trim();
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) out = "The email looks invalid; ask the visitor to check it.";
          else if (tooMany(`lead:${ip}`, 3)) out = "Already received; tell the visitor the team will reach out.";
          else {
            try {
              await sendLead({ source: "mely_chat", ...b.input, email });
              leadSaved = true;
            } catch {
              out = "Could not send. Ask the visitor to use the demo form on the page.";
            }
          }
        }
        results.push({ type: "tool_result", tool_use_id: b.id, content: out });
      }
      api.push({ role: "user", content: results });
      continue;
    }
    const text = (data.content || []).map((b: any) => (b.type === "text" ? b.text : "")).join("\n").trim();
    return NextResponse.json({ reply: text || "How can I help?", leadSaved });
  }
  return NextResponse.json({ reply: "Thanks! Our team will be in touch soon.", leadSaved });
}
