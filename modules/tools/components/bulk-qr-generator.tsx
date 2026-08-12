"use client";

import * as React from "react";
import Link from "next/link";
import QRCode from "qrcode";
import JSZip from "jszip";
import { DownloadIcon, SparklesIcon, Loader2Icon } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useSession } from "@/components/plan-provider";
import { isPro } from "@/lib/plans";

const FREE_LIMIT = 3;

type Item = { text: string; url: string };

export function BulkQrGenerator() {
  const { data } = useSession();
  const pro = isPro((data?.user as { plan?: string } | undefined)?.plan ?? "FREE");

  const [input, setInput] = React.useState("");
  const [size, setSize] = React.useState("512");
  const [fg, setFg] = React.useState("#000000");
  const [bg, setBg] = React.useState("#ffffff");
  const [results, setResults] = React.useState<Item[]>([]);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const lines = input.split("\n").map((l) => l.trim()).filter(Boolean);
  const overLimit = !pro && lines.length > FREE_LIMIT;

  async function generate() {
    if (lines.length === 0) {
      setError("Add at least one line of text or a URL.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const width = Math.min(Math.max(parseInt(size) || 512, 64), 2000);
      const targets = pro ? lines : lines.slice(0, FREE_LIMIT);
      const out: Item[] = [];
      for (const text of targets) {
        const url = await QRCode.toDataURL(text, {
          width,
          margin: 2,
          color: { dark: fg, light: bg },
          errorCorrectionLevel: "M",
        });
        out.push({ text, url });
      }
      setResults(out);
    } catch {
      setError("Could not generate the QR codes.");
    }
    setBusy(false);
  }

  async function downloadZip() {
    const zip = new JSZip();
    results.forEach((r, i) => zip.file(`qr-${i + 1}.png`, r.url.split(",")[1], { base64: true }));
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qr-codes.zip";
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadOne(item: Item, i: number) {
    const a = document.createElement("a");
    a.href = item.url;
    a.download = `qr-${i + 1}.png`;
    a.click();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="bqr-input">One URL or text per line</Label>
        <Textarea
          id="bqr-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"https://example.com/1\nhttps://example.com/2\nhttps://example.com/3"}
          className="min-h-32 font-mono text-xs"
        />
        {lines.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {lines.length} code{lines.length === 1 ? "" : "s"}
            {overLimit && ` · free generates the first ${FREE_LIMIT}`}
          </p>
        )}
      </div>

      {!pro && (
        <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-3 text-sm">
          <SparklesIcon className="size-4 shrink-0 text-primary" />
          <span className="flex-1 text-muted-foreground">
            Free generates up to {FREE_LIMIT} codes.{" "}
            <span className="font-medium text-foreground">Go Pro for unlimited codes + a one-click ZIP.</span>
          </span>
          <Link href="/pricing" className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90">
            Go Pro
          </Link>
        </div>
      )}

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex w-28 flex-col gap-1.5">
          <Label htmlFor="bqr-size">Size (px)</Label>
          <Input id="bqr-size" type="number" value={size} onChange={(e) => setSize(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="bqr-fg">Foreground</Label>
          <input id="bqr-fg" type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="size-9 cursor-pointer rounded-lg border border-input bg-transparent p-0.5" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="bqr-bg">Background</Label>
          <input id="bqr-bg" type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="size-9 cursor-pointer rounded-lg border border-input bg-transparent p-0.5" />
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex flex-wrap gap-2">
        <Button onClick={generate} disabled={busy}>
          {busy ? <Loader2Icon className="animate-spin" /> : null}
          Generate {overLimit ? `first ${FREE_LIMIT}` : lines.length || ""} QR codes
        </Button>
        {results.length > 0 &&
          (pro ? (
            <Button variant="outline" onClick={downloadZip}>
              <DownloadIcon />
              Download ZIP ({results.length})
            </Button>
          ) : (
            <Button variant="outline" render={<Link href="/pricing" />}>
              <SparklesIcon />
              ZIP is Pro
            </Button>
          ))}
      </div>

      {results.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {results.map((r, i) => (
            <Card key={i}>
              <CardContent className="flex flex-col items-center gap-2 py-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.url} alt={`QR for ${r.text}`} className="aspect-square w-full max-w-32 rounded border border-border" />
                <span className="w-full truncate text-center text-xs text-muted-foreground" title={r.text}>{r.text}</span>
                <Button variant="outline" size="sm" className="w-full" onClick={() => downloadOne(r, i)}>
                  <DownloadIcon />
                  PNG
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
