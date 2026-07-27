import type { Metadata } from "next";
import { Inter, Space_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

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

import { SITE_URL as siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "OhoTool — Free Online Tools for PDF, Images, Text & More",
    template: "%s · OhoTool",
  },
  description:
    "80+ free online tools that run right in your browser — convert Word & PDF, compress and resize images, extract text with OCR, format code, calculate, and generate QR codes. No sign-up, nothing uploaded.",
  keywords: [
    "free online tools",
    "online tools",
    "pdf tools",
    "word to pdf",
    "pdf to word",
    "compress pdf",
    "image to text",
    "image converter",
    "json formatter",
    "qr code generator",
    "developer tools",
  ],
  authors: [{ name: "OhoTool" }],
  creator: "OhoTool",
  category: "technology",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "OhoTool",
    title: "OhoTool — Free Online Tools for PDF, Images, Text & More",
    description:
      "80+ fast, private, browser-based tools: PDF & document converters, image tools, text utilities, calculators, developer tools, and QR codes. Free — no sign-up, nothing uploaded.",
  },
  twitter: {
    card: "summary_large_image",
    title: "OhoTool — Free Online Tools for PDF, Images, Text & More",
    description:
      "80+ fast, private, browser-based tools: PDF & document converters, image tools, text utilities, calculators, and developer tools. Free, no sign-up.",
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
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
