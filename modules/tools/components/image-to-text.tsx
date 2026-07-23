"use client";

import * as React from "react";
import Link from "next/link";
import { UploadIcon, Loader2Icon, SparklesIcon } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/copy-button";
import { useSession } from "@/lib/auth-client";
import { isPro } from "@/lib/plans";

export function ImageToText() {
  const { data } = useSession();
  const loggedIn = !!data?.user;
  const pro = isPro((data?.user as { plan?: string } | undefined)?.plan ?? "FREE");

  const [file, setFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [text, setText] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function onFile(f: File | undefined) {
    setError(null);
    setText("");
    if (!f) return;
    setFile(f);
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(f);
    });
  }

  async function recognize() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setText("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("op", "image-to-text");
      const res = await fetch("/api/convert/office", { method: "POST", body: fd });
      const j = (await res.json().catch(() => ({}))) as { text?: string; error?: string };
      if (!res.ok) {
        setError(j.error || "Recognition failed.");
        setBusy(false);
        return;
      }
      setText(j.text || "");
      if (!j.text) setError("No text was found in that image.");
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
              <>Text recognition (OCR) is a <span className="font-medium text-foreground">Pro</span> feature.</>
            ) : (
              <>Sign up and go <span className="font-medium text-foreground">Pro</span> to extract text from images.</>
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
        <span className="text-sm font-medium">Choose an image</span>
        <span className="text-xs text-muted-foreground">JPG, PNG, or a photo/scan of a document — up to 15 MB.</span>
        <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      </label>

      {preview && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={preview} alt="Selected" className="max-h-48 w-fit max-w-full rounded-lg border border-border" />
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {pro ? (
        <Button className="w-fit" onClick={recognize} disabled={busy || !file}>
          {busy ? <Loader2Icon className="animate-spin" /> : null}
          Extract text
        </Button>
      ) : (
        <Button className="w-fit" render={<Link href={loggedIn ? "/pricing" : "/signup"} />}>
          {loggedIn ? "Upgrade to extract" : "Sign up to extract"}
        </Button>
      )}

      {text && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="itt-out">Recognized text</Label>
            <CopyButton value={text} label="" />
          </div>
          <Textarea id="itt-out" readOnly value={text} className="min-h-48 text-sm" />
        </div>
      )}
    </div>
  );
}
