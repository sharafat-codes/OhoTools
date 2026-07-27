"use client";

import * as React from "react";
import { createClient } from "@supabase/supabase-js";
import QRCode from "qrcode";
import { UploadIcon, Loader2Icon, LockIcon, RotateCcwIcon } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copy-button";
import {
  TRANSFER_BUCKET,
  FREE_MAX_BYTES,
  EXPIRY_OPTIONS,
} from "@/lib/transfer-shared";
import {
  generateKey,
  exportKey,
  encryptFile,
  randomSaltB64url,
  deriveVerifier,
  sha256B64url,
} from "@/lib/crypto-transfer";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function isConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

function humanSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function SendTool() {
  const [file, setFile] = React.useState<File | null>(null);
  const [hours, setHours] = React.useState(24);
  const [password, setPassword] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [status, setStatus] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [link, setLink] = React.useState<string | null>(null);
  const [qr, setQr] = React.useState<string | null>(null);
  const [expiresAt, setExpiresAt] = React.useState<string | null>(null);
  const [wasProtected, setWasProtected] = React.useState(false);

  function pick(f: File | undefined) {
    setError(null);
    setLink(null);
    if (!f) return;
    if (f.size > FREE_MAX_BYTES) {
      setError(`That file is ${humanSize(f.size)}. The current limit is ${Math.round(FREE_MAX_BYTES / 1024 / 1024)} MB.`);
      return;
    }
    setFile(f);
  }

  async function send() {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      setStatus("Encrypting…");
      const key = await generateKey();
      const enc = await encryptFile(file, key);

      setStatus("Preparing…");
      let passwordPayload: { hash: string; salt: string } | undefined;
      const pw = password.trim();
      if (pw) {
        const salt = randomSaltB64url();
        const verifier = await deriveVerifier(pw, salt);
        passwordPayload = { hash: await sha256B64url(verifier), salt };
      }

      const res = await fetch("/api/transfer", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          metaCipher: enc.metaCipher,
          metaIv: enc.metaIv,
          contentIv: enc.contentIv,
          size: enc.content.byteLength,
          expiresHours: hours,
          password: passwordPayload,
        }),
      });
      const j = (await res.json().catch(() => ({}))) as {
        id?: string;
        path?: string;
        token?: string;
        expiresAt?: string;
        error?: string;
      };
      if (!res.ok || !j.id || !j.path || !j.token) {
        setError(j.error || "Could not create the link. Try again.");
        setBusy(false);
        setStatus("");
        return;
      }

      setStatus("Uploading…");
      const sb = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
      const { error: upErr } = await sb.storage
        .from(TRANSFER_BUCKET)
        .uploadToSignedUrl(j.path, j.token, new Blob([enc.content]), {
          contentType: "application/octet-stream",
        });
      if (upErr) {
        setError("Upload failed. Please try again.");
        setBusy(false);
        setStatus("");
        return;
      }

      const keyStr = await exportKey(key);
      const shareLink = `${window.location.origin}/f/${j.id}#${keyStr}`;
      setLink(shareLink);
      setWasProtected(Boolean(passwordPayload));
      setExpiresAt(j.expiresAt ?? null);
      setQr(
        await QRCode.toDataURL(shareLink, { margin: 1, width: 320, color: { dark: "#0a0a0a", light: "#ffffff" } }),
      );
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setStatus("");
    setBusy(false);
  }

  function reset() {
    setFile(null);
    setLink(null);
    setQr(null);
    setError(null);
    setExpiresAt(null);
    setPassword("");
    setWasProtected(false);
  }

  if (!isConfigured()) {
    return (
      <div className="rounded-xl border border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
        File sending isn&apos;t enabled yet. Please check back soon.
      </div>
    );
  }

  // Result view
  if (link) {
    return (
      <div className="flex flex-col gap-5">
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
            <LockIcon className="size-4 text-primary" /> Your encrypted link is ready
          </div>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={link}
              className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
              onFocus={(e) => e.currentTarget.select()}
            />
            <CopyButton value={link} label="Copy" />
          </div>
          <div className="flex justify-between">
            {expiresAt && (
              <p className="mt-2 text-xs text-muted-foreground">
                Auto-deletes on {new Date(expiresAt).toLocaleString()}.{" "}
                {wasProtected
                  ? "Password-protected — share the password with the recipient separately (not in the same message as the link)."
                  : "The decryption key is in the link — anyone with it can open the file."}
              </p>
            )}

            {qr && (
              <div className="flex flex-col items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qr} alt="QR code for the download link" className="size-44 rounded-lg border border-border" />
                <p className="text-xs text-muted-foreground">Scan to open on your phone</p>
              </div>
            )}
          </div>
        </div>


        <Button variant="outline" className="w-fit" onClick={reset}>
          <RotateCcwIcon className="size-4" /> Send another file
        </Button>
      </div>
    );
  }

  // Upload view
  return (
    <div className="flex flex-col gap-4">
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-10 text-center transition-colors hover:bg-muted/50">
        <UploadIcon className="size-6 text-muted-foreground" />
        <span className="text-sm font-medium">{file ? file.name : "Choose a file to send"}</span>
        <span className="text-xs text-muted-foreground">
          {file ? humanSize(file.size) : `Any file up to ${Math.round(FREE_MAX_BYTES / 1024 / 1024)} MB · encrypted in your browser`}
        </span>
        <input type="file" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <Label htmlFor="expiry" className="text-sm">Auto-delete after</Label>
        <select
          id="expiry"
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          {EXPIRY_OPTIONS.map((o) => (
            <option key={o.hours} value={o.hours}>{o.label}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="pw" className="text-sm">Password <span className="text-muted-foreground">(optional)</span></Label>
        <input
          id="pw"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Require a password to download"
          autoComplete="new-password"
          className="w-full max-w-xs rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-center gap-3">
        <Button className="w-fit" onClick={send} disabled={busy || !file}>
          {busy ? <Loader2Icon className="animate-spin" /> : <LockIcon className="size-4" />}
          Create secure link
        </Button>
        {busy && <span className="text-sm text-muted-foreground">{status}</span>}
      </div>

      <p className="text-xs text-muted-foreground">
        Your file is encrypted in your browser before upload. The decryption key stays in the link and is never sent to our servers — we can&apos;t read your file.
      </p>
    </div>
  );
}
