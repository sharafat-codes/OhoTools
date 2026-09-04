"use client";

import * as React from "react";
import { MicIcon, MicOffIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function MicTest() {
  const streamRef = React.useRef<MediaStream | null>(null);
  const audioCtxRef = React.useRef<AudioContext | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const [active, setActive] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [label, setLabel] = React.useState<string>("");
  const [level, setLevel] = React.useState(0); // 0–100

  const stop = React.useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    setActive(false);
    setLevel(0);
  }, []);

  React.useEffect(() => () => stop(), [stop]);

  async function start() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;
      setLabel(stream.getAudioTracks()[0]?.label || "Microphone");

      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      const data = new Uint8Array(analyser.fftSize);

      const tick = () => {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / data.length);
        setLevel(Math.min(100, Math.round(rms * 220)));
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
      setActive(true);
    } catch (e) {
      const name = e instanceof DOMException ? e.name : "";
      setError(
        name === "NotAllowedError"
          ? "Microphone access was blocked. Allow mic permission in your browser and try again."
          : name === "NotFoundError"
            ? "No microphone was found on this device."
            : "Couldn't start the microphone. Make sure no other app is using it and try again.",
      );
      setActive(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Input level</span>
          <span className="tabular-nums font-medium">{level}%</span>
        </div>
        <div className="h-4 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-75"
            style={{ width: `${level}%` }}
          />
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          {active
            ? "Speak into your mic — the bar should move. If it stays flat, your mic isn't picking up sound."
            : "Click “Start microphone” and speak to see your input level."}
        </p>
      </div>

      {error && (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {active && label && (
        <div className="rounded-lg border border-border bg-card p-3 text-sm">
          <div className="text-muted-foreground">Microphone</div>
          <div className="mt-0.5 truncate font-medium">{label}</div>
        </div>
      )}

      <div>
        {active ? (
          <Button variant="outline" onClick={stop}>
            <MicOffIcon /> Stop microphone
          </Button>
        ) : (
          <Button onClick={start}>
            <MicIcon /> Start microphone
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Your audio never leaves your device — the level meter runs entirely in your browser.
      </p>
    </div>
  );
}
