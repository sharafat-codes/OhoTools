"use client";

import * as React from "react";
import { EyeIcon, LoaderCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { IMPERSONATION_COOKIE } from "@/modules/admin/impersonation-cookie";
import { stopImpersonating } from "@/modules/admin/impersonation";

/**
 * Shown on every page while an admin is logged in as someone else.
 *
 * It reads a cookie in the browser rather than the session on the server on
 * purpose: the root layout is shared by every statically prerendered tool and
 * marketing page, and reading cookies there would make the whole site render
 * dynamically. The cookie holds only the label — see impersonation-cookie.ts.
 */
export function ImpersonationBanner() {
  const [who, setWho] = React.useState<string | null>(null);
  const [leaving, setLeaving] = React.useState(false);

  React.useEffect(() => {
    const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${IMPERSONATION_COOKIE}=([^;]*)`));
    if (!match) return;
    let label = "another user";
    try {
      label = decodeURIComponent(match[1]) || label;
    } catch {
      /* a mangled label is not worth hiding the way out over */
    }
    setWho(label);
  }, []);

  if (!who) return null;

  async function stop() {
    setLeaving(true);
    try {
      const res = await stopImpersonating();
      // A full load, not a router push — the session cookie changed underneath
      // every server component.
      window.location.assign(res.ok ? "/admin/users" : "/login");
    } catch {
      setLeaving(false);
    }
  }

  return (
    <div
      role="region"
      aria-label="Impersonation"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-amber-500/40 bg-amber-500/95 text-amber-950 shadow-lg"
    >
      {/* Stacks on a phone: the name is the point of the banner, so it must not
         be the part that gets truncated to make room for the button. */}
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-4 py-2 sm:flex-row sm:items-center sm:gap-3">
        <p className="flex min-w-0 flex-1 items-center gap-2 text-sm font-medium">
          <EyeIcon className="size-4 shrink-0" />
          {/* An email is one unbroken token; without this it overflows the bar
             on a narrow phone instead of wrapping. */}
          <span className="min-w-0 [overflow-wrap:anywhere]">
            You are logged in as <span className="font-semibold">{who}</span>.
            <span className="hidden sm:inline"> Anything you do here is done as them.</span>
          </span>
        </p>
        <Button
          size="sm"
          variant="outline"
          onClick={stop}
          disabled={leaving}
          className="shrink-0 self-end border-amber-950/30 bg-amber-50 text-amber-950 hover:bg-white sm:self-auto"
        >
          {leaving && <LoaderCircleIcon className="animate-spin" />}
          Back to my account
        </Button>
      </div>
    </div>
  );
}
