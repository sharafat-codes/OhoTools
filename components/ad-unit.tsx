"use client";

import * as React from "react";

import { useSession } from "@/components/plan-provider";
import { isPro } from "@/lib/plans";

const CLIENT = "ca-pub-9457374000076613";
const DEFAULT_SLOT = "1372834528"; // "OhoTool Display" — responsive display unit

// Master switch for Google AdSense. The site is still under review (rejected for
// "Low value content"; the thin-page fix shipped in 9e7f901). Flip to true only
// once AdSense → Sites shows "Ready", then redeploy.
const ADSENSE_ENABLED = false;

// Adsterra Native Banner — the interim network while AdSense is under review.
// Configured from env so the unit can be re-pointed or switched off in Vercel
// without a code change. BOTH must be set or nothing renders:
//   NEXT_PUBLIC_ADSTERRA_SRC        e.g. //pl27012345.effectiveratecpm.com/<hash>/invoke.js
//   NEXT_PUBLIC_ADSTERRA_CONTAINER  e.g. container-<hash>
// Only the "Native Banner" format is wired up on purpose. Popunder and Social
// Bar are prohibited alongside AdSense and break tool-page UX — do not add them.
const ADSTERRA_SRC = process.env.NEXT_PUBLIC_ADSTERRA_SRC || "";
const ADSTERRA_CONTAINER = process.env.NEXT_PUBLIC_ADSTERRA_CONTAINER || "";

const LABEL = "mb-1 block text-[10px] uppercase tracking-wider text-muted-foreground/60";

/**
 * Reads the cookie-banner choice and re-reads it when the banner dispatches
 * `oho:consent-change`, so accepting shows ads without a reload.
 *
 * Starts `false` on both server and first client render, which keeps hydration
 * stable — the ad appears on a later render, never during hydration.
 */
function useAdConsent(): boolean {
  const [granted, setGranted] = React.useState(false);

  React.useEffect(() => {
    const read = () => setGranted(/(?:^|;\s*)oho_consent=granted/.test(document.cookie));
    read();
    window.addEventListener("oho:consent-change", read);
    return () => window.removeEventListener("oho:consent-change", read);
  }, []);

  return granted;
}

/** Google AdSense display slot. Consent is handled by Consent Mode v2 in layout. */
function AdSenseSlot({ slot, className }: { slot: string; className: string }) {
  const pushed = React.useRef(false);

  React.useEffect(() => {
    if (pushed.current) return;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      w.adsbygoogle = w.adsbygoogle || [];
      w.adsbygoogle.push({});
      pushed.current = true;
    } catch {
      /* adsbygoogle not ready — the loader may still be initializing */
    }
  }, []);

  return (
    <div className={"my-8 overflow-hidden text-center " + className}>
      <span className={LABEL}>Advertisement</span>
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client={CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

/**
 * Adsterra Native Banner.
 *
 * Adsterra is NOT covered by Google Consent Mode, so its script is injected only
 * after an explicit accept. That is stricter than the AdSense path (which Consent
 * Mode gates by region) and costs some fill from visitors who ignore the banner,
 * but it is the only GDPR-safe way to load a third-party ad script client-side —
 * the browser cannot know the visitor's region, and these pages are statically
 * rendered, so the server cannot tell us without making every tool page dynamic.
 */
function AdsterraNative({ className }: { className: string }) {
  const consented = useAdConsent();
  const hostRef = React.useRef<HTMLDivElement | null>(null);
  const injected = React.useRef(false);

  React.useEffect(() => {
    const host = hostRef.current;
    if (!consented || injected.current || !host) return;
    injected.current = true;

    const src = /^(https?:)?\/\//.test(ADSTERRA_SRC) ? ADSTERRA_SRC : `//${ADSTERRA_SRC}`;
    const s = document.createElement("script");
    s.async = true;
    s.setAttribute("data-cfasync", "false");
    s.src = src;
    // Adsterra's snippet puts the <script> immediately before its container div;
    // invoke.js resolves the container by id, so keep that ordering.
    host.insertBefore(s, host.lastChild);
  }, [consented]);

  if (!consented) return null;

  return (
    <div ref={hostRef} className={"my-8 overflow-hidden " + className}>
      <span className={LABEL}>Advertisement</span>
      <div id={ADSTERRA_CONTAINER} />
    </div>
  );
}

/**
 * Ad slot for content pages. Renders only in production and only for non-Pro
 * users (Pro is ad-free). Serves AdSense when it is approved and enabled,
 * otherwise the Adsterra Native Banner when it is configured.
 */
export function AdUnit({ slot = DEFAULT_SLOT, className = "" }: { slot?: string; className?: string }) {
  const { data } = useSession();
  const pro = isPro(((data?.user as { plan?: string } | null)?.plan) ?? "FREE");

  if (pro || process.env.NODE_ENV !== "production") return null;
  if (ADSENSE_ENABLED) return <AdSenseSlot slot={slot} className={className} />;
  if (ADSTERRA_SRC && ADSTERRA_CONTAINER) return <AdsterraNative className={className} />;
  return null;
}
