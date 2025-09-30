import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";

import { Marcellus_SC } from "next/font/google";
const marcellus = Marcellus_SC({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-brand",
});

const siteName = "Give It Charm";
const baseUrl = "https://www.giveitcharm.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${siteName} | Services & Renovations`,
    template: `%s | ${siteName}`,
  },
  description:
    "Making Homes Shine, One Service at a Time. Your Home, Our priority”",
  openGraph: { type: "website", siteName, url: baseUrl },
  alternates: { canonical: baseUrl },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={marcellus.variable}>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
