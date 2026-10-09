import Link from "next/link";
import type { ReactNode } from "react";

export default function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "48px 20px 80px", lineHeight: 1.65, color: "#071a33" }}>
      <p style={{ margin: 0 }}>
        <Link href="/" style={{ color: "#0b5ed7", textDecoration: "none", fontWeight: 600 }}>← MelyOS</Link>
      </p>
      <h1 style={{ fontSize: 34, margin: "16px 0 4px" }}>{title}</h1>
      <p style={{ color: "#5b6b82", margin: "0 0 28px" }}>MelyOS LLC · Last updated: {updated}</p>
      {children}
      <hr style={{ margin: "40px 0 16px", border: 0, borderTop: "1px solid #dbe3ee" }} />
      <p style={{ fontSize: 14, color: "#5b6b82" }}>
        <Link href="/privacy" style={{ color: "#0b5ed7" }}>Privacy Policy</Link> · <Link href="/terms" style={{ color: "#0b5ed7" }}>Terms &amp; Conditions</Link>
      </p>
    </main>
  );
}

export const h2 = { fontSize: 21, margin: "30px 0 8px" } as const;
