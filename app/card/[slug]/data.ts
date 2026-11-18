import { exploreApi } from "@/app/lib/explore";

export type PartnerCard = { slug: string; name: string; phone: string | null; email: string | null };
// Nov 18 (per Mely): a Sales Partner's digital business card, saved from the partner portal.
export async function getCard(slug: string): Promise<PartnerCard | null> {
  const r = await exploreApi<{ card: PartnerCard }>("partner_card", { slug: String(slug || "").toLowerCase() });
  return r.ok && r.data.card ? r.data.card : null;
}
export const tel = (p?: string | null) => { const d = String(p || "").replace(/\D/g, ""); return d.length === 10 ? `+1${d}` : d ? `+${d}` : ""; };
