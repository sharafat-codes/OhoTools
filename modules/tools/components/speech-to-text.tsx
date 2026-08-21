"use client";

import * as React from "react";
import { MicIcon, SquareIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/copy-button";

// Minimal typing for the Web Speech API (not in standard lib DOM types).
type SpeechResult = { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }>> };
type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: SpeechResult) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};
type SRCtor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SRCtor;
    webkitSpeechRecognition?: SRCtor;
  }
}

const LANGS = [
  { v: "en-US", l: "English (US)" },
  { v: "en-GB", l: "English (UK)" },
  { v: "ur-PK", l: "Urdu" },
  { v: "hi-IN", l: "Hindi" },
  { v: "ar-SA", l: "Arabic" },
  { v: "es-ES", l: "Spanish" },
  { v: "fr-FR", l: "French" },
];

export function SpeechToText() {
  const [supported, setSupported] = React.useState(true);
  const [listening, setListening] = React.useState(false);
  const [text, setText] = React.useState("");
  const [lang, setLang] = React.useState("en-US");
  const recRef = React.useRef<SpeechRecognitionLike | null>(null);
  const baseRef = React.useRef("");

  React.useEffect(() => {
    setSupported(!!(window.SpeechRecognition || window.webkitSpeechRecognition));
    return () => recRef.current?.stop();
  }, []);

  function start() {
    const SRc = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SRc) return;
    const rec = new SRc();
    recRef.current = rec;
    rec.lang = lang;
    rec.continuous = true;
    rec.interimResults = true;
    baseRef.current = text ? text + " " : "";
    rec.onresult = (e) => {
      let s = "";
      for (let i = e.resultIndex; i < e.results.length; i++) s += e.results[i][0].transcript;
      setText(baseRef.current + s);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.start();
    setListening(true);
  }

  function stop() {
    recRef.current?.stop();
    setListening(false);
  }

  if (!supported) {
    return (
      <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
        Speech recognition isn&apos;t supported in this browser. Try Chrome or Edge (desktop or Android).
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          disabled={listening}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
        >
          {LANGS.map((l) => (
            <option key={l.v} value={l.v}>{l.l}</option>
          ))}
        </select>
        {!listening ? (
          <Button onClick={start}><MicIcon className="size-4" /> Start</Button>
        ) : (
          <Button variant="outline" onClick={stop}><SquareIcon className="size-4" /> Stop</Button>
        )}
        {listening && (
          <span className="flex items-center gap-2 text-sm text-red-500">
            <span className="size-2 animate-pulse rounded-full bg-red-500" /> Listening…
          </span>
        )}
      </div>

      <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} placeholder="Your transcribed text will appear here — start speaking…" />

      <div className="flex gap-2">
        <CopyButton value={text} />
        <Button variant="ghost" size="sm" onClick={() => setText("")}>Clear</Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Uses your browser&apos;s built-in speech recognition — audio is handled by your browser/OS, not our servers.
      </p>
    </div>
  );
}
