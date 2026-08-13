"use client";

import * as React from "react";
import { RotateCwIcon, SparklesIcon, Volume2Icon, VolumeXIcon, GiftIcon } from "lucide-react";

import type { CardData, TemplateId } from "@/modules/cards/types";
import { BirthdayClassic } from "@/modules/cards/templates/birthday-classic";
import { BirthdayElegant } from "@/modules/cards/templates/birthday-elegant";
import { BirthdayPlayful } from "@/modules/cards/templates/birthday-playful";
import { BirthdayLuxe } from "@/modules/cards/templates/birthday-luxe";
import { BirthdayNeon } from "@/modules/cards/templates/birthday-neon";
import { playHappyBirthday } from "@/modules/cards/music";

const TEMPLATES: Record<TemplateId, React.ComponentType<{ data: CardData; fireKey?: number }>> = {
  classic: BirthdayClassic,
  elegant: BirthdayElegant,
  playful: BirthdayPlayful,
  luxe: BirthdayLuxe,
  neon: BirthdayNeon,
};

/**
 * Renders a card's animated template inside a positioned parent (which must be
 * `position: relative` with a defined size). When the card has music, it opens
 * behind a "tap to open" layer — that tap is the user gesture browsers require
 * before audio can play, so the music starts reliably (autoplay is blocked).
 */
export function CardStage({ data, cta = true, interactive = true, sound = true }: { data: CardData; cta?: boolean; interactive?: boolean; sound?: boolean }) {
  const Template = TEMPLATES[data.template] ?? BirthdayClassic;
  const musicGate = sound && !!data.music;

  const [fireKey, setFireKey] = React.useState(0);
  const [opened, setOpened] = React.useState(!musicGate);
  const [muted, setMuted] = React.useState(false);
  const ctxRef = React.useRef<AudioContext | null>(null);
  const stopRef = React.useRef<null | (() => void)>(null);

  const playMusic = React.useCallback(() => {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    let ctx = ctxRef.current;
    if (!ctx) { ctx = new Ctor(); ctxRef.current = ctx; }
    if (ctx.state === "suspended") void ctx.resume();
    stopRef.current?.();
    stopRef.current = playHappyBirthday(ctx);
    setMuted(false);
  }, []);

  const stopMusic = React.useCallback(() => {
    stopRef.current?.();
    stopRef.current = null;
    setMuted(true);
  }, []);

  React.useEffect(() => {
    return () => {
      stopRef.current?.();
      try { void ctxRef.current?.close(); } catch { /* ignore */ }
    };
  }, []);

  // Open the card: replay the animation and (if music) start it on this gesture.
  function open() {
    setOpened(true);
    setFireKey((k) => k + 1);
    if (musicGate) playMusic();
  }

  return (
    <div className="absolute inset-0" style={{ containerType: "inline-size" }}>
      <Template data={data} fireKey={fireKey} />

      {opened && musicGate && (
        <button
          type="button"
          onClick={() => (muted ? playMusic() : stopMusic())}
          aria-label={muted ? "Play music" : "Mute music"}
          className="absolute left-3 top-3 z-30 inline-flex items-center gap-1.5 rounded-full bg-black/25 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/40"
        >
          {muted ? <VolumeXIcon className="size-3.5" /> : <Volume2Icon className="size-3.5" />}
          {muted ? "Play music" : "Music"}
        </button>
      )}

      {interactive && (
        <button
          type="button"
          onClick={() => setFireKey((k) => k + 1)}
          aria-label="Replay animation"
          className="absolute right-3 top-3 z-30 inline-flex items-center gap-1.5 rounded-full bg-black/25 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/40"
        >
          <RotateCwIcon className="size-3.5" /> Replay
        </button>
      )}

      {cta && !data.noWatermark && (
        <a
          href="/tools/birthday-card-maker"
          className="absolute bottom-3 left-1/2 z-30 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-black/25 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/40"
        >
          <SparklesIcon className="size-3.5" /> Made with OhoTool — create your own
        </a>
      )}

      {/* Tap-to-open layer — required so browsers allow the music to start. */}
      {!opened && (
        <button
          type="button"
          onClick={open}
          className="absolute inset-0 z-40 grid place-items-center bg-black/60 text-white backdrop-blur-sm"
          aria-label="Open your card"
        >
          <span className="flex flex-col items-center gap-3">
            <GiftIcon className="size-12 animate-bounce" />
            <span className="rounded-full bg-white/15 px-5 py-2.5 text-base font-semibold">Tap to open your card 🎉</span>
            <span className="text-xs opacity-80">with music &amp; animation</span>
          </span>
        </button>
      )}
    </div>
  );
}
