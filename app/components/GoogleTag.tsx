// Nov 17 (per Mely): Google tag for Google Ads (account 685-233-9123) to measure questionnaire leads.
// Consent Mode v2: everything denied by default; granted only after "Accept all" in the cookie banner.
import Script from "next/script";

const TAG_ID = "GTM-MHMRM6N8";

const code = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
var ok = false; try { ok = localStorage.getItem("cookie_consent") === "all"; } catch (e) {}
gtag("consent", "default", {
  ad_storage: ok ? "granted" : "denied",
  ad_user_data: ok ? "granted" : "denied",
  ad_personalization: "denied",
  analytics_storage: ok ? "granted" : "denied",
  wait_for_update: 500
});
gtag("js", new Date());
window.addEventListener("cookie-consent-all", function () {
  gtag("consent", "update", { ad_storage: "granted", ad_user_data: "granted", analytics_storage: "granted" });
});
var s = document.createElement("script"); s.async = true;
s.src = "https://www.googletagmanager.com/gtm.js?id=${TAG_ID}";
document.head.appendChild(s);
`;

export default function GoogleTag() {
  return <Script id="google-tag" strategy="afterInteractive">{code}</Script>;
}
