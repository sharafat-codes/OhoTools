"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2Icon, SparklesIcon, WandSparklesIcon } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/copy-button";
import { useSession } from "@/lib/auth-client";
import { isPro } from "@/lib/plans";

export type AiControl = {
  key: string;
  label: string;
  default: string;
  options: { label: string; value: string }[];
};

const MAX_CHARS = 20_000;

export function AiTextTool({
  task,
  actionLabel,
  inputPlaceholder,
  outputLabel = "Result",
  controls = [],
}: {
  task: string;
  actionLabel: string;
  inputPlaceholder: string;
  outputLabel?: string;
  controls?: AiControl[];
}) {
  const { data } = useSession();
  const loggedIn = !!data?.user;
  const pro = isPro((data?.user as { plan?: string } | undefined)?.plan ?? "FREE");

  const [text, setText] = React.useState("");
  const [opts, setOpts] = React.useState<Record<string, string>>(() =>
    Object.fromEntries(controls.map((c) => [c.key, c.default])),
  );
  const [result, setResult] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const tooLong = text.length > MAX_CHARS;

  async function run() {
    if (!text.trim() || tooLong) return;
    setBusy(true);
    setError(null);
    setResult("");
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ task, text, options: opts }),
      });
      const j = (await res.json().catch(() => ({}))) as { result?: string; error?: string };
      if (!res.ok) {
        setError(j.error || "Something went wrong. Please try again.");
      } else {
        setResult(j.result || "");
      }
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
              <>AI tools are a <span className="font-medium text-foreground">Pro</span> feature.</>
            ) : (
              <>Sign up and go <span className="font-medium text-foreground">Pro</span> to use AI tools.</>
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
        <div className="flex items-center justify-between">
          <Label htmlFor="ai-in">Your text</Label>
          <span className={`text-xs ${tooLong ? "text-destructive" : "text-muted-foreground"}`}>
            {text.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
          </span>
        </div>
        <Textarea
          id="ai-in"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={inputPlaceholder}
          className="min-h-40 text-sm"
        />
      </div>

      {controls.length > 0 && (
        <div className="flex flex-wrap items-end gap-4">
          {controls.map((c) => (
            <div key={c.key} className="flex flex-col gap-1.5">
              <Label htmlFor={`ai-${c.key}`} className="text-sm">{c.label}</Label>
              <select
                id={`ai-${c.key}`}
                value={opts[c.key]}
                onChange={(e) => setOpts((p) => ({ ...p, [c.key]: e.target.value }))}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                {c.options.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {pro ? (
        <Button className="w-fit" onClick={run} disabled={busy || !text.trim() || tooLong}>
          {busy ? <Loader2Icon className="animate-spin" /> : <WandSparklesIcon className="size-4" />}
          {actionLabel}
        </Button>
      ) : (
        <Button className="w-fit" render={<Link href={loggedIn ? "/pricing" : "/signup"} />}>
          {loggedIn ? `Upgrade to use ${actionLabel}` : "Sign up to use AI tools"}
        </Button>
      )}

      {result && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="ai-out">{outputLabel}</Label>
            <CopyButton value={result} label="" />
          </div>
          <Textarea id="ai-out" readOnly value={result} className="min-h-40 text-sm" />
        </div>
      )}
    </div>
  );
}
