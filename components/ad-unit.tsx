"use client";

import * as React from "react";

import { useSession } from "@/components/plan-provider";
import { isPro } from "@/lib/plans";

const CLIENT = "ca-pub-9457374000076613";
const DEFAULT_SLOT = "1372834528"; // "OhoTool Display" — responsive display unit

/**
 * Google AdSense display slot. Renders only in production and only for non-Pro
 * users (Pro is ad-free). The AdSense loader script lives in app/layout.tsx and
 * is itself production-only; consent is handled by Consent Mode (cookie banner).
 */
export function AdUnit({ slot = DEFAULT_SLOT, className = "" }: { slot?: string; className?: string }) {
  const { data } = useSession();
  const pro = isPro(((data?.user as { plan?: string } | null)?.plan) ?? "FREE");
  const enabled = process.env.NODE_ENV === "production" && !pro;
  const pushed = React.useRef(false);

  React.useEffect(() => {
    if (!enabled || pushed.current) return;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      w.adsbygoogle = w.adsbygoogle || [];
      w.adsbygoogle.push({});
      pushed.current = true;
    } catch {
      /* adsbygoogle not ready — the loader may still be initializing */
    }
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className={"my-8 overflow-hidden text-center " + className}>
      <span className="mb-1 block text-[10px] uppercase tracking-wider text-muted-foreground/60">Advertisement</span>
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
