import type { Metadata } from "next";
import LegalPage, { h2 } from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions | MelyOS LLC",
  description: "Terms & Conditions for MelyOS LLC services, including SMS terms.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions" updated="October 8, 2026">
      <p>
        These Terms &amp; Conditions apply to your use of melyos.io and of the property-management services provided by MelyOS LLC (&quot;<strong>MelyOS</strong>,&quot; &quot;<strong>we</strong>,&quot; &quot;<strong>us</strong>&quot;) to RV parks, marinas, campgrounds and similar businesses (&quot;<strong>Customers</strong>&quot;) and to the people who deal with them. Businesses that subscribe to MelyOS are also bound by their signed agreement with us, which controls if it conflicts with these terms.
      </p>

      <h2 style={h2}>1. The service</h2>
      <p>MelyOS provides software that helps parks manage applications, reservations, leases, billing, payments and communications. The park, not MelyOS, is the party you rent from, reserve with or pay. Questions about your rent, fees, lease or reservation should go to the park.</p>

      <h2 style={h2}>2. Accounts and acceptable use</h2>
      <p>Keep your login information confidential and provide accurate information. You may not misuse the service, attempt to access data that is not yours, interfere with its operation, or use it for unlawful purposes.</p>

      <h2 style={h2}>3. Payments</h2>
      <p>Online payments are processed by third-party payment processors. A card processing fee may be shown as a separate line item before you pay. Processing fees are not refunded when a payment is refunded, unless the park decides otherwise. Refund decisions are made by the park under its own rules and the law.</p>

      <h2 style={h2}>4. SMS Terms</h2>
      <p><strong>Program:</strong> If you give your mobile number to a park that uses MelyOS and agree to receive text messages, the park, through MelyOS LLC, may send you transactional messages such as a link to complete a rental application, invoice and payment links, and reservation confirmations. We do not send marketing or promotional messages.</p>
      <p><strong>Consent:</strong> You agree to receive these messages when you give your number to the park and say you agree. Consent is not a condition of any purchase or rental.</p>
      <p><strong>Frequency and cost:</strong> Message frequency varies and depends on your activity with the park. <strong>Message and data rates may apply.</strong></p>
      <p><strong>Opt out and help:</strong> Reply <strong>STOP</strong> at any time to stop receiving messages. Reply <strong>HELP</strong> for help, or contact us at <a href="mailto:support@melyos.io">support@melyos.io</a>.</p>
      <p><strong>Carriers:</strong> Carriers are not liable for delayed or undelivered messages.</p>
      <p><strong>Privacy:</strong> See our <a href="/privacy">Privacy Policy</a>. We do not sell or share your SMS opt-in data or personal information with third parties for marketing purposes.</p>

      <h2 style={h2}>5. Availability and disclaimers</h2>
      <p>We work to keep the service available but do not guarantee it will be uninterrupted or error-free. The service is provided &quot;as is&quot; to the extent allowed by law. Our virtual assistant may sometimes be incomplete or wrong; please confirm important details with the park.</p>

      <h2 style={h2}>6. Limitation of liability</h2>
      <p>To the extent allowed by law, MelyOS is not liable for indirect, incidental or consequential damages, and its total liability for any claim relating to the service is limited to the amount you paid MelyOS, if any, in the twelve months before the claim. Nothing in these terms limits liability that cannot be limited by law.</p>

      <h2 style={h2}>7. Governing law</h2>
      <p>These terms are governed by the laws of the State of Florida, without regard to conflict-of-law rules.</p>

      <h2 style={h2}>8. Changes</h2>
      <p>We may update these terms from time to time by posting the new version here with a new &quot;last updated&quot; date.</p>

      <h2 style={h2}>9. Contact us</h2>
      <p>MelyOS LLC<br />2765 Lloyd Ln, Kissimmee, FL<br />Email: <a href="mailto:support@melyos.io">support@melyos.io</a><br />Website: melyos.io</p>
    </LegalPage>
  );
}
