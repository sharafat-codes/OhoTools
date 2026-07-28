"use client";

import * as React from "react";
import { XIcon, ArrowUpIcon, ArrowDownIcon, Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dropzone } from "@/modules/tools/components/dropzone";
import { getFfmpeg } from "@/modules/tools/components/ffmpeg-client";
import { FileResult, formatBytes } from "@/modules/tools/components/tool-result";

const MAX_TOTAL_BYTES = 100 * 1024 * 1024; // 100 MB combined — browser memory limit

type Item = { id: number; file: File };

export function MergeAudio() {
  const idRef = React.useRef(0);
  const [items, setItems] = React.useState<Item[]>([]);
  const [busy, setBusy] = React.useState(false);
  const [status, setStatus] = React.useState("");
  const [pct, setPct] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const [out, setOut] = React.useState<{ url: string; size: number } | null>(null);

  function clearOut() {
    setOut((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return null;
    });
  }

  function addFiles(files: FileList | null) {
    if (!files) return;
    const next = Array.from(files)
      .filter((f) => f.type.startsWith("audio/"))
      .map((f) => ({ id: idRef.current++, file: f }));
    if (next.length) {
      setItems((prev) => [...prev, ...next]);
      setError(null);
      clearOut();
    }
  }

  function move(id: number, dir: -1 | 1) {
    clearOut();
    setItems((prev) => {
      const i = prev.findIndex((x) => x.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const copy = [...prev];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  }

  function remove(id: number) {
    clearOut();
    setItems((p) => p.filter((x) => x.id !== id));
  }

  async function run() {
    if (items.length < 2) return;
    if (items.reduce((n, it) => n + it.file.size, 0) > MAX_TOTAL_BYTES) {
      setError(`Those files total more than ${Math.round(MAX_TOTAL_BYTES / 1024 / 1024)} MB — merge fewer or smaller files.`);
      return;
    }
    setBusy(true);
    setError(null);
    clearOut();
    setPct(0);
    try {
      setStatus("Loading engine…");
      const { fetchFile } = await import("@ffmpeg/util");
      const ff = await getFfmpeg(setPct);

      setStatus("Merging…");
      const args: string[] = [];
      for (let i = 0; i < items.length; i++) {
        const ext = items[i].file.name.split(".").pop()?.toLowerCase() || "mp3";
        const name = `in${i}.${ext}`;
        await ff.writeFile(name, await fetchFile(items[i].file));
        args.push("-i", name);
      }
      const filter =
        items.map((_, i) => `[${i}:a]`).join("") + `concat=n=${items.length}:v=0:a=1[out]`;
      args.push("-filter_complex", filter, "-map", "[out]", "-c:a", "libmp3lame", "-b:a", "192k", "output.mp3");
      await ff.exec(args);

      const data = await ff.readFile("output.mp3");
      const bytes = typeof data === "string" ? new TextEncoder().encode(data) : new Uint8Array(data);
      const blob = new Blob([bytes], { type: "audio/mpeg" });
      if (blob.size === 0) throw new Error("empty output");
      setOut({ url: URL.createObjectURL(blob), size: blob.size });
    } catch {
      setError("Couldn't merge those files. Make sure they're valid audio files and try again.");
    }
    setStatus("");
    setPct(0);
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <Dropzone
        accept="audio/*"
        multiple
        onFiles={addFiles}
        title="Drag & drop audio files, or click to browse"
        hint="Joined in the order below — in your browser, nothing uploaded."
      />

      {items.length > 0 && (
        <>
          <div className="flex flex-col gap-2">
            {items.map((item, i) => (
              <Card key={item.id}>
                <CardContent className="flex items-center gap-2 py-2.5">
                  <span className="w-5 shrink-0 text-center text-xs text-muted-foreground">{i + 1}</span>
                  <span className="min-w-0 flex-1 truncate text-sm">{item.file.name}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{formatBytes(item.file.size)}</span>
                  <button type="button" onClick={() => move(item.id, -1)} disabled={i === 0} aria-label="Move up" className="shrink-0 text-muted-foreground hover:text-foreground disabled:opacity-30">
                    <ArrowUpIcon className="size-4" />
                  </button>
                  <button type="button" onClick={() => move(item.id, 1)} disabled={i === items.length - 1} aria-label="Move down" className="shrink-0 text-muted-foreground hover:text-foreground disabled:opacity-30">
                    <ArrowDownIcon className="size-4" />
                  </button>
                  <button type="button" onClick={() => remove(item.id)} aria-label="Remove" className="shrink-0 text-muted-foreground hover:text-foreground">
                    <XIcon className="size-4" />
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              <Button onClick={run} disabled={busy || items.length < 2}>
                {busy ? <Loader2Icon className="animate-spin" /> : null}
                Merge {items.length} files
              </Button>
              <Button variant="ghost" onClick={() => { clearOut(); setItems([]); }}>Clear</Button>
            </div>
            {busy && (
              <div className="flex flex-col gap-1">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs text-muted-foreground">{status}{pct > 0 ? ` ${pct}%` : ""}</span>
              </div>
            )}
          </div>

          {out && (
            <FileResult href={out.url} filename="merged.mp3" meta={formatBytes(out.size)}>
              <audio src={out.url} controls className="w-full" />
            </FileResult>
          )}
        </>
      )}

      <p className="text-xs text-muted-foreground">
        The processing engine (~30&nbsp;MB) downloads once on first use, then works offline. Output is MP3.
      </p>
    </div>
  );
}
