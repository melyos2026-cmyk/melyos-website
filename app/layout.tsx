import type { Viewport } from "next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MelyChat from "./components/MelyChat"; // Oct 20: Mely chat for future clients

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

  title: "MelyOS | Property Management Platform",

  description:
    "One platform for RV parks, marinas and campgrounds: a live property map, online booking and payments, contracts with e-signature, customer portal and an AI assistant. Set up for you by our team.",

  openGraph: {
    title: "MelyOS | Property Management Platform",
    description:
      "Interactive maps, reservations, payments and property management in one powerful platform.",
    url: "https://melyos.io",
    siteName: "MelyOS",
    images: [
      {
        url: "/melyos-share-logo.png",
        width: 1200,
        height: 630,
        alt: "MelyOS logo",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "MelyOS | Property Management Platform",
    description:
      "Interactive maps, reservations, payments and property management.",
    images: ["/melyos-share-logo.png"],
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
      <body className="min-h-full flex flex-col">
        {children}
        <MelyChat />
      </body>
    </html>
  );
}
