import type { Metadata } from "next";
import LegalPage, { h2 } from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy | MelyOS LLC",
  description: "How MelyOS LLC collects, uses and protects personal information, including text-message (SMS) opt-in data.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="October 8, 2026">
      <p>
        MelyOS LLC (&quot;<strong>MelyOS</strong>,&quot; &quot;<strong>we</strong>,&quot; &quot;<strong>us</strong>&quot;) provides property-management software and payment tools to RV parks, marinas, campgrounds and similar businesses (&quot;<strong>Customers</strong>&quot;). This Privacy Policy explains how we handle personal information. Please read it together with the privacy notice of the park or business you deal with.
      </p>

      <h2 style={h2}>1. Who is responsible for your information</h2>
      <p>If you are a resident, guest or applicant of one of our Customers, the park or business you deal with decides why and how your information is collected and used. We process it on that Customer&apos;s behalf as a service provider. For requests about your information, please contact the park first; we will help the park respond.</p>
      <p>If you visit melyos.io, contact us, or are a Customer&apos;s staff member using our software, we are responsible for the information we collect from you directly, as described below.</p>

      <h2 style={h2}>2. Information we collect</h2>
      <ul>
        <li><strong>Information you provide:</strong> such as your name, email, phone number, address, the lot or unit you are interested in, vehicle and RV details, application and lease information, maintenance requests, messages and files you upload.</li>
        <li><strong>Payment information:</strong> card details are entered into the secure forms of our payment processing partners. We receive limited information, such as payment status, the last four digits of a card and a payment reference. We do not store full card numbers.</li>
        <li><strong>Background screening:</strong> if you apply to rent, a consumer-reporting agency may collect additional information from you through its own form to prepare a screening report for the park.</li>
        <li><strong>Automatically collected information:</strong> such as device and browser type, IP address, pages viewed, and security and error logs.</li>
      </ul>

      <h2 style={h2}>3. How we use information</h2>
      <p>To provide, operate, secure and support the software and the services our Customers ask us to provide, including applications, reservations, leases, billing, payments, maintenance and communications; to send service messages, receipts and reminders; to detect and prevent fraud and abuse; to improve our products; and to comply with legal obligations.</p>
      <p>We do not sell personal information, and we do not share it for third-party advertising.</p>

      <h2 style={h2}>4. How we share information</h2>
      <p>We share information only with the park or business you deal with, with service providers that help us run the service (such as hosting, email and text-message delivery, payment processing and consumer-reporting agencies), when required by law, and in connection with a business transfer. Service providers may use the information only to provide services to us or to the park.</p>

      <h2 style={h2}>5. Text messages (SMS)</h2>
      <p>If you give your mobile number to a park that uses MelyOS and agree to receive text messages, the park, through MelyOS, may send you service messages such as a link to complete a rental application, invoice and payment links, and reservation confirmations. Message frequency varies. Message and data rates may apply. Reply STOP to opt out at any time, or HELP for help. Consent to receive text messages is not a condition of any purchase or rental.</p>
      <p><strong>We do not sell or share your SMS opt-in data or personal information with third parties for marketing purposes.</strong> Mobile numbers and text-message consent are not shared with third parties or affiliates for their marketing or promotional purposes.</p>

      <h2 style={h2}>6. Retention and security</h2>
      <p>We keep information for as long as needed for the purposes described, as our Customer instructs, and as required by law. We use safeguards designed to protect information, including encryption in transit, access controls, hashed passwords and separation of each Customer&apos;s data. No system is completely secure, and we cannot guarantee absolute security.</p>

      <h2 style={h2}>7. Your choices and rights</h2>
      <p>Depending on where you live, you may have rights to request access to, correction of, or deletion of your personal information. If your information is held for a park, please make the request to the park; if you send it to us, we will refer it to them where required. For information we control, contact us at the address below.</p>

      <h2 style={h2}>8. Children</h2>
      <p>Our services are intended for adults. We do not knowingly collect personal information from children under 13.</p>

      <h2 style={h2}>9. Changes</h2>
      <p>We may update this policy from time to time. We will post the updated version here with a new &quot;last updated&quot; date.</p>

      <h2 style={h2}>10. Contact us</h2>
      <p>MelyOS LLC<br />2765 Lloyd Ln, Kissimmee, FL<br />Email: <a href="mailto:privacy@melyos.io">privacy@melyos.io</a><br />Website: melyos.io</p>
    </LegalPage>
  );
}
