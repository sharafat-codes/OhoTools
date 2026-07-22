"use client";

import * as React from "react";
import Link from "next/link";
import { SparklesIcon, XIcon } from "lucide-react";

import { useSession } from "@/lib/auth-client";
import { isPro } from "@/lib/plans";

const KEY = "oho-pro-nudge-dismissed";

/**
 * A quiet, dismissible upsell shown below a tool — only to visitors who
 * aren't already Pro. Purely client-side so tool pages stay static/fast.
 * Never blocks the tool; dismissal is remembered so it doesn't nag.
 */
export function ProNudge() {
  const { data, isPending } = useSession();
  const [ui, setUi] = React.useState({ ready: false, dismissed: false });

  React.useEffect(() => {
    let ok = true;
    const dismissed = localStorage.getItem(KEY) === "1";
    Promise.resolve().then(() => {
      if (ok) setUi({ ready: true, dismissed });
    });
    return () => {
      ok = false;
    };
  }, []);

  const plan = (data?.user as { plan?: string } | undefined)?.plan ?? "FREE";

  if (!ui.ready || isPending || ui.dismissed || isPro(plan)) return null;

  return (
    <div className="mt-12 flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-4">
      <SparklesIcon className="size-5 shrink-0 text-primary" />
      <p className="flex-1 text-sm">
        <span className="font-medium">Every tool here is free.</span>{" "}
        <span className="text-muted-foreground">
          Go Pro to brand dynamic QR codes, track scans, generate in bulk, and use the API.
        </span>
      </p>
      <Link
        href="/pricing"
        className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        See Pro
      </Link>
      <button
        type="button"
        onClick={() => {
          localStorage.setItem(KEY, "1");
          setUi((u) => ({ ...u, dismissed: true }));
        }}
        aria-label="Dismiss"
        className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
      >
        <XIcon className="size-4" />
      </button>
    </div>
  );
}
