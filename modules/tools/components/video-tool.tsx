"use client";

import * as React from "react";
import { UploadIcon, Loader2Icon, DownloadIcon } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// Single-threaded core from CDN — no SharedArrayBuffer, so no COOP/COEP headers
// (which would otherwise break the Dropbox/Google/Paddle cross-origin scripts).
const CORE_CDN = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd";
const MAX_BYTES = 100 * 1024 * 1024; // 100 MB — browser memory limit; best for short clips

type Control =
  | { key: string; label: string; type: "select"; default: string; options: { label: string; value: string }[] }
  | { key: string; label: string; type: "text"; default: string; placeholder?: string };

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
      { key: "fps", label: "Frame rate", type: "select", default: "15", options: [
        { label: "10 fps", value: "10" }, { label: "15 fps", value: "15" }, { label: "24 fps", value: "24" },
      ] },
      { key: "width", label: "Width", type: "select", default: "480", options: [
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
      { key: "crf", label: "Quality", type: "select", default: "28", options: [
        { label: "Smaller file", value: "30" }, { label: "Balanced", value: "28" }, { label: "Higher quality", value: "24" },
      ] },
    ],
    build: (o, i, out) => ["-i", i, "-c:v", "libx264", "-preset", "veryfast", "-crf", o.crf, "-c:a", "aac", "-b:a", "128k", out],
  },
  "trim-video": {
    accept: "video/*",
    outExt: "mp4",
    outMime: "video/mp4",
    controls: [
      { key: "start", label: "Start", type: "text", default: "00:00:00", placeholder: "hh:mm:ss" },
      { key: "end", label: "End", type: "text", default: "00:00:10", placeholder: "hh:mm:ss" },
    ],
    build: (o, i, out) => ["-i", i, "-ss", o.start || "0", "-to", o.end || "", "-c", "copy", out],
  },
  "video-to-mp3": {
    accept: "video/*",
    outExt: "mp3",
    outMime: "audio/mpeg",
    controls: [
      { key: "quality", label: "Bitrate", type: "select", default: "192k", options: [
        { label: "128 kbps", value: "128k" }, { label: "192 kbps", value: "192k" }, { label: "320 kbps", value: "320k" },
      ] },
    ],
    build: (o, i, out) => ["-i", i, "-vn", "-acodec", "libmp3lame", "-b:a", o.quality, out],
  },
};

// Lazily created singleton so the ~30 MB core downloads once per session.
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

export function VideoTool({ op, actionLabel }: { op: string; actionLabel: string }) {
  const def = OPS[op];

  const [file, setFile] = React.useState<File | null>(null);
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

  function onFile(f: File | undefined) {
    setError(null);
    setOutUrl(null);
    if (!f) return;
    if (f.size > MAX_BYTES) {
      setError(`That file is ${humanSize(f.size)}. The limit is ${Math.round(MAX_BYTES / 1024 / 1024)} MB — try a shorter clip.`);
      return;
    }
    setFile(f);
  }

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setOutUrl(null);
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
      const args = def.build(opts, inName, outName).filter((a) => a !== "");
      await ff.exec(args);

      const data = await ff.readFile(outName);
      const bytes = typeof data === "string" ? new TextEncoder().encode(data) : new Uint8Array(data);
      const blob = new Blob([bytes], { type: def.outMime });
      if (blob.size === 0) throw new Error("empty output");
      setOutUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
      setOutSize(blob.size);
    } catch {
      setError("Couldn't process that file. It may be too large or an unsupported format — try a shorter clip.");
    }
    setStatus("");
    setPct(0);
    setBusy(false);
  }

  const baseName = file?.name.replace(/\.[^.]+$/, "") || "output";

  return (
    <div className="flex flex-col gap-4">
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-10 text-center transition-colors hover:bg-muted/50">
        <UploadIcon className="size-6 text-muted-foreground" />
        <span className="text-sm font-medium">{file ? file.name : "Choose a video"}</span>
        <span className="text-xs text-muted-foreground">
          {file ? humanSize(file.size) : `MP4, WebM, MOV and more — up to ${Math.round(MAX_BYTES / 1024 / 1024)} MB. Runs in your browser.`}
        </span>
        <input type="file" accept={def.accept} className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      </label>

      {def.controls && def.controls.length > 0 && (
        <div className="flex flex-wrap items-end gap-4">
          {def.controls.map((c) => (
            <div key={c.key} className="flex flex-col gap-1.5">
              <Label htmlFor={`v-${c.key}`} className="text-sm">{c.label}</Label>
              {c.type === "select" ? (
                <select
                  id={`v-${c.key}`}
                  value={opts[c.key]}
                  onChange={(e) => setOpts((p) => ({ ...p, [c.key]: e.target.value }))}
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                >
                  {c.options.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              ) : (
                <input
                  id={`v-${c.key}`}
                  type="text"
                  value={opts[c.key]}
                  placeholder={c.placeholder}
                  onChange={(e) => setOpts((p) => ({ ...p, [c.key]: e.target.value }))}
                  className="w-28 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-center gap-3">
        <Button className="w-fit" onClick={run} disabled={busy || !file}>
          {busy ? <Loader2Icon className="animate-spin" /> : null}
          {actionLabel}
        </Button>
        {busy && (
          <span className="text-sm text-muted-foreground">
            {status}{pct > 0 ? ` ${pct}%` : ""}
          </span>
        )}
      </div>

      {outUrl && (
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
          {def.outMime.startsWith("image") && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={outUrl} alt="Result" className="max-h-72 w-fit max-w-full rounded-lg border border-border" />
          )}
          {def.outMime.startsWith("video") && (
            <video src={outUrl} controls className="max-h-72 w-fit max-w-full rounded-lg border border-border" />
          )}
          {def.outMime.startsWith("audio") && <audio src={outUrl} controls className="w-full" />}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Result · {humanSize(outSize)}</span>
            <Button size="sm" render={<a href={outUrl} download={`${baseName}.${def.outExt}`} />}>
              <DownloadIcon className="size-4" /> Download
            </Button>
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Everything runs in your browser — your video is never uploaded. The engine (~30&nbsp;MB) downloads once on first use. Best for short clips.
      </p>
    </div>
  );
}
