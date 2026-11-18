import type { Metadata } from "next";
import Go from "./Go";

// Nov 18 (per Mely): share melyos.io/review to ask for a Google review — the preview shows the
// MelyOS photo, and the link opens Google's "write a review" form.
const GOOGLE_REVIEW = "https://g.page/r/CQPqJt75j11HEBM/review";
const TITLE = "Review MelyOS on Google ⭐⭐⭐⭐⭐";
const DESC = "Thank you for working with MelyOS! It takes 30 seconds — your review helps other RV parks, marinas and campgrounds find us.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  robots: { index: false, follow: false },
  alternates: { canonical: "/review" },
  openGraph: { title: TITLE, description: DESC, url: "https://melyos.io/review", siteName: "MelyOS", type: "website",
    images: [{ url: "/melyos-share.jpg", width: 1200, height: 630, alt: "MelyOS" }] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["/melyos-share.jpg"] },
};

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#06182e] px-6 text-center text-white">
      <Go to={GOOGLE_REVIEW} />
      <div className="max-w-md">
        <img src="/melyos-logo-trimmed.png" alt="MelyOS" className="mx-auto h-16 w-auto rounded-xl bg-white p-2" />
        <h1 className="mt-6 text-3xl font-black">Thank you! / ¡Gracias!</h1>
        <p className="mt-3 text-slate-300">Opening Google to leave your review… / Abriendo Google para dejar tu reseña…</p>
        <a href={GOOGLE_REVIEW} className="mt-6 inline-block rounded-xl bg-[#08B8D8] px-6 py-3 font-black">Write a review on Google</a>
      </div>
    </main>
  );
}
