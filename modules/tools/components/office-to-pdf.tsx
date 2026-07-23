"use client";

import * as React from "react";
import Link from "next/link";
import { UploadIcon, DownloadIcon, Loader2Icon, SparklesIcon, CheckCircle2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { isPro } from "@/lib/plans";

const ACCEPT = ".doc,.docx,.ppt,.pptx,.xls,.xlsx,.odt,.ods,.odp,.rtf";

export function OfficeToPdf() {
  const { data } = useSession();
  const loggedIn = !!data?.user;
  const pro = isPro((data?.user as { plan?: string } | undefined)?.plan ?? "FREE");

  const [file, setFile] = React.useState<File | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [done, setDone] = React.useState(false);

  async function convert() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setDone(false);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/convert/office", { method: "POST", body: fd });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        setError(j.error || "Conversion failed.");
        setBusy(false);
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${file.name.replace(/\.[^.]+$/, "") || "document"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
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
              <>Office to PDF is a <span className="font-medium text-foreground">Pro</span> feature.</>
            ) : (
              <>Sign up and go <span className="font-medium text-foreground">Pro</span> to convert Office files.</>
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

      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-10 text-center transition-colors hover:bg-muted/50">
        <UploadIcon className="size-6 text-muted-foreground" />
        <span className="text-sm font-medium">Choose a document</span>
        <span className="text-xs text-muted-foreground">Word, PowerPoint, or Excel (.docx, .pptx, .xlsx, and more) — up to 15 MB.</span>
        <input
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => {
            setFile(e.target.files?.[0] ?? null);
            setError(null);
            setDone(false);
          }}
        />
      </label>

      {file && <p className="text-sm text-muted-foreground">Selected: {file.name}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {done && (
        <p className="flex items-center gap-1.5 text-sm text-emerald-500">
          <CheckCircle2Icon className="size-4" /> Converted — check your downloads.
        </p>
      )}

      {pro ? (
        <Button className="w-fit" onClick={convert} disabled={busy || !file}>
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
