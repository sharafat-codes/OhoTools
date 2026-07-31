"use client";

import * as React from "react";
import { toast } from "sonner";
import { CopyIcon, DownloadIcon } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function byteLen(s: string) {
  return new Blob([s]).size;
}
function fmtBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

/**
 * Reusable "paste code → cleaned code + savings" UI for the minify/optimize
 * tools. `transform` runs (debounced) as the user types; it may be sync or async
 * and should reject/throw with a helpful message on invalid input.
 */
export function MinifyTool({
  inputLabel,
  placeholder,
  downloadName,
  sample,
  transform,
}: {
  inputLabel: string;
  placeholder: string;
  downloadName: string;
  sample?: string;
  transform: (input: string) => string | Promise<string>;
}) {
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    const id = setTimeout(async () => {
      if (!input.trim()) {
        setOutput("");
        setError(null);
        return;
      }
      setBusy(true);
      try {
        const result = await transform(input);
        if (!cancelled) {
          setOutput(result);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setOutput("");
          setError((e as Error).message || "Could not process the input.");
        }
      } finally {
        if (!cancelled) setBusy(false);
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [input, transform]);

  const inSize = byteLen(input);
  const outSize = byteLen(output);
  const saved = inSize > 0 && outSize > 0 ? Math.round((1 - outSize / inSize) * 100) : 0;

  function copy() {
    navigator.clipboard?.writeText(output).then(
      () => toast.success("Copied to clipboard"),
      () => toast.error("Could not copy."),
    );
  }
  function download() {
    const url = URL.createObjectURL(new Blob([output], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = downloadName;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="min-in">{inputLabel}</Label>
          {sample && (
            <button
              type="button"
              onClick={() => setInput(sample)}
              className="text-xs font-medium text-primary hover:underline"
            >
              Paste sample
            </button>
          )}
        </div>
        <textarea
          id="min-in"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
          rows={8}
          placeholder={placeholder}
          className="w-full resize-y rounded-lg border border-input bg-transparent p-3 font-mono text-xs leading-relaxed outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {output && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-muted-foreground">
              {fmtBytes(inSize)} → {fmtBytes(outSize)}
              {saved > 0 && <span className="text-emerald-500"> (−{saved}%)</span>}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copy}>
                <CopyIcon className="size-3.5" />
                Copy
              </Button>
              <Button size="sm" onClick={download}>
                <DownloadIcon className="size-3.5" />
                Download
              </Button>
            </div>
          </div>
          <textarea
            readOnly
            value={output}
            rows={6}
            aria-busy={busy}
            className="w-full resize-y rounded-lg border border-border bg-muted/30 p-3 font-mono text-xs leading-relaxed outline-none"
          />
        </div>
      )}
    </div>
  );
}
