"use client";

import * as React from "react";
import { Loader2Icon, RotateCcwIcon } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dropzone } from "@/modules/tools/components/dropzone";
import { getFfmpeg } from "@/modules/tools/components/ffmpeg-client";
import { FileResult, formatBytes } from "@/modules/tools/components/tool-result";

const MAX_BYTES = 100 * 1024 * 1024; // 100 MB — browser memory limit

const MIME: Record<string, string> = {
  mp3: "audio/mpeg",
  wav: "audio/wav",
  m4a: "audio/mp4",
  ogg: "audio/ogg",
  aac: "audio/aac",
  flac: "audio/flac",
};

// Codecs confirmed available in the standard single-thread @ffmpeg/core build.
function codecArgs(fmt: string): string[] {
  if (fmt === "wav") return ["-c:a", "pcm_s16le"];
  if (fmt === "m4a") return ["-c:a", "aac", "-b:a", "192k"];
  return ["-c:a", "libmp3lame", "-b:a", "192k"]; // mp3
}

type Control = {
  key: string;
  label: string;
  default: string;
  options: { label: string; value: string }[];
};

type OpDef = {
  accept: string;
  isTrim?: boolean;
  controls?: Control[];
  // Output extension can depend on the chosen options and the input's extension.
  outExt: (opts: Record<string, string>, inExt: string) => string;
  build: (opts: Record<string, string>, inName: string, outName: string) => string[];
};

const OPS: Record<string, OpDef> = {
  "audio-converter": {
    accept: "audio/*",
    controls: [
      {
        key: "format",
        label: "Convert to",
        default: "mp3",
        options: [
          { label: "MP3", value: "mp3" },
          { label: "WAV", value: "wav" },
          { label: "M4A (AAC)", value: "m4a" },
        ],
      },
    ],
    outExt: (o) => o.format || "mp3",
    build: (o, i, out) => ["-i", i, "-vn", ...codecArgs(o.format || "mp3"), out],
  },
  "change-volume": {
    accept: "audio/*",
    controls: [
      {
        key: "level",
        label: "Adjust",
        default: "1.5",
        options: [
          { label: "Quieter (50%)", value: "0.5" },
          { label: "Louder (150%)", value: "1.5" },
          { label: "Much louder (200%)", value: "2.0" },
          { label: "Normalize loudness", value: "normalize" },
        ],
      },
    ],
    outExt: () => "mp3",
    build: (o, i, out) => {
      const filter = o.level === "normalize" ? ["-af", "loudnorm"] : ["-af", `volume=${o.level || "1.5"}`];
      return ["-i", i, "-vn", ...filter, "-c:a", "libmp3lame", "-b:a", "192k", out];
    },
  },
  "trim-audio": {
    accept: "audio/*",
    isTrim: true,
    outExt: (_o, inExt) => inExt || "mp3",
    // Args are built from the slider values in run(); this is unused for trim.
    build: (_o, i, out) => ["-i", i, "-c", "copy", out],
  },
};

