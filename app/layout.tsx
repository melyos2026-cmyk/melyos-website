import type { Viewport } from "next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MelyChat from "./components/MelyChat"; // Oct 20: Mely chat for future clients
import CookieBanner from "./components/CookieBanner";
import SiteTracker from "./components/SiteTracker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Oct 21 (per Mely): search-engine setup — clear title/description, canonical URL,
// keywords, and structured data (Organization, WebSite, SoftwareApplication) so Google
// understands who MelyOS is. Favicon/app icons come from app/icon.png and app/apple-icon.png.
const DESCRIPTION =
  "MelyOS is property management software for RV parks, marinas and campgrounds: a live interactive property map, online reservations and payments, contracts with e-signature, background checks, customer portal, QuickBooks export and an AI assistant. Set up for you by our team in Kissimmee, Florida.";

export const metadata: Metadata = {
  metadataBase: new URL("https://melyos.io"),
  title: {
    default: "MelyOS | RV Park & Marina Management Software",
    template: "%s | MelyOS",
  },
  description: DESCRIPTION,
  applicationName: "MelyOS",
  keywords: [
    "RV park management software", "marina management software", "campground reservation software",
    "RV park reservation system", "marina slip reservation", "boat slip management", "interactive property map",
    "mobile home park software", "RV storage software", "Florida RV park software", "Florida marina software", "MelyOS",
  ],
  authors: [{ name: "MelyOS LLC" }],
  creator: "MelyOS LLC",
  publisher: "MelyOS LLC",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  openGraph: {
    title: "MelyOS | RV Park & Marina Management Software",
    description: "A live map of your property, online booking and payments, contracts, screening and an AI assistant, set up for you by our team.",
    url: "https://melyos.io",
    siteName: "MelyOS",
    locale: "en_US",
    images: [{ url: "/melyos-share.jpg", width: 1200, height: 630, alt: "MelyOS" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MelyOS | RV Park & Marina Management Software",
    description: "A live map of your property, online booking and payments, contracts, screening and an AI assistant.",
    images: ["/melyos-share.jpg"],
  },
  category: "technology",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://melyos.io/#organization",
      name: "MelyOS",
      legalName: "MelyOS LLC",
      url: "https://melyos.io",
      logo: "https://melyos.io/icon.png",
      email: "info@melyos.io",
      description: DESCRIPTION,
      address: { "@type": "PostalAddress", addressLocality: "Kissimmee", addressRegion: "FL", addressCountry: "US" },
      areaServed: "US",
      contactPoint: [{ "@type": "ContactPoint", contactType: "sales", email: "info@melyos.io", availableLanguage: ["English", "Spanish"] }],
    },
    {
      "@type": "WebSite",
      "@id": "https://melyos.io/#website",
      url: "https://melyos.io",
      name: "MelyOS",
      publisher: { "@id": "https://melyos.io/#organization" },
      inLanguage: "en-US",
    },
    {
      "@type": "SoftwareApplication",
      name: "MelyOS",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description: DESCRIPTION,
      url: "https://melyos.io",
      publisher: { "@id": "https://melyos.io/#organization" },
      featureList: [
        "Interactive property map", "Online reservations", "Payment processing and billing", "Customer portal",
        "Contracts with e-signature", "Background checks", "Point of sale (propane, fuel dock, ship store)",
        "Messages to customers", "Maintenance requests", "Staff roles and shift close-out", "QuickBooks Online export", "AI assistant",
      ],
    },
    {
      "@type": "SiteNavigationElement",
      name: ["RV Park Software", "Marina Software", "Campground Software", "Features", "Pricing", "Book a Demo", "About"],
      url: ["https://melyos.io/rv-park-software", "https://melyos.io/marina-software", "https://melyos.io/campground-software", "https://melyos.io/features", "https://melyos.io/pricing", "https://melyos.io/demo", "https://melyos.io/about"],
    },
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
        <MelyChat />
        <CookieBanner />
        <SiteTracker />
      </body>
    </html>
  );
}
