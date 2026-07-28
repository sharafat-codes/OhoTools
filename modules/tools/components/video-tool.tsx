"use client";

import * as React from "react";
import { Loader2Icon, DownloadIcon, RotateCcwIcon } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dropzone } from "@/modules/tools/components/dropzone";

// Single-threaded core from CDN — no SharedArrayBuffer, so no COOP/COEP headers
// (which would otherwise break the Dropbox/Google/Paddle cross-origin scripts).
const CORE_CDN = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd";
const MAX_BYTES = 100 * 1024 * 1024; // 100 MB — browser memory limit; best for short clips

type Control = {
  key: string;
  label: string;
  default: string;
  options: { label: string; value: string }[];
};

type OpDef = {
  accept: string;
  outExt: string;
  outMime: string;
  controls?: Control[];
  build: (opts: Record<string, string>, inName: string, outName: string) => string[];
};

const OPS: Record<string, OpDef> = {
  "video-to-gif": {
    accept: "video/*",
    outExt: "gif",
    outMime: "image/gif",
    controls: [
      { key: "fps", label: "Frame rate", default: "15", options: [
        { label: "10 fps", value: "10" }, { label: "15 fps", value: "15" }, { label: "24 fps", value: "24" },
      ] },
      { key: "width", label: "Width", default: "480", options: [
        { label: "320px", value: "320" }, { label: "480px", value: "480" }, { label: "640px", value: "640" },
      ] },
    ],
    build: (o, i, out) => ["-i", i, "-vf", `fps=${o.fps},scale=${o.width}:-1:flags=lanczos`, "-loop", "0", out],
  },
  "video-to-mp4": {
    accept: "video/*,.mkv,.avi,.webm,.mov",
    outExt: "mp4",
    outMime: "video/mp4",
    build: (_o, i, out) => ["-i", i, "-c:v", "libx264", "-preset", "veryfast", "-crf", "23", "-c:a", "aac", out],
  },
  "compress-video": {
    accept: "video/*",
    outExt: "mp4",
    outMime: "video/mp4",
    controls: [
      { key: "crf", label: "Quality", default: "28", options: [
        { label: "Smaller file", value: "30" }, { label: "Balanced", value: "28" }, { label: "Higher quality", value: "24" },
      ] },
    ],
    build: (o, i, out) => ["-i", i, "-c:v", "libx264", "-preset", "veryfast", "-crf", o.crf, "-c:a", "aac", "-b:a", "128k", out],
  },
  "trim-video": {
    accept: "video/*",
    outExt: "mp4",
    outMime: "video/mp4",
    // Args are built from the slider values in run(); this is unused for trim.
    build: (_o, i, out) => ["-i", i, "-c", "copy", out],
  },
  "video-to-mp3": {
    accept: "video/*",
    outExt: "mp3",
    outMime: "audio/mpeg",
    controls: [
      { key: "quality", label: "Bitrate", default: "192k", options: [
        { label: "128 kbps", value: "128k" }, { label: "192 kbps", value: "192k" }, { label: "320 kbps", value: "320k" },
      ] },
    ],
    build: (o, i, out) => ["-i", i, "-vn", "-acodec", "libmp3lame", "-b:a", o.quality, out],
  },
};

type FFmpegInstance = {
  load: (cfg: { coreURL: string; wasmURL: string }) => Promise<unknown>;
  on: (event: string, cb: (e: { progress: number }) => void) => void;
  writeFile: (name: string, data: Uint8Array) => Promise<unknown>;
  readFile: (name: string) => Promise<Uint8Array | string>;
  exec: (args: string[]) => Promise<number>;
};
let ffmpegPromise: Promise<FFmpegInstance> | null = null;

async function getFfmpeg(onProgress: (pct: number) => void): Promise<FFmpegInstance> {
  if (!ffmpegPromise) {
    ffmpegPromise = (async () => {
      const { FFmpeg } = await import("@ffmpeg/ffmpeg");
      const { toBlobURL } = await import("@ffmpeg/util");
      const ff = new FFmpeg() as unknown as FFmpegInstance;
      await ff.load({
        coreURL: await toBlobURL(`${CORE_CDN}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${CORE_CDN}/ffmpeg-core.wasm`, "application/wasm"),
      });
      return ff;
    })();
  }
  const ff = await ffmpegPromise;
  ff.on("progress", (e) => onProgress(Math.min(100, Math.max(0, Math.round((e.progress || 0) * 100)))));
  return ff;
}

function humanSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function fmtTime(s: number) {
  if (!isFinite(s) || s < 0) s = 0;
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`;
}

export function VideoTool({ op, actionLabel }: { op: string; actionLabel: string }) {
  const def = OPS[op];
  const isTrim = op === "trim-video";

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
  const [outUrl, setOutUrl] = React.useState<string | null>(null);
  const [outSize, setOutSize] = React.useState(0);

  if (!def) return null;

  function pick(f: File | undefined) {
    setError(null);
    setOutUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    if (!f) return;
    if (f.size > MAX_BYTES) {
      setError(`That file is ${humanSize(f.size)}. The limit is ${Math.round(MAX_BYTES / 1024 / 1024)} MB — try a shorter clip.`);
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
    if (outUrl) URL.revokeObjectURL(outUrl);
    setFile(null);
    setSrcUrl(null);
    setOutUrl(null);
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
    setOutUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setPct(0);
    try {
      setStatus("Loading engine…");
      const { fetchFile } = await import("@ffmpeg/util");
      const ff = await getFfmpeg(setPct);

      const inExt = file.name.split(".").pop()?.toLowerCase() || "mp4";
      const inName = `input.${inExt}`;
      const outName = `output.${def.outExt}`;
      await ff.writeFile(inName, await fetchFile(file));

      setStatus("Processing…");
      const args = isTrim
        ? ["-i", inName, "-ss", start.toFixed(2), "-to", end.toFixed(2), "-c", "copy", outName]
        : def.build(opts, inName, outName);
      await ff.exec(args);

      const data = await ff.readFile(outName);
      const bytes = typeof data === "string" ? new TextEncoder().encode(data) : new Uint8Array(data);
      const blob = new Blob([bytes], { type: def.outMime });
      if (blob.size === 0) throw new Error("empty output");
      setOutUrl(URL.createObjectURL(blob));
      setOutSize(blob.size);
    } catch {
      setError("Couldn't process that clip. It may be an unsupported format or too long for in-browser processing — try a shorter clip.");
    }
    setStatus("");
    setPct(0);
    setBusy(false);
  }

  const baseName = file?.name.replace(/\.[^.]+$/, "") || "output";

  // ── Empty state: dropzone ───────────────────────────────────────────────
  if (!file) {
    return (
      <Dropzone
        accept={def.accept}
        onFile={(f) => pick(f)}
        title="Drag & drop a video, or click to browse"
        hint={`MP4, WebM, MOV and more — up to ${Math.round(MAX_BYTES / 1024 / 1024)} MB. Runs in your browser, nothing uploaded.`}
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Source card */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {humanSize(file.size)}
              {duration > 0 ? ` · ${fmtTime(duration)}` : ""}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={reset} disabled={busy}>
            <RotateCcwIcon className="size-4" /> Change
          </Button>
        </div>
        {srcUrl && (
          <video
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
            className="max-h-64 w-full rounded-lg bg-black"
          />
        )}
      </div>

      {/* Trim: duration-aware range sliders */}
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
                  className="w-full accent-primary"
                  disabled={busy}
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="w-10 shrink-0 text-xs text-muted-foreground">End</span>
                <input
                  type="range" min={0} max={duration} step={0.1} value={end}
                  onChange={(e) => setEnd(Math.max(Number(e.target.value), start + 0.1))}
                  className="w-full accent-primary"
                  disabled={busy}
                />
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Loading video…</p>
          )}
        </div>
      )}

      {/* Non-trim controls */}
      {!isTrim && def.controls && def.controls.length > 0 && (
        <div className="flex flex-wrap items-end gap-4">
          {def.controls.map((c) => (
            <div key={c.key} className="flex flex-col gap-1.5">
              <Label htmlFor={`v-${c.key}`} className="text-sm">{c.label}</Label>
              <select
                id={`v-${c.key}`}
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
      {outUrl && (
        <div className="flex flex-col gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4">
          <p className="text-sm font-medium">Done — {humanSize(outSize)}</p>
          {def.outMime.startsWith("image") && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={outUrl} alt="Result" className="max-h-72 w-fit max-w-full rounded-lg border border-border" />
          )}
          {def.outMime.startsWith("video") && (
            <video src={outUrl} controls className="max-h-72 w-full rounded-lg bg-black" />
          )}
          {def.outMime.startsWith("audio") && <audio src={outUrl} controls className="w-full" />}
          <Button size="sm" className="w-fit" render={<a href={outUrl} download={`${baseName}.${def.outExt}`} />}>
            <DownloadIcon className="size-4" /> Download
          </Button>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Everything runs in your browser — your video is never uploaded. The engine (~30&nbsp;MB) downloads once on first use. Best for short clips.
      </p>
    </div>
  );
}
