import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Space_Grotesk, Geist_Mono, Manrope } from "next/font/google";
import "./globals.css";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { CookieConsent } from "@/components/cookie-consent";

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

// Brand wordmark — geometric, bold (Manrope). Used only for the "OhoTool" logo.
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

import { SITE_URL as siteUrl } from "@/lib/site";
import { TOOL_COUNT_LABEL } from "@/modules/tools/registry";

// Google Analytics 4 — injected only on the production deployment so local dev
// and Vercel preview traffic don't pollute the analytics property.
const GA_ID = "G-V5RLQLB88Y";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "OhoTool — Free Online Tools for PDF, Images, Text & More",
    template: "%s · OhoTool",
  },
  description: `${TOOL_COUNT_LABEL} free online tools that run in your browser: convert PDF & Word, compress images, OCR, format code, and make QR codes. No sign-up, nothing uploaded.`,
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
  // Google AdSense site verification/association (renders a <meta> in <head>).
  other: { "google-adsense-account": "ca-pub-9457374000076613" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "OhoTool",
    title: "OhoTool — Free Online Tools for PDF, Images, Text & More",
    description: `${TOOL_COUNT_LABEL} fast, private, browser-based tools: PDF & document converters, image tools, text utilities, calculators, developer tools, and QR codes. Free — no sign-up, nothing uploaded.`,
  },
  twitter: {
    card: "summary_large_image",
    title: "OhoTool — Free Online Tools for PDF, Images, Text & More",
    description: `${TOOL_COUNT_LABEL} fast, private, browser-based tools: PDF & document converters, image tools, text utilities, calculators, and developer tools. Free, no sign-up.`,
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
      className={`${inter.variable} ${spaceGrotesk.variable} ${geistMono.variable} ${manrope.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col"
      >
        {/* Google Consent Mode v2 — runs before AdSense/GA so ad & analytics
           cookies are gated by the user's choice. Default: denied in the
           EEA/UK/CH until the visitor accepts (see the cookie banner), granted
           elsewhere. A stored choice (oho_consent cookie) is honored on load. */}
        <Script id="consent-mode" strategy="beforeInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
var EEA=["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE","IS","LI","NO","GB","CH"];
var G={ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'};
var D={ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'};
var m=document.cookie.match(/(?:^|;\\s*)oho_consent=(granted|denied)/);
if(m&&m[1]==='granted'){gtag('consent','default',G);}
else if(m&&m[1]==='denied'){gtag('consent','default',D);}
else{gtag('consent','default',Object.assign({},D,{region:EEA,wait_for_update:500}));gtag('consent','default',G);}
gtag('set','ads_data_redaction',true);gtag('set','url_passthrough',true);`}
        </Script>

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <CookieConsent />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        {process.env.VERCEL_ENV === "production" && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
            </Script>
            {/* Google AdSense loader — server-rendered into <head> so the code
               snippet is a real tag (verification + reliable ad serving). Ad-free
               for Pro is enforced at the ad-unit level; keep Auto Ads OFF. */}
            <Script
              id="adsense"
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9457374000076613"
              crossOrigin="anonymous"
              strategy="beforeInteractive"
            />
          </>
        )}
      </body>
    </html>
  );
}
