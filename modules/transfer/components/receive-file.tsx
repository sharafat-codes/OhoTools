"use client";

import * as React from "react";
import {
  DownloadIcon,
  Loader2Icon,
  LockIcon,
  FileIcon,
  TriangleAlertIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { importKey, decryptMeta, decryptContent, deriveVerifier } from "@/lib/crypto-transfer";

type Meta = {
  metaCipher: string;
  metaIv: string;
  contentIv: string;
  size: number;
  expiresAt: string;
  protected?: boolean;
  passwordSalt?: string;
  downloadUrl?: string;
};

function humanSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function ReceiveFile({ id }: { id: string }) {
  const [phase, setPhase] = React.useState<"loading" | "locked" | "ready" | "error">("loading");
  const [error, setError] = React.useState("");
  const [name, setName] = React.useState("");
  const [type, setType] = React.useState("");
  const [size, setSize] = React.useState(0);
  const [expiresAt, setExpiresAt] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [pwError, setPwError] = React.useState("");

  const metaRef = React.useRef<Meta | null>(null);
  const keyRef = React.useRef<CryptoKey | null>(null);
  const saltRef = React.useRef<string>("");

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const keyStr = window.location.hash.slice(1);
        if (!keyStr) {
          if (alive) { setError("This link is missing its decryption key."); setPhase("error"); }
          return;
        }
        const res = await fetch(`/api/transfer/${id}`);
        const j = await res.json().catch(() => ({}));
        if (!res.ok) {
          if (alive) { setError(j.error || "This link is invalid or has expired."); setPhase("error"); }
          return;
        }
        const m = j as Meta;
        const key = await importKey(keyStr);
        const info = await decryptMeta(key, m.metaCipher, m.metaIv);
        if (!alive) return;
        metaRef.current = m;
        keyRef.current = key;
        saltRef.current = m.passwordSalt ?? "";
        setName(info.name);
        setType(info.type);
        setSize(m.size);
        setExpiresAt(m.expiresAt);
        setPhase(m.protected ? "locked" : "ready");
      } catch {
        if (alive) { setError("This file couldn't be decrypted — the link may be incomplete."); setPhase("error"); }
      }
    })();
    return () => { alive = false; };
  }, [id]);

  async function unlock() {
    if (!password.trim()) return;
    setBusy(true);
    setPwError("");
    try {
      const verifier = await deriveVerifier(password.trim(), saltRef.current);
      const res = await fetch(`/api/transfer/${id}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ verifier }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok || !j.downloadUrl) {
        setPwError(res.status === 401 ? "Incorrect password. Try again." : j.error || "Could not unlock. Try again.");
        setBusy(false);
        return;
      }
      if (metaRef.current) metaRef.current.downloadUrl = j.downloadUrl as string;
      setPhase("ready");
    } catch {
      setPwError("Something went wrong. Try again.");
    }
    setBusy(false);
  }

  async function download() {
    const m = metaRef.current;
    const key = keyRef.current;
    if (!m || !key || !m.downloadUrl) return;
    setBusy(true);
    try {
      const res = await fetch(m.downloadUrl);
      if (!res.ok) throw new Error("fetch failed");
      const cipher = await res.arrayBuffer();
      const plain = await decryptContent(key, cipher, m.contentIv);
      const blob = new Blob([plain], { type: type || "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name || "download";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError("Download failed. The link may have just expired — ask the sender to resend.");
      setPhase("error");
    }
    setBusy(false);
  }

  if (phase === "loading") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
        <Loader2Icon className="size-4 animate-spin" /> Opening secure link…
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-8 text-center">
        <TriangleAlertIcon className="size-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{error}</p>
        <p className="text-xs text-muted-foreground">Shared files auto-delete after up to 24 hours.</p>
      </div>
    );
  }

  if (phase === "locked") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-8 text-center">
        <div className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
          <LockIcon className="size-7" />
        </div>
        <div>
          <p className="font-heading font-medium break-all">{name}</p>
          <p className="text-sm text-muted-foreground">{humanSize(size)} · password required</p>
        </div>
        <div className="flex w-full max-w-xs flex-col gap-1.5 text-left">
          <Label htmlFor="unlock-pw" className="sr-only">Password</Label>
          <input
            id="unlock-pw"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && unlock()}
            placeholder="Enter password"
            autoComplete="off"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          {pwError && <p className="text-xs text-destructive">{pwError}</p>}
        </div>
        <Button onClick={unlock} disabled={busy || !password.trim()}>
          {busy ? <Loader2Icon className="animate-spin" /> : <LockIcon className="size-4" />}
          Unlock
        </Button>
      </div>
    );
  }

  // ready
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-8 text-center">
      <div className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
        <FileIcon className="size-7" />
      </div>
      <div>
        <p className="font-heading font-medium break-all">{name}</p>
        <p className="text-sm text-muted-foreground">{humanSize(size)}</p>
      </div>
      <Button onClick={download} disabled={busy}>
        {busy ? <Loader2Icon className="animate-spin" /> : <DownloadIcon className="size-4" />}
        Download
      </Button>
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <LockIcon className="size-3" /> Decrypted in your browser
        {expiresAt && ` · expires ${new Date(expiresAt).toLocaleString()}`}
      </p>
    </div>
  );
}
