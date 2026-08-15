"use client";

import * as React from "react";
import Link from "next/link";

// Cookie consent banner wired to Google Consent Mode v2. The consent *default*
// (denied for EEA/UK/CH, granted elsewhere) is set by a beforeInteractive
// bootstrap in app/layout.tsx BEFORE AdSense/GA load; this banner records the
// user's choice and sends the corresponding `consent update` so ad/analytics
// cookies follow it. Essential sign-in cookies are unaffected.

const COOKIE = "oho_consent";
const MAX_AGE = 60 * 60 * 24 * 180; // 180 days

const GRANT = { ad_storage: "granted", ad_user_data: "granted", ad_personalization: "granted", analytics_storage: "granted" } as const;
const DENY = { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied" } as const;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function readChoice(): "granted" | "denied" | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|;\s*)oho_consent=(granted|denied)/);
  return (m?.[1] as "granted" | "denied") ?? null;
}

function apply(granted: boolean) {
  document.cookie = `${COOKIE}=${granted ? "granted" : "denied"}; path=/; max-age=${MAX_AGE}; SameSite=Lax`;
  window.gtag?.("consent", "update", granted ? GRANT : DENY);
}

export function CookieConsent() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!readChoice()) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener("oho:open-consent", reopen);
    return () => window.removeEventListener("oho:open-consent", reopen);
  }, []);

  if (!open) return null;

  function choose(granted: boolean) {
    apply(granted);
    setOpen(false);
  }

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 rounded-2xl border border-border bg-card/95 p-4 shadow-lg backdrop-blur-sm sm:flex-row sm:items-center sm:gap-4 sm:p-5">
        <p className="text-sm text-muted-foreground">
          We use cookies to keep you signed in and, on the free tier, to show ads (Google AdSense) and
          measure traffic. You can accept or reject non-essential cookies.{" "}
          <Link href="/privacy" className="font-medium text-foreground underline underline-offset-2 hover:text-primary">
            Learn more
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2 sm:ml-auto">
          <button
            type="button"
            onClick={() => choose(false)}
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => choose(true)}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

/** Footer link that reopens the consent banner so users can change their choice. */
export function CookiePreferencesButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("oho:open-consent"))}
      className={className}
    >
      Cookie settings
    </button>
  );
}
