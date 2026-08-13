"use client";

import * as React from "react";
import { Volume2Icon, VolumeXIcon } from "lucide-react";

import { playHappyBirthday } from "@/modules/cards/music";

// Plays the synthesized melody. Browsers block autoplay, so it starts on the
// first user gesture (a tap anywhere) and can be toggled with the button.
export function MusicController() {
  const ctxRef = React.useRef<AudioContext | null>(null);
  const stopRef = React.useRef<null | (() => void)>(null);
  const doneTimer = React.useRef<number | null>(null);
  const [playing, setPlaying] = React.useState(false);
  const started = React.useRef(false);

  const stop = React.useCallback(() => {
    stopRef.current?.();
    stopRef.current = null;
    if (doneTimer.current) window.clearTimeout(doneTimer.current);
    setPlaying(false);
  }, []);

  const start = React.useCallback(() => {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    let ctx = ctxRef.current;
    if (!ctx) { ctx = new Ctor(); ctxRef.current = ctx; }
    if (ctx.state === "suspended") void ctx.resume();
    stopRef.current?.();
    stopRef.current = playHappyBirthday(ctx);
    setPlaying(true);
    if (doneTimer.current) window.clearTimeout(doneTimer.current);
    doneTimer.current = window.setTimeout(() => setPlaying(false), 11000);
  }, []);

  React.useEffect(() => {
    function onFirst() {
      if (started.current) return;
      started.current = true;
      start();
    }
    window.addEventListener("pointerdown", onFirst, { once: true });
    return () => {
      window.removeEventListener("pointerdown", onFirst);
      stopRef.current?.();
      if (doneTimer.current) window.clearTimeout(doneTimer.current);
      try { void ctxRef.current?.close(); } catch { /* ignore */ }
    };
  }, [start]);

  return (
    <button
      type="button"
      onClick={() => (playing ? stop() : start())}
      aria-label={playing ? "Mute music" : "Play music"}
      className="absolute left-3 top-3 z-30 inline-flex items-center gap-1.5 rounded-full bg-black/25 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/40"
    >
      {playing ? <Volume2Icon className="size-3.5" /> : <VolumeXIcon className="size-3.5" />}
      {playing ? "Music" : "Play music"}
    </button>
  );
}
