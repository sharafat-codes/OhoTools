"use client";

import * as React from "react";
import { MicIcon, SquareIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function VoiceRecorder() {
  const [recording, setRecording] = React.useState(false);
  const [url, setUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState("");
  const [seconds, setSeconds] = React.useState(0);
  const recorderRef = React.useRef<MediaRecorder | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);
  const streamRef = React.useRef<MediaStream | null>(null);
  const timerRef = React.useRef<number | null>(null);
  const urlRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, []);

  async function start() {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mr.ondataavailable = (e) => { if (e.data.size) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mr.mimeType || "audio/webm" });
        if (urlRef.current) URL.revokeObjectURL(urlRef.current);
        const u = URL.createObjectURL(blob);
        urlRef.current = u;
        setUrl(u);
        stream.getTracks().forEach((t) => t.stop());
      };
      recorderRef.current = mr;
      if (urlRef.current) { URL.revokeObjectURL(urlRef.current); urlRef.current = null; setUrl(null); }
      mr.start();
      setRecording(true);
      setSeconds(0);
      timerRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      setError("Couldn't access your microphone. Allow mic permission in your browser and try again.");
    }
  }

  function stop() {
    recorderRef.current?.stop();
    setRecording(false);
    if (timerRef.current) window.clearInterval(timerRef.current);
  }

  function download() {
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = "recording.webm";
    a.click();
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8">
        <div className="font-heading text-4xl font-semibold tabular-nums">{mm}:{ss}</div>
        {!recording ? (
          <Button size="lg" onClick={start}>
            <MicIcon className="size-4" /> {url ? "Record again" : "Start recording"}
          </Button>
        ) : (
          <Button size="lg" variant="outline" onClick={stop}>
            <SquareIcon className="size-4" /> Stop
          </Button>
        )}
        {recording && (
          <span className="flex items-center gap-2 text-sm text-red-500">
            <span className="size-2 animate-pulse rounded-full bg-red-500" /> Recording…
          </span>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {url && !recording && (
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
          <audio controls src={url} className="w-full" />
          <Button variant="outline" onClick={download} className="w-fit">Download recording</Button>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Records with your device microphone entirely in your browser — nothing is uploaded.
      </p>
    </div>
  );
}
