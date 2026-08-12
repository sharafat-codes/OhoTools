"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2Icon, SparklesIcon } from "lucide-react";

import { Dropzone } from "@/modules/tools/components/dropzone";
import { FileResult, formatBytes } from "@/modules/tools/components/tool-result";

import { Button } from "@/components/ui/button";
import { useSession } from "@/components/plan-provider";
import { isPro } from "@/lib/plans";
import { CloudImport } from "@/modules/cloud/cloud-import";

type Result = { url: string; name: string; size: number };

export function DocConvert({
  op,
  accept,
  inLabel,
  outExt,
  actionLabel,
  hint,
}: {
  op: string;
  accept: string;
  inLabel: string;
  outExt: string;
  actionLabel: string;
  hint: string;
}) {
  const { data } = useSession();
  const loggedIn = !!data?.user;
  const pro = isPro((data?.user as { plan?: string } | undefined)?.plan ?? "FREE");

  const [file, setFile] = React.useState<File | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<Result | null>(null);

  function clearResult() {
    setResult((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return null;
    });
  }

  function pick(f: File) {
    setFile(f);
    setError(null);
    clearResult();
  }

  async function convert() {
    if (!file) return;
    setBusy(true);
    setError(null);
    clearResult();
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("op", op);
      const res = await fetch("/api/convert/office", { method: "POST", body: fd });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        setError(j.error || "Conversion failed.");
        setBusy(false);
        return;
      }
      const blob = await res.blob();
      const name = `${file.name.replace(/\.[^.]+$/, "") || "document"}.${outExt}`;
      setResult({ url: URL.createObjectURL(blob), name, size: blob.size });
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
              <>This conversion is a <span className="font-medium text-foreground">Pro</span> feature.</>
            ) : (
              <>Sign up and go <span className="font-medium text-foreground">Pro</span> to use this converter.</>
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

      <Dropzone
        accept={accept}
        onFile={pick}
        title={`Drag & drop a ${inLabel}, or click to browse`}
        hint={hint}
      />

      <CloudImport accept={accept} onFile={pick} onError={setError} />

      {file && <p className="text-sm text-muted-foreground">Selected: {file.name}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {pro ? (
        <Button className="w-fit" onClick={convert} disabled={busy || !file}>
          {busy ? <Loader2Icon className="animate-spin" /> : null}
          {actionLabel}
        </Button>
      ) : (
        <Button className="w-fit" render={<Link href={loggedIn ? "/pricing" : "/signup"} />}>
          {loggedIn ? "Upgrade to convert" : "Sign up to convert"}
        </Button>
      )}

      {result && <FileResult href={result.url} filename={result.name} meta={formatBytes(result.size)} />}
    </div>
  );
}
