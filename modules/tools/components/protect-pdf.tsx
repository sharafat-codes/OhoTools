"use client";

import * as React from "react";
import { toast } from "sonner";
import { LoaderCircleIcon, ShieldCheckIcon } from "lucide-react";

import { Dropzone } from "@/modules/tools/components/dropzone";
import { encryptPdf } from "@/modules/tools/components/qpdf-lib";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ProtectPdf() {
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

  async function protect() {
    if (!file || !pw) return;
    setBusy(true);
    setError(null);
    setDone(false);
    try {
      const blob = await encryptPdf(file, pw);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${file.name.replace(/\.pdf$/i, "") || "document"}-protected.pdf`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setDone(true);
      toast.success("Protected PDF downloaded");
    } catch {
      setError("Couldn't protect this PDF. Make sure it's a valid PDF that isn't already password-protected.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Dropzone
        accept="application/pdf,.pdf"
        onFile={onFile}
        title="Drag & drop a PDF, or click to browse"
        hint="Add a password so only people who have it can open the PDF."
      />

      {file && (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">Selected: {file.name}</p>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pp-pw">Password</Label>
            <Input
              id="pp-pw"
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Password to open the PDF"
              autoComplete="new-password"
              className="w-full sm:w-80"
            />
          </div>
          <Button onClick={protect} disabled={busy || !pw} className="w-fit">
            {busy ? <LoaderCircleIcon className="animate-spin" /> : <ShieldCheckIcon />}
            {busy ? "Protecting…" : "Protect PDF"}
          </Button>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
      {done && <p className="text-sm text-emerald-500">Done — your password-protected PDF has been downloaded.</p>}
      <p className="text-xs text-muted-foreground">
        AES-256 encryption, applied entirely in your browser — your PDF is never uploaded.
      </p>
    </div>
  );
}
