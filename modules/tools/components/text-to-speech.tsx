"use client";

import * as React from "react";
import { PlayIcon, PauseIcon, SquareIcon } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

const MAX_CHARS = 5000;
const selectClass =
  "h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

export function TextToSpeech() {
  const [supported, setSupported] = React.useState(true);
  const [voices, setVoices] = React.useState<SpeechSynthesisVoice[]>([]);
  const [voiceName, setVoiceName] = React.useState("");
  const [text, setText] = React.useState("");
  const [rate, setRate] = React.useState(1);
  const [pitch, setPitch] = React.useState(1);
  const [speaking, setSpeaking] = React.useState(false);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    const synth = typeof window !== "undefined" ? window.speechSynthesis : undefined;
    if (!synth) {
      Promise.resolve().then(() => setSupported(false));
      return;
    }
    const load = () => {
      const list = synth.getVoices();
      setVoices(list);
      setVoiceName((cur) => cur || list.find((v) => v.default)?.name || list[0]?.name || "");
    };
    Promise.resolve().then(load);
    synth.onvoiceschanged = load;
    return () => {
      synth.onvoiceschanged = null;
      synth.cancel();
    };
  }, []);

  const tooLong = text.length > MAX_CHARS;

  function play() {
    const synth = window.speechSynthesis;
    if (!synth || !text.trim() || tooLong) return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const v = voices.find((x) => x.name === voiceName);
    if (v) u.voice = v;
    u.rate = rate;
    u.pitch = pitch;
    u.onend = () => {
      setSpeaking(false);
      setPaused(false);
    };
    u.onerror = () => {
      setSpeaking(false);
      setPaused(false);
    };
    synth.speak(u);
    setSpeaking(true);
    setPaused(false);
  }

  function togglePause() {
    const synth = window.speechSynthesis;
    if (!synth) return;
    if (paused) {
      synth.resume();
      setPaused(false);
    } else {
      synth.pause();
      setPaused(true);
    }
  }

  function stop() {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    setPaused(false);
  }

  if (!supported) {
    return (
      <p className="text-sm text-muted-foreground">
        Your browser doesn&apos;t support speech synthesis. Try the latest Chrome, Edge, or Safari.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="tts-in">Your text</Label>
          <span className={`text-xs ${tooLong ? "text-destructive" : "text-muted-foreground"}`}>
            {text.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
          </span>
        </div>
        <Textarea
          id="tts-in"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste text to read aloud…"
          className="min-h-40 text-sm"
        />
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="flex min-w-52 flex-col gap-1.5">
          <Label htmlFor="tts-voice">Voice</Label>
          <select id="tts-voice" value={voiceName} onChange={(e) => setVoiceName(e.target.value)} className={selectClass}>
            {voices.length === 0 && <option value="">Default</option>}
            {voices.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
        </div>
        <div className="flex min-w-40 flex-1 flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label>Speed</Label>
            <span className="text-sm text-muted-foreground">{rate.toFixed(1)}×</span>
          </div>
          <Slider value={[rate]} min={0.5} max={2} step={0.1} onValueChange={(v) => setRate(Array.isArray(v) ? v[0] : v)} />
        </div>
        <div className="flex min-w-40 flex-1 flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label>Pitch</Label>
            <span className="text-sm text-muted-foreground">{pitch.toFixed(1)}</span>
          </div>
          <Slider value={[pitch]} min={0} max={2} step={0.1} onValueChange={(v) => setPitch(Array.isArray(v) ? v[0] : v)} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {!speaking ? (
          <Button onClick={play} disabled={!text.trim() || tooLong}>
            <PlayIcon className="size-4" /> Play
          </Button>
        ) : (
          <>
            <Button variant="outline" onClick={togglePause}>
              {paused ? <PlayIcon className="size-4" /> : <PauseIcon className="size-4" />}
              {paused ? "Resume" : "Pause"}
            </Button>
            <Button variant="ghost" onClick={stop}>
              <SquareIcon className="size-4" /> Stop
            </Button>
          </>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Reads aloud using your device&apos;s built-in voices — nothing is uploaded. Available voices depend on your browser and operating system.
      </p>
    </div>
  );
}
