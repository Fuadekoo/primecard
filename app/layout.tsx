import type { Metadata } from "next";
import Providers from "./providers";
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

export const metadata: Metadata = {
  title: "Prime Rentals",
  description:
    "Discover and book top-quality rental properties with Prime Rentals. Find your next home or vacation stay easily and securely.",
  openGraph: {
    title: "Prime Rentals",
    description:
      "Discover and book top-quality rental properties with Prime Rentals. Find your next home or vacation stay easily and securely.",
    url: "https://qrcode.primeaddis.com",
    siteName: "Prime Rentals",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Prime Rentals Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prime Rentals",
    description:
      "Discover and book top-quality rental properties with Prime Rentals. Find your next home or vacation stay easily and securely.",
    images: [
      {
        url: "/logo.png",
        alt: "Prime Rentals Logo",
      },
    ],
    site: "@PrimeRentals",
  },
  // These Open Graph tags will be used by WhatsApp, Telegram, TikTok, Facebook, LinkedIn, etc.
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
