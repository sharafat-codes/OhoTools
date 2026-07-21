import type { Metadata } from "next";
import { Inter, Space_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

// Body / UI text — highly legible SaaS standard.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Headings — geometric display with a modern edge.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

// Monospace — used for code/tokens.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.BETTER_AUTH_URL || "https://oho-tools.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ToolPilot — QR codes, barcodes & scan analytics",
    template: "%s · ToolPilot",
  },
  description:
    "Generate dynamic QR codes and barcodes, track scans with analytics, add your logo, export SVG/PDF, and automate with an API. A modern toolkit for businesses and creators.",
  keywords: [
    "QR code generator",
    "dynamic QR code",
    "QR code with logo",
    "barcode generator",
    "QR scan analytics",
    "bulk QR codes",
    "QR code API",
  ],
  authors: [{ name: "ToolPilot" }],
  creator: "ToolPilot",
  category: "technology",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "ToolPilot",
    title: "ToolPilot — QR codes, barcodes & scan analytics",
    description:
      "Dynamic QR codes with scan analytics, custom branding, bulk generation, and an API. The modern toolkit for businesses and creators.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolPilot — QR codes, barcodes & scan analytics",
    description:
      "Dynamic QR codes with scan analytics, custom branding, bulk generation, and an API.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
