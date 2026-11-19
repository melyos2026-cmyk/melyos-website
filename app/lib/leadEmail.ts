// Nov 18 (per Mely — "que se vea bonito, elegante, una compañía seria mandándole leads"): the email a property
// gets when a guest requests a site / slip on MelyOS Explore. Table layout + inline styles so it looks the
// same in Gmail, Outlook and phones. `claimUrl` is set when the listing isn't claimed yet.
const e = (v: unknown) => String(v ?? "").replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c] as string));

export function leadEmail(o: {
  property: string; unit: "site" | "slip"; guest: string; email: string; phone?: string; arrive?: string; depart?: string;
  stay?: string; vehicleLabel: string; vehicle?: string; spot?: string; message?: string; photo?: string; listingUrl: string; claimUrl?: string;
}) {
  const fmt = (d?: string) => {
    if (!d) return "—";
    const t = new Date(`${d}T12:00:00`);
    return isNaN(+t) ? e(d) : t.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  };
  const nights = o.arrive && o.depart ? Math.round((+new Date(`${o.depart}T12:00:00`) - +new Date(`${o.arrive}T12:00:00`)) / 864e5) : 0;
  const first = e(String(o.guest || "the guest").trim().split(/\s+/)[0]);
  const subj = encodeURIComponent(`Your ${o.unit} request at ${o.property}`);
  const tel = String(o.phone || "").replace(/[^\d+]/g, "");
  const row = (k: string, v: string) =>
    `<tr><td style="padding:10px 0;border-top:1px solid #E8EEF4;color:#64748B;font-size:13px;width:38%">${k}</td><td style="padding:10px 0;border-top:1px solid #E8EEF4;color:#0B1F3A;font-size:14px;font-weight:600">${v}</td></tr>`;
  const pill = (href: string, label: string, main: boolean) =>
    `<a href="${href}" style="display:inline-block;margin:4px 6px 4px 0;padding:13px 22px;border-radius:999px;font:700 14px Arial,sans-serif;text-decoration:none;${main ? "background:#08B8D8;color:#ffffff" : "background:#ffffff;color:#0B1F3A;border:1px solid #CBD5E1"}">${label}</a>`;
  const label = (t: string) => `<div style="color:#64748B;font-size:11px;letter-spacing:1.5px;font-weight:700">${t}</div>`;

  return `<!doctype html><html><body style="margin:0;padding:0;background:#EEF3F8">
<div style="display:none;max-height:0;overflow:hidden">${e(o.guest)} wants a ${o.unit} at ${e(o.property)}${o.arrive ? ` from ${fmt(o.arrive)}` : ""} — reply to answer them directly.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EEF3F8;padding:28px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;font-family:Arial,Helvetica,sans-serif">
  <tr><td style="background:#071A33;border-radius:18px 18px 0 0;padding:22px 28px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td><img src="https://melyos.io/email/melyos-m.png" width="46" height="33" alt="MelyOS" style="vertical-align:middle;border:0"><span style="vertical-align:middle;color:#ffffff;font-size:20px;font-weight:700;margin-left:8px">MelyOS</span><span style="vertical-align:middle;color:#39D5EE;font-size:12px;letter-spacing:2px;margin-left:8px">EXPLORE</span></td>
      <td align="right" style="color:#8FA6BF;font-size:12px">Marinas · RV parks · Campgrounds</td>
    </tr></table>
  </td></tr>
  ${o.photo ? `<tr><td style="background:#071A33;padding:0 28px"><img src="${e(o.photo)}" width="544" alt="${e(o.property)}" style="display:block;width:100%;height:auto;max-height:220px;object-fit:cover;border-radius:14px;border:0"></td></tr>` : ""}
  <tr><td style="background:#071A33;padding:22px 28px 30px">
    <span style="display:inline-block;background:#08B8D8;color:#ffffff;font-size:11px;font-weight:700;letter-spacing:2px;padding:6px 12px;border-radius:999px">NEW GUEST REQUEST</span>
    <h1 style="margin:14px 0 8px;color:#ffffff;font-size:26px;line-height:32px">${e(o.guest)} wants a ${o.unit} at ${e(o.property)}</h1>
    <p style="margin:0;color:#B8CADB;font-size:15px;line-height:22px">They found you on MelyOS Explore and sent this request to you. <b style="color:#ffffff">Just reply to this email</b> — your answer goes straight to them. No fee, no commission, no middleman.</p>
  </td></tr>
  <tr><td style="background:#ffffff;padding:26px 28px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F8FB;border-radius:14px"><tr>
      <td style="padding:16px 18px;width:50%">${label("ARRIVE")}<div style="color:#0B1F3A;font-size:17px;font-weight:700;margin-top:4px">${fmt(o.arrive)}</div></td>
      <td style="padding:16px 18px;width:50%;border-left:1px solid #E2E8F0">${label("LEAVE")}<div style="color:#0B1F3A;font-size:17px;font-weight:700;margin-top:4px">${fmt(o.depart)}</div></td>
    </tr>${nights > 0 ? `<tr><td colspan="2" style="padding:0 18px 14px;color:#0E7490;font-size:13px;font-weight:700">${nights} night${nights > 1 ? "s" : ""}${o.stay ? ` · ${e(o.stay)} stay` : ""}</td></tr>` : ""}</table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px">
      ${o.spot ? row(o.unit === "slip" ? "Slip" : "Site", e(o.spot)) : ""}
      ${!nights && o.stay ? row("Stay", e(o.stay)) : ""}
      ${row(e(o.vehicleLabel), e(o.vehicle || "—"))}
      ${row("Guest", e(o.guest))}
      ${row("Email", `<a href="mailto:${e(o.email)}?subject=${subj}" style="color:#0284C7;text-decoration:none">${e(o.email)}</a>`)}
      ${o.phone ? row("Phone", `<a href="tel:${e(tel)}" style="color:#0284C7;text-decoration:none">${e(o.phone)}</a>`) : ""}
    </table>
    ${o.message ? `<div style="margin-top:16px;padding:14px 16px;border-left:4px solid #08B8D8;background:#F4F8FB;border-radius:0 10px 10px 0;color:#0B1F3A;font-size:14px;line-height:21px">${label(`MESSAGE FROM ${first.toUpperCase()}`)}<div style="margin-top:4px">${e(o.message)}</div></div>` : ""}
    <div style="margin-top:22px">${pill(`mailto:${e(o.email)}?subject=${subj}`, `Reply to ${first}`, true)}${tel ? pill(`tel:${e(tel)}`, `Call ${first}`, false) : ""}</div>
  </td></tr>
  ${o.claimUrl ? `<tr><td style="background:#ffffff;padding:0 28px 26px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#071A33;border-radius:14px"><tr><td style="padding:22px 22px 24px">
      <div style="color:#39D5EE;font-size:11px;letter-spacing:2px;font-weight:700">FREE FOR OWNERS</div>
      <div style="color:#ffffff;font-size:19px;font-weight:700;margin:6px 0 10px;line-height:25px">${e(o.property)} is already on MelyOS Explore — claim it free</div>
      <table role="presentation" cellpadding="0" cellspacing="0" style="color:#C9D8E6;font-size:14px;line-height:22px">
        <tr><td style="padding:2px 8px 2px 0;color:#39D5EE;vertical-align:top">✓</td><td>Your own photos, rates and amenities on your page</td></tr>
        <tr><td style="padding:2px 8px 2px 0;color:#39D5EE;vertical-align:top">✓</td><td>Every request like this one, straight to your inbox</td></tr>
        <tr><td style="padding:2px 8px 2px 0;color:#39D5EE;vertical-align:top">✓</td><td>A Verified badge so guests know it's the official listing</td></tr>
      </table>
      <div style="margin-top:16px">${pill(o.claimUrl, `Claim ${e(o.property)} free →`, true)}</div>
      <div style="color:#8FA6BF;font-size:12px;margin-top:6px">Takes 2 minutes · No credit card</div>
    </td></tr></table>
  </td></tr>` : ""}
  <tr><td style="background:#ffffff;border-radius:0 0 18px 18px;padding:0 28px 24px">
    <p style="margin:0;color:#94A3B8;font-size:12px;line-height:18px">${o.claimUrl
      ? `You're receiving this because a guest sent a request to ${e(o.property)} on <a href="${e(o.listingUrl)}" style="color:#64748B">melyos.io</a>, and we used the email published on your website. Not your property? Just reply and let us know.`
      : `Sent from your listing on <a href="${e(o.listingUrl)}" style="color:#64748B">MelyOS Explore</a>.`}</p>
  </td></tr>
  <tr><td align="center" style="padding:18px 10px;color:#94A3B8;font-size:12px;line-height:18px">MelyOS LLC · Kissimmee, Florida · <a href="https://melyos.io" style="color:#64748B">melyos.io</a><br>Property management software for RV parks, marinas and campgrounds.</td></tr>
</table></td></tr></table></body></html>`;
}