function fmtTime(s: number) {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function AudioTool({ op, actionLabel }: { op: string; actionLabel: string }) {
  const def = OPS[op];
  const isTrim = op === "trim-audio";

  const [file, setFile] = React.useState<File | null>(null);
  const [srcUrl, setSrcUrl] = React.useState<string | null>(null);
  const [duration, setDuration] = React.useState(0);
  const [start, setStart] = React.useState(0);
  const [end, setEnd] = React.useState(0);
  const [opts, setOpts] = React.useState<Record<string, string>>(() =>
    Object.fromEntries((def?.controls ?? []).map((c) => [c.key, c.default])),
  );
  const [busy, setBusy] = React.useState(false);
  const [status, setStatus] = React.useState("");
  const [pct, setPct] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const [out, setOut] = React.useState<{ url: string; size: number; ext: string } | null>(null);

  if (!def) return null;

  function clearOut() {
    setOut((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return null;
    });
  }

  function pick(f: File | undefined) {
    setError(null);
    clearOut();
    if (!f) return;
    if (f.size > MAX_BYTES) {
      setError(`That file is ${formatBytes(f.size)}. The limit is ${Math.round(MAX_BYTES / 1024 / 1024)} MB.`);
      return;
    }
    setFile(f);
    setDuration(0);
    setSrcUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(f);
    });
  }

  function reset() {
    if (srcUrl) URL.revokeObjectURL(srcUrl);
    clearOut();
    setFile(null);
    setSrcUrl(null);
    setDuration(0);
    setError(null);
  }

  async function run() {
    if (!file) return;
    if (isTrim && !(end > start)) {
      setError("The end time must be after the start time.");
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

      const inExt = file.name.split(".").pop()?.toLowerCase() || "mp3";
      const inName = `input.${inExt}`;
      const outExt = def.outExt(opts, inExt);
      const outName = `output.${outExt}`;
      await ff.writeFile(inName, await fetchFile(file));

      setStatus("Processing…");
      const args = isTrim
        ? ["-i", inName, "-ss", start.toFixed(2), "-to", end.toFixed(2), "-c", "copy", outName]
        : def.build(opts, inName, outName);
      await ff.exec(args);

      const data = await ff.readFile(outName);
      const bytes = typeof data === "string" ? new TextEncoder().encode(data) : new Uint8Array(data);
      const blob = new Blob([bytes], { type: MIME[outExt] || "audio/mpeg" });
      if (blob.size === 0) throw new Error("empty output");
      setOut({ url: URL.createObjectURL(blob), size: blob.size, ext: outExt });
    } catch {
      setError("Couldn't process that audio. It may be an unsupported format — try converting it to MP3 first.");
    }
    setStatus("");
    setPct(0);
    setBusy(false);
  }

  const baseName = file?.name.replace(/\.[^.]+$/, "") || "audio";

  // ── Empty state ─────────────────────────────────────────────────────────
  if (!file) {
    return (
      <Dropzone
        accept={def.accept}
        onFile={(f) => pick(f)}
        title="Drag & drop an audio file, or click to browse"
        hint={`MP3, WAV, M4A, and more — up to ${Math.round(MAX_BYTES / 1024 / 1024)} MB. Runs in your browser, nothing uploaded.`}
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Source */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatBytes(file.size)}
              {duration > 0 ? ` · ${fmtTime(duration)}` : ""}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={reset} disabled={busy}>
            <RotateCcwIcon className="size-4" /> Change
          </Button>
        </div>
        {srcUrl && (
          <audio
            src={srcUrl}
            controls
            preload="metadata"
            onLoadedMetadata={(e) => {
              const d = e.currentTarget.duration;
              if (isFinite(d) && d > 0) {
                setDuration(d);
                if (isTrim) {
                  setStart(0);
                  setEnd(d);
                }
              }
            }}
            className="w-full"
          />
        )}
      </div>

      {/* Trim range */}
      {isTrim && (
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Clip range</span>
            <span className="tabular-nums text-muted-foreground">
              {fmtTime(start)} → {fmtTime(end)} <span className="opacity-60">({fmtTime(Math.max(0, end - start))})</span>
            </span>
          </div>
          {duration > 0 ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="w-10 shrink-0 text-xs text-muted-foreground">Start</span>
                <input
                  type="range" min={0} max={duration} step={0.1} value={start}
                  onChange={(e) => setStart(Math.min(Number(e.target.value), end - 0.1))}
                  className="w-full accent-primary" disabled={busy}
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="w-10 shrink-0 text-xs text-muted-foreground">End</span>
                <input
                  type="range" min={0} max={duration} step={0.1} value={end}
                  onChange={(e) => setEnd(Math.max(Number(e.target.value), start + 0.1))}
                  className="w-full accent-primary" disabled={busy}
                />
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Loading audio…</p>
          )}
        </div>
      )}

      {/* Controls */}
      {!isTrim && def.controls && def.controls.length > 0 && (
        <div className="flex flex-wrap items-end gap-4">
          {def.controls.map((c) => (
            <div key={c.key} className="flex flex-col gap-1.5">
              <Label htmlFor={`a-${c.key}`} className="text-sm">{c.label}</Label>
              <select
                id={`a-${c.key}`}
                value={opts[c.key]}
                onChange={(e) => setOpts((p) => ({ ...p, [c.key]: e.target.value }))}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                disabled={busy}
              >
                {c.options.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Action + progress */}
      <div className="flex flex-col gap-2">
        <Button className="w-fit" onClick={run} disabled={busy || (isTrim && duration === 0)}>
          {busy ? <Loader2Icon className="animate-spin" /> : null}
          {actionLabel}
        </Button>
        {busy && (
          <div className="flex flex-col gap-1">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs text-muted-foreground">{status}{pct > 0 ? ` ${pct}%` : ""}</span>
          </div>
        )}
      </div>

      {/* Result */}
      {out && (
        <FileResult href={out.url} filename={`${baseName}.${out.ext}`} meta={formatBytes(out.size)}>
          <audio src={out.url} controls className="w-full" />
        </FileResult>
      )}

      <p className="text-xs text-muted-foreground">
        The processing engine (~30&nbsp;MB) downloads once on first use, then works offline.
      </p>
    </div>
  );
}
