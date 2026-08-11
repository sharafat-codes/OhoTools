"use client";

import Script from "next/script";

import { useSession } from "@/lib/auth-client";
import { isPro } from "@/lib/plans";

const CLIENT = "ca-pub-9457374000076613";

/**
 * Loads the Google AdSense library — but NOT for Pro users (ad-free is a Pro
 * perk). Logged-out visitors and Googlebot are treated as free, so the script
 * is present for AdSense verification/review and for serving ads to free users.
 * Rendered only in production (see app/layout.tsx).
 */
export function AdSense() {
  const { data } = useSession();
  const pro = isPro((data?.user as { plan?: string } | undefined)?.plan ?? "FREE");
  if (pro) return null;

  return (
    <Script
      id="adsense"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
