"use client";

import * as React from "react";
import Link from "next/link";
import { DownloadIcon, Loader2Icon, SparklesIcon, CheckCircle2Icon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { isPro } from "@/lib/plans";

export function UrlToPdf() {
  const { data } = useSession();
  const loggedIn = !!data?.user;
  const pro = isPro((data?.user as { plan?: string } | undefined)?.plan ?? "FREE");

  const [url, setUrl] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [done, setDone] = React.useState(false);

  async function convert() {
    const value = url.trim();
    if (!/^https?:\/\/.+/i.test(value)) {
      setError("Enter a valid URL starting with http:// or https://");
      return;
    }
    setBusy(true);
    setError(null);
    setDone(false);
    try {
      const fd = new FormData();
      fd.append("op", "url-to-pdf");
      fd.append("url", value);
      const res = await fetch("/api/convert/office", { method: "POST", body: fd });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        setError(j.error || "Conversion failed.");
        setBusy(false);
        return;
      }
      const blob = await res.blob();
      const href = URL.createObjectURL(blob);
      let name = "webpage";
      try {
        name = new URL(value).hostname.replace(/^www\./, "") || "webpage";
      } catch {
        /* keep default */
      }
      const a = document.createElement("a");
      a.href = href;
      a.download = `${name}.pdf`;
      a.click();
      URL.revokeObjectURL(href);
      setDone(true);
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-4">
      {!pro && (
        <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-3 text-sm">
          <SparklesIcon className="size-4 shrink-0 text-primary" />
          <span className="flex-1 text-muted-foreground">
            {loggedIn ? (
              <>URL to PDF is a <span className="font-medium text-foreground">Pro</span> feature.</>
            ) : (
              <>Sign up and go <span className="font-medium text-foreground">Pro</span> to save web pages as PDF.</>
            )}
          </span>
          <Link
            href={loggedIn ? "/pricing" : "/signup"}
            className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90"
          >
            {loggedIn ? "Go Pro" : "Sign up"}
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="u2p">Web page URL</Label>
        <Input
          id="u2p"
          type="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError(null);
            setDone(false);
          }}
          placeholder="https://example.com/article"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {done && (
        <p className="flex items-center gap-1.5 text-sm text-emerald-500">
          <CheckCircle2Icon className="size-4" /> PDF ready — check your downloads.
        </p>
      )}

      {pro ? (
        <Button className="w-fit" onClick={convert} disabled={busy || !url.trim()}>
          {busy ? <Loader2Icon className="animate-spin" /> : <DownloadIcon />}
          Convert to PDF
        </Button>
      ) : (
        <Button className="w-fit" render={<Link href={loggedIn ? "/pricing" : "/signup"} />}>
          {loggedIn ? "Upgrade to convert" : "Sign up to convert"}
        </Button>
      )}
    </div>
  );
}
