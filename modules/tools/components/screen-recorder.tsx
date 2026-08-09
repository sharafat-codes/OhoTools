"use client";

import * as React from "react";
import Link from "next/link";
import { MonitorIcon, MicIcon, MicOffIcon, CircleIcon, PauseIcon, PlayIcon, SquareIcon, DownloadIcon, RotateCcwIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Status = "idle" | "recording" | "paused" | "recorded";

function fmt(sec: number) {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

function pickMime(): string {
  const types = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"];
  for (const t of types) if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(t)) return t;
  return "video/webm";
}

const NEXT_TOOLS = [
  { slug: "video-to-mp4", label: "Convert to MP4" },
  { slug: "compress-video", label: "Compress video" },
  { slug: "trim-video", label: "Trim video" },
  { slug: "video-to-gif", label: "Turn into a GIF" },
];

export function ScreenRecorder() {
  const [supported, setSupported] = React.useState<boolean | null>(null);
  const [status, setStatus] = React.useState<Status>("idle");
  const [mic, setMic] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(0);
  const [url, setUrl] = React.useState("");
  const [error, setError] = React.useState("");

  const recorderRef = React.useRef<MediaRecorder | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);
  const streamsRef = React.useRef<MediaStream[]>([]);
  const ctxRef = React.useRef<AudioContext | null>(null);
  const timerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    setSupported(
      typeof navigator !== "undefined" &&
        !!navigator.mediaDevices &&
        typeof navigator.mediaDevices.getDisplayMedia === "function" &&
        typeof MediaRecorder !== "undefined",
    );
  }, []);

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = () => {
    clearTimer();
    timerRef.current = window.setInterval(() => setElapsed((e) => e + 1), 1000);
  };

  const cleanupStreams = React.useCallback(() => {
    streamsRef.current.forEach((s) => s.getTracks().forEach((t) => t.stop()));
    streamsRef.current = [];
    if (ctxRef.current) {
      ctxRef.current.close().catch(() => {});
      ctxRef.current = null;
    }
  }, []);

  React.useEffect(() => {
    return () => {
      clearTimer();
      cleanupStreams();
      if (url) URL.revokeObjectURL(url);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function start() {
    setError("");
    if (url) {
      URL.revokeObjectURL(url);
      setUrl("");
    }
    chunksRef.current = [];

    let display: MediaStream;
    try {
      display = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
    } catch (e) {
      const err = e as { name?: string };
      if (err.name !== "NotAllowedError") setError("Couldn't start screen capture. Please try again.");
      return;
    }
    streamsRef.current.push(display);

    // Mix tab/system audio (if the user shared it) with the mic (if enabled)
    // into a single track via Web Audio.
    let audioTracks: MediaStreamTrack[] = [];
    try {
      const hasSystemAudio = display.getAudioTracks().length > 0;
      if (hasSystemAudio || mic) {
        const ctx = new AudioContext();
        ctxRef.current = ctx;
        const dest = ctx.createMediaStreamDestination();
        if (hasSystemAudio) ctx.createMediaStreamSource(new MediaStream(display.getAudioTracks())).connect(dest);
        if (mic) {
          const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          streamsRef.current.push(micStream);
          ctx.createMediaStreamSource(micStream).connect(dest);
        }
        audioTracks = dest.stream.getAudioTracks();
      }
    } catch {
      // Mic denied or audio mixing failed — carry on with whatever we have.
    }

    const combined = new MediaStream([...display.getVideoTracks(), ...audioTracks]);

    // Stop when the user ends sharing via the browser's own bar.
    display.getVideoTracks()[0].addEventListener("ended", () => stop());

    let recorder: MediaRecorder;
    try {
      recorder = new MediaRecorder(combined, { mimeType: pickMime() });
    } catch {
      setError("Recording isn't supported in this browser.");
      cleanupStreams();
      return;
    }
    recorderRef.current = recorder;

    recorder.ondataavailable = (ev) => {
      if (ev.data && ev.data.size > 0) chunksRef.current.push(ev.data);
    };
    recorder.onstop = () => {
      clearTimer();
      cleanupStreams();
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      setUrl(URL.createObjectURL(blob));
      setStatus("recorded");
    };

    recorder.start(1000);
    setElapsed(0);
    startTimer();
    setStatus("recording");
  }

  function pause() {
    recorderRef.current?.pause();
    clearTimer();
    setStatus("paused");
  }

  function resume() {
    recorderRef.current?.resume();
    startTimer();
    setStatus("recording");
  }

  function stop() {
    if (recorderRef.current && recorderRef.current.state !== "inactive") recorderRef.current.stop();
    clearTimer();
  }

  function reset() {
    if (url) URL.revokeObjectURL(url);
    setUrl("");
    setElapsed(0);
    setStatus("idle");
    setError("");
  }

  if (supported === false) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
          <MonitorIcon className="size-8 text-muted-foreground" />
          <div className="font-medium">Screen recording needs a desktop browser</div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Open this page in Chrome, Edge, or Firefox on a computer. Browser screen capture isn&rsquo;t available on phones or
            tablets.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Recorded preview */}
      {status === "recorded" && url ? (
        <div className="flex flex-col gap-4">
          <video src={url} controls className="w-full rounded-xl border border-border bg-black" />
          <div className="flex flex-wrap gap-2">
            <Button render={<a href={url} download={`screen-recording-${fmt(elapsed).replace(":", "m")}s.webm`} />}>
              <DownloadIcon />
              Download (.webm)
            </Button>
            <Button variant="outline" onClick={reset}>
              <RotateCcwIcon />
              Record again
            </Button>
          </div>

          <Card className="border-primary/25 bg-primary/[0.03]">
            <CardContent className="py-4">
              <div className="text-sm font-medium">Next steps</div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Need MP4, a smaller file, a trim, or a GIF? Send your recording straight into another free tool:
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {NEXT_TOOLS.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/tools/${t.slug}`}
                    className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm transition-colors hover:border-primary/40"
                  >
                    {t.label}
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center gap-5 py-10">
            {/* Timer / status */}
            {status === "idle" ? (
              <div className="grid size-16 place-items-center rounded-full bg-primary/10 text-primary">
                <MonitorIcon className="size-7" />
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "inline-block size-3 rounded-full bg-red-500",
                    status === "recording" && "animate-pulse",
                  )}
                />
                <span className="font-mono text-3xl font-semibold tabular-nums">{fmt(elapsed)}</span>
                {status === "paused" && <span className="text-sm text-muted-foreground">(paused)</span>}
              </div>
            )}

            {/* Controls */}
            {status === "idle" && (
              <>
                <button
                  type="button"
                  onClick={() => setMic((m) => !m)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors",
                    mic ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted/50",
                  )}
                >
                  {mic ? <MicIcon className="size-4" /> : <MicOffIcon className="size-4" />}
                  Microphone {mic ? "on" : "off"}
                </button>
                <Button size="lg" onClick={start}>
                  <CircleIcon className="fill-current" />
                  Start recording
                </Button>
                <p className="max-w-sm text-center text-xs text-muted-foreground">
                  You&rsquo;ll pick a screen, window, or tab next. Tick &ldquo;Share audio&rdquo; in the prompt to capture
                  system sound. Nothing is uploaded — it records on your device.
                </p>
              </>
            )}

            {(status === "recording" || status === "paused") && (
              <div className="flex flex-wrap justify-center gap-2">
                {status === "recording" ? (
                  <Button variant="outline" onClick={pause}>
                    <PauseIcon />
                    Pause
                  </Button>
                ) : (
                  <Button variant="outline" onClick={resume}>
                    <PlayIcon />
                    Resume
                  </Button>
                )}
                <Button onClick={stop}>
                  <SquareIcon className="fill-current" />
                  Stop &amp; save
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {error && <p className="text-center text-sm text-destructive">{error}</p>}
    </div>
  );
}
