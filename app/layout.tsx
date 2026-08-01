import type { Viewport } from "next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://melyos.io"),

  title: {
    default: "MelyOS | Property Management, Reimagined",
    template: "%s | MelyOS",
  },

  description:
    "Interactive maps, reservations, payments, resident portals and property management tools for RV parks, marinas, campgrounds and communities.",

  openGraph: {
    title: "MelyOS | Property Management, Reimagined",
    description:
      "Manage interactive maps, reservations, payments, residents and daily operations from one powerful platform.",
    url: "https://melyos.io",
    siteName: "MelyOS",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "MelyOS property management platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "MelyOS | Property Management, Reimagined",
    description:
      "Interactive maps, reservations, payments and property management in one platform.",
    images: ["/opengraph-image.png"],
  },
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
