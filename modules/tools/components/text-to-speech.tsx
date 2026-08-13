"use client";

import * as React from "react";
import { PlayIcon, PauseIcon, SquareIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type PlayState = "idle" | "playing" | "paused";

export function TextToSpeech() {
  const [supported, setSupported] = React.useState(true);
  const [text, setText] = React.useState(
    "Hello! Type or paste any text here and press play to hear it read aloud.",
  );
  const [voices, setVoices] = React.useState<SpeechSynthesisVoice[]>([]);
  const [voiceName, setVoiceName] = React.useState<string>("");
  const [rate, setRate] = React.useState(1);
  const [pitch, setPitch] = React.useState(1);
  const [volume, setVolume] = React.useState(1);
  const [state, setState] = React.useState<PlayState>("idle");

  React.useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }
    const load = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length) {
        setVoices(v);
        setVoiceName((cur) => cur || v.find((x) => x.default)?.name || v[0].name);
      }
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel();
    };
  }, []);

  function play() {
    if (!supported) return;
    const synth = window.speechSynthesis;
    if (state === "paused") { synth.resume(); setState("playing"); return; }
    synth.cancel();
    if (!text.trim()) return;
    const u = new SpeechSynthesisUtterance(text);
    const v = voices.find((x) => x.name === voiceName);
    if (v) u.voice = v;
    u.rate = rate;
    u.pitch = pitch;
    u.volume = volume;
    u.onend = () => setState("idle");
    u.onerror = () => setState("idle");
    synth.speak(u);
    setState("playing");
  }

  function pause() {
    if (!supported) return;
    window.speechSynthesis.pause();
    setState("paused");
  }

  function stop() {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setState("idle");
  }

  if (!supported) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
        Your browser doesn&apos;t support the built-in speech engine. Try the latest Chrome, Edge, or Safari.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        placeholder="Type or paste text to read aloud…"
        className="w-full resize-y rounded-xl border border-border bg-card p-4 text-sm outline-none focus:border-primary/40"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{text.length} characters</span>
        <span>{state === "playing" ? "Speaking…" : state === "paused" ? "Paused" : "Ready"}</span>
      </div>

      {/* Voice + sliders */}
      <div className="grid gap-4 rounded-xl border border-border bg-muted/30 p-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          <span className="font-medium">Voice</span>
          <select
            value={voiceName}
            onChange={(e) => setVoiceName(e.target.value)}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary/40"
          >
            {voices.length === 0 && <option>Loading voices…</option>}
            {voices.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name} ({v.lang}){v.default ? " — default" : ""}
              </option>
            ))}
          </select>
        </label>

        <Slider label="Speed" value={rate} min={0.5} max={2} step={0.1} onChange={setRate} suffix="×" />
        <Slider label="Pitch" value={pitch} min={0} max={2} step={0.1} onChange={setPitch} />
        <Slider label="Volume" value={volume} min={0} max={1} step={0.1} onChange={setVolume} suffix="" percent />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button onClick={play} className="min-w-32">
          {state === "playing" ? <PauseIcon className="size-4" /> : <PlayIcon className="size-4" />}
          {state === "paused" ? "Resume" : state === "playing" ? "Speaking" : "Play"}
        </Button>
        {state === "playing" && (
          <Button variant="outline" onClick={pause}>
            <PauseIcon className="size-4" /> Pause
          </Button>
        )}
        <Button variant="outline" onClick={stop} disabled={state === "idle"}>
          <SquareIcon className="size-4" /> Stop
        </Button>
      </div>
    </div>
  );
}

function Slider({
  label, value, min, max, step, onChange, suffix = "", percent = false,
}: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (n: number) => void; suffix?: string; percent?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="flex items-center justify-between">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums text-muted-foreground">
          {percent ? `${Math.round(value * 100)}%` : `${value.toFixed(1)}${suffix}`}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-primary"
      />
    </label>
  );
}
