"use client";

import * as React from "react";
import { toast } from "sonner";
import { FileKey2Icon, LoaderCircleIcon } from "lucide-react";

import { Dropzone } from "@/modules/tools/components/dropzone";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function UnlockPdf() {
  const [file, setFile] = React.useState<File | null>(null);
  const [pw, setPw] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [done, setDone] = React.useState(false);

  function onFile(f: File | undefined) {
    if (!f) return;
    if (f.type !== "application/pdf" && !/\.pdf$/i.test(f.name)) {
      setError("Please choose a PDF file.");
      return;
    }
    setError(null);
    setDone(false);
    setFile(f);
  }

  async function unlock() {
    if (!file || !pw) return;
    setBusy(true);
    setError(null);
    setDone(false);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("password", pw);
      const res = await fetch("/api/pdf/unlock", { method: "POST", body: fd });
      if (!res.ok) {
        const d = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(d.error || "Could not unlock the PDF.");
      }
      const url = URL.createObjectURL(await res.blob());
      const a = document.createElement("a");
      a.href = url;
      a.download = `${file.name.replace(/\.pdf$/i, "") || "document"}-unlocked.pdf`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setDone(true);
      toast.success("Unlocked PDF downloaded");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Dropzone
        accept="application/pdf,.pdf"
        onFile={onFile}
        title="Drag & drop a password-protected PDF, or click to browse"
        hint="Enter the current password to remove it and download an unlocked copy."
      />

      {file && (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">Selected: {file.name}</p>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="up-pw">Current password</Label>
            <Input
              id="up-pw"
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="The PDF's current password"
              autoComplete="off"
              className="w-full sm:w-80"
            />
          </div>
          <Button onClick={unlock} disabled={busy || !pw} className="w-fit">
            {busy ? <LoaderCircleIcon className="animate-spin" /> : <FileKey2Icon />}
            {busy ? "Unlocking…" : "Unlock PDF"}
          </Button>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
      {done && <p className="text-sm text-emerald-500">Done — your unlocked PDF has been downloaded.</p>}
      <p className="text-xs text-muted-foreground">
        Only unlock PDFs you own or have permission to. Your PDF is processed on our secure server and deleted right
        after — never stored.
      </p>
    </div>
  );
}
