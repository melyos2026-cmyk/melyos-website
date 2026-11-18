import { getCard, tel } from "../data";

// Nov 18: "Save contact" — a vCard with the partner's name, phone and email at MelyOS.
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await getCard(slug);
  if (!c) return new Response("Not found", { status: 404 });
  const esc = (s: string) => s.replace(/([,;\\])/g, "\\$1");
  const parts = c.name.trim().split(/\s+/);
  const last = parts.length > 1 ? parts.pop()! : "", first = parts.join(" ");
  const lines = ["BEGIN:VCARD", "VERSION:3.0", `N:${esc(last)};${esc(first)};;;`, `FN:${esc(c.name)}`, "ORG:MelyOS LLC", "TITLE:Sales Partner",
    c.phone ? `TEL;TYPE=CELL,VOICE:${tel(c.phone)}` : "", c.email ? `EMAIL;TYPE=WORK:${c.email}` : "", "URL:https://melyos.io",
    `NOTE:Property management software for RV parks\\, marinas and campgrounds. MelyOS office: (407) 564-6640.`, "END:VCARD"].filter(Boolean);
  return new Response(lines.join("\r\n") + "\r\n", { headers: { "Content-Type": "text/vcard; charset=utf-8", "Content-Disposition": `attachment; filename="${c.slug}.vcf"`, "Cache-Control": "no-store" } });
}
