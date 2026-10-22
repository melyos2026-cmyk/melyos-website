import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TYPES, sectionsFor, type QType } from "../questions";
import QuestionnaireForm from "../QuestionnaireForm";

// Oct 22 (per Mely): private onboarding questionnaire. Only sent by MelyOS after a
// prospect contacts us — not in the menu, the sitemap or search engines.

export const metadata: Metadata = {
  title: "MelyOS Questionnaire",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export function generateStaticParams() {
  return Object.keys(TYPES).map((type) => ({ type }));
}

export default async function Page({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (!(type in TYPES)) notFound();
  const t = type as QType;
  return <QuestionnaireForm type={t} name={TYPES[t].name} sections={sectionsFor(t)} />;
}
