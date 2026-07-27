"use client";

import * as React from "react";
import { DownloadIcon, Loader2Icon, LockIcon, FileIcon, TriangleAlertIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { importKey, decryptMeta, decryptContent } from "@/lib/crypto-transfer";

type Meta = { metaCipher: string; metaIv: string; contentIv: string; size: number; expiresAt: string; downloadUrl: string };

function humanSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function ReceiveFile({ id }: { id: string }) {
  const [phase, setPhase] = React.useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = React.useState("");
  const [name, setName] = React.useState("");
  const [type, setType] = React.useState("");
  const [size, setSize] = React.useState(0);
  const [expiresAt, setExpiresAt] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  const metaRef = React.useRef<Meta | null>(null);
  const keyRef = React.useRef<CryptoKey | null>(null);

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
        const meta = j as Meta;
        const key = await importKey(keyStr);
        const info = await decryptMeta(key, meta.metaCipher, meta.metaIv);
        if (!alive) return;
        metaRef.current = meta;
        keyRef.current = key;
        setName(info.name);
        setType(info.type);
        setSize(meta.size);
        setExpiresAt(meta.expiresAt);
        setPhase("ready");
      } catch {
        if (alive) { setError("This file couldn't be decrypted — the link may be incomplete."); setPhase("error"); }
      }
    })();
    return () => { alive = false; };
  }, [id]);

  async function download() {
    const meta = metaRef.current;
    const key = keyRef.current;
    if (!meta || !key) return;
    setBusy(true);
    try {
      const res = await fetch(meta.downloadUrl);
      if (!res.ok) throw new Error("fetch failed");
      const cipher = await res.arrayBuffer();
      const plain = await decryptContent(key, cipher, meta.contentIv);
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

  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-8 text-center">
      <div className="grid size-14 place-items-center rounded-2xl bg-muted text-foreground">
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
