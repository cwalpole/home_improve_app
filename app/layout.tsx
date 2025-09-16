import type { Metadata } from "next";
import "./globals.css";

const siteName = "Acme Builders";
const baseUrl = "https://www.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${siteName} | Construction & Renovations`,
    template: `%s | ${siteName}`,
  },
  description:
    "Premium construction, renovations, and design-build services. Licensed, insured, on-time and on-budget.",
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
      <body>{children}</body>
    </html>
  );
}
