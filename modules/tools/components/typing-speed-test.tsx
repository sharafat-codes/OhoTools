"use client";

import * as React from "react";
import {
  RotateCcwIcon, TrophyIcon, TypeIcon, HashIcon, QuoteIcon, ClockIcon,
  Share2Icon, DownloadIcon, CheckIcon, Volume2Icon, VolumeXIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type TestType = "time" | "words" | "quote";
type Status = "idle" | "running" | "done";

const TIME_OPTIONS = [15, 30, 60, 120] as const;
const WORD_OPTIONS = [10, 25, 50, 100] as const;
const SHARE_URL = "https://ohotool.com/tools/typing-speed-test";

const WORD_BANK = [
  "the", "of", "and", "to", "in", "is", "you", "that", "it", "he", "was", "for", "on", "are",
  "as", "with", "his", "they", "at", "be", "this", "have", "from", "or", "one", "had", "by",
  "word", "but", "not", "what", "all", "were", "we", "when", "your", "can", "said", "there",
  "use", "an", "each", "which", "she", "do", "how", "their", "if", "will", "up", "other",
  "about", "out", "many", "then", "them", "these", "so", "some", "her", "would", "make",
  "like", "him", "into", "time", "has", "look", "two", "more", "write", "go", "see", "number",
  "no", "way", "could", "people", "my", "than", "first", "water", "been", "call", "who", "oil",
  "its", "now", "find", "long", "down", "day", "did", "get", "come", "made", "may", "part",
  "over", "new", "sound", "take", "only", "little", "work", "know", "place", "year", "live",
  "me", "back", "give", "most", "very", "after", "thing", "our", "just", "name", "good",
  "sentence", "man", "think", "say", "great", "where", "help", "through", "much", "before",
  "line", "right", "too", "mean", "old", "any", "same", "tell", "boy", "follow", "came",
  "want", "show", "also", "around", "form", "three", "small", "set", "put", "end", "does",
  "another", "well", "large", "must", "big", "even", "such", "because", "turn", "here", "why",
  "world", "build", "system", "design", "value", "problem", "simple", "change", "better", "focus",
];

const QUOTES = [
  "The quick brown fox jumps over the lazy dog.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The only way to do great work is to love what you do.",
  "Simplicity is the ultimate sophistication.",
  "The best way to predict the future is to invent it.",
  "Do not watch the clock; do what it does, keep going.",
  "It always seems impossible until it is done.",
  "Quality is not an act, it is a habit.",
  "Code is like humor. When you have to explain it, it is bad.",
  "First, solve the problem. Then, write the code.",
  "Experience is the name everyone gives to their mistakes.",
  "The function of good software is to make the complex appear simple.",
];

function randInt(n: number) {
  return Math.floor(Math.random() * n);
}

function makeStream(count: number, punctuation: boolean, numbers: boolean): string[] {
  const out: string[] = [];
  let prev = "";
  for (let i = 0; i < count; i++) {
    let w: string;
    if (numbers && Math.random() < 0.12) {
      w = String(randInt(9000) + 10);
    } else {
      w = WORD_BANK[randInt(WORD_BANK.length)];
      if (w === prev) w = WORD_BANK[(WORD_BANK.indexOf(w) + 1) % WORD_BANK.length];
      if (punctuation) {
        const r = Math.random();
        if (r < 0.1) w += ",";
        else if (r < 0.16) w += ".";
        else if (r < 0.19) w += ";";
        else if (r < 0.22) w += "?";
        else if (r < 0.24) w += "!";
      }
    }
    prev = w.replace(/[^a-z]/gi, "");
    out.push(w);
  }
  if (punctuation) {
    let cap = true;
    for (let i = 0; i < out.length; i++) {
      if (cap && /^[a-z]/.test(out[i])) out[i] = out[i][0].toUpperCase() + out[i].slice(1);
      cap = /[.!?]$/.test(out[i]);
    }
    if (out.length && /^[a-z]/.test(out[0])) out[0] = out[0][0].toUpperCase() + out[0].slice(1);
  }
  return out;
}

type Tally = { correct: number; incorrect: number; extra: number; missed: number; typedChars: number };

function tally(typed: string[], input: string, wordIndex: number, words: string[]): Tally {
  let correct = 0, incorrect = 0, extra = 0, missed = 0, typedChars = 0;
  for (let i = 0; i < wordIndex; i++) {
    const t = typed[i] ?? "";
    const target = words[i] ?? "";
    typedChars += t.length + 1;
    const n = Math.min(t.length, target.length);
    for (let j = 0; j < n; j++) t[j] === target[j] ? correct++ : incorrect++;
    if (t.length < target.length) missed += target.length - t.length;
    if (t.length > target.length) extra += t.length - target.length;
    if (t === target) correct++;
  }
  const t = input;
  const target = words[wordIndex] ?? "";
  typedChars += t.length;
  const n = Math.min(t.length, target.length);
  for (let j = 0; j < n; j++) t[j] === target[j] ? correct++ : incorrect++;
  if (t.length > target.length) extra += t.length - target.length;
  return { correct, incorrect, extra, missed, typedChars };
}

function consistency(samples: number[]): number {
  if (samples.length < 2) return 100;
  const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
  if (mean <= 0) return 0;
  const variance = samples.reduce((a, b) => a + (b - mean) ** 2, 0) / samples.length;
  const cv = Math.sqrt(variance) / mean;
  return Math.max(0, Math.min(100, Math.round((1 - cv) * 100)));
}

type Result = {
  wpm: number; raw: number; accuracy: number; consistency: number;
  correct: number; incorrect: number; extra: number; missed: number;
};

export function TypingSpeedTest() {
  const [testType, setTestType] = React.useState<TestType>("time");
  const [timeSetting, setTimeSetting] = React.useState<number>(30);
  const [wordsSetting, setWordsSetting] = React.useState<number>(25);
  const [punctuation, setPunctuation] = React.useState(false);
  const [numbers, setNumbers] = React.useState(false);
  const [sound, setSound] = React.useState(true);

  const [status, setStatus] = React.useState<Status>("idle");
  const [words, setWords] = React.useState<string[]>([]);
  const [wordIndex, setWordIndex] = React.useState(0);
  const [input, setInput] = React.useState("");
  const [typed, setTyped] = React.useState<string[]>([]);
  const [remaining, setRemaining] = React.useState<number>(30);
  const [liveWpm, setLiveWpm] = React.useState(0);
  const [result, setResult] = React.useState<Result | null>(null);
  const [wpmSamples, setWpmSamples] = React.useState<number[]>([]);
  const [best, setBest] = React.useState<Record<string, number>>({});
  const [focused, setFocused] = React.useState(false);
  const [caret, setCaret] = React.useState({ left: 0, top: 0, h: 0, show: false });

  const wordsRef = React.useRef<string[]>([]);
  const typedRef = React.useRef<string[]>([]);
  const inputRef = React.useRef("");
  const wordIndexRef = React.useRef(0);
  const startRef = React.useRef(0);
  const lastSampleSecRef = React.useRef(0);
  const samplesRef = React.useRef<number[]>([]);
  const bestRef = React.useRef<Record<string, number>>({});
  const timerRef = React.useRef<number | null>(null);
  const boxRef = React.useRef<HTMLDivElement>(null);
  const rowsRef = React.useRef<HTMLDivElement>(null);
  const currentWordRef = React.useRef<HTMLSpanElement>(null);
  const caretAnchorRef = React.useRef<HTMLSpanElement>(null);
  const audioRef = React.useRef<AudioContext | null>(null);
  const soundRef = React.useRef(true);

  React.useEffect(() => { soundRef.current = sound; }, [sound]);

  const cfg = React.useMemo(
    () => ({ testType, timeSetting, wordsSetting, punctuation, numbers }),
    [testType, timeSetting, wordsSetting, punctuation, numbers],
  );

  function bestKey(c = cfg) {
    if (c.testType === "quote") return "quote";
    const base = c.testType === "time" ? `time-${c.timeSetting}` : `words-${c.wordsSetting}`;
    return `${base}-p${c.punctuation ? 1 : 0}-n${c.numbers ? 1 : 0}`;
  }

  function playError() {
    if (!soundRef.current) return;
    try {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      let ctx = audioRef.current;
      if (!ctx) { ctx = new Ctor(); audioRef.current = ctx; }
      if (ctx.state === "suspended") void ctx.resume();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = 150;
      const t = ctx.currentTime;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.07, t + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + 0.1);
    } catch {
      /* ignore */
    }
  }

  const stopLoop = React.useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const buildWords = React.useCallback((c: typeof cfg): string[] => {
    if (c.testType === "quote") return QUOTES[randInt(QUOTES.length)].split(/\s+/);
    const count = c.testType === "words" ? c.wordsSetting : Math.max(c.timeSetting * 5, 60);
    return makeStream(count, c.punctuation, c.numbers);
  }, []);

  const newTest = React.useCallback(
    (c: typeof cfg) => {
      stopLoop();
      const w = buildWords(c);
      wordsRef.current = w;
      typedRef.current = [];
      inputRef.current = "";
      wordIndexRef.current = 0;
      samplesRef.current = [];
      lastSampleSecRef.current = 0;
      setWords(w);
      setTyped([]);
      setInput("");
      setWordIndex(0);
      setResult(null);
      setWpmSamples([]);
      setLiveWpm(0);
      setRemaining(c.testType === "time" ? c.timeSetting : 0);
      setStatus("idle");
      boxRef.current?.focus();
    },
    [buildWords, stopLoop],
  );

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("ohotool.typing.best");
      if (raw) {
        const parsed = JSON.parse(raw);
        bestRef.current = parsed;
        setBest(parsed);
      }
    } catch {
      /* ignore */
    }
    newTest({ testType: "time", timeSetting: 30, wordsSetting: 25, punctuation: false, numbers: false });
    return () => {
      stopLoop();
      try { void audioRef.current?.close(); } catch { /* ignore */ }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    currentWordRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [wordIndex]);

  // Position the sliding caret at the current character (measured before paint).
  React.useLayoutEffect(() => {
    const a = caretAnchorRef.current;
    if (!a || status === "done") {
      setCaret((c) => ({ ...c, show: false }));
      return;
    }
    setCaret({ left: a.offsetLeft, top: a.offsetTop, h: a.offsetHeight || 28, show: true });
  }, [input, wordIndex, words, status, focused]);

  function finish(elapsedMs: number) {
    stopLoop();
    const minutes = Math.max(elapsedMs / 60000, 0.0001);
    const t = tally(typedRef.current, inputRef.current, wordIndexRef.current, wordsRef.current);
    const wpm = Math.round(t.correct / 5 / minutes);
    const raw = Math.round(t.typedChars / 5 / minutes);
    const denom = t.correct + t.incorrect + t.extra;
    const accuracy = denom > 0 ? Math.round((t.correct / denom) * 100) : 100;
    setResult({
      wpm, raw, accuracy, consistency: consistency(samplesRef.current),
      correct: t.correct, incorrect: t.incorrect, extra: t.extra, missed: t.missed,
    });
    setWpmSamples(samplesRef.current.slice());
    setStatus("done");

    const key = bestKey();
    if (wpm > (bestRef.current[key] ?? 0)) {
      const next = { ...bestRef.current, [key]: wpm };
      bestRef.current = next;
      setBest(next);
      try { localStorage.setItem("ohotool.typing.best", JSON.stringify(next)); } catch { /* ignore */ }
    }
  }

  function startLoop() {
    startRef.current = performance.now();
    lastSampleSecRef.current = 0;
    timerRef.current = window.setInterval(() => {
      const elapsed = (performance.now() - startRef.current) / 1000;
      const t = tally(typedRef.current, inputRef.current, wordIndexRef.current, wordsRef.current);
      const wpm = elapsed > 0 ? Math.round(t.correct / 5 / (elapsed / 60)) : 0;
      setLiveWpm(wpm);
      const sec = Math.floor(elapsed);
      if (sec > lastSampleSecRef.current) {
        lastSampleSecRef.current = sec;
        samplesRef.current.push(wpm);
      }
      if (testType === "time") {
        const left = timeSetting - elapsed;
        if (left <= 0) { setRemaining(0); finish(timeSetting * 1000); }
        else setRemaining(left);
      }
    }, 100);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Tab" || e.key === "Escape" || e.key === "Enter") {
      e.preventDefault();
      newTest(cfg);
      return;
    }
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (status === "done") return;

    if (e.key === " ") {
      e.preventDefault();
      if (inputRef.current.length === 0) return;
      const nextTyped = typedRef.current.slice();
      nextTyped[wordIndexRef.current] = inputRef.current;
      const nextIndex = wordIndexRef.current + 1;
      typedRef.current = nextTyped;
      inputRef.current = "";
      wordIndexRef.current = nextIndex;
      setTyped(nextTyped);
      setInput("");
      setWordIndex(nextIndex);
      if (nextIndex >= wordsRef.current.length) finish(performance.now() - startRef.current);
      return;
    }

    if (e.key === "Backspace") {
      e.preventDefault();
      if (inputRef.current.length > 0) {
        const v = inputRef.current.slice(0, -1);
        inputRef.current = v;
        setInput(v);
      } else if (wordIndexRef.current > 0) {
        const pi = wordIndexRef.current - 1;
        const restored = typedRef.current[pi] ?? "";
        const nextTyped = typedRef.current.slice(0, pi);
        typedRef.current = nextTyped;
        inputRef.current = restored;
        wordIndexRef.current = pi;
        setTyped(nextTyped);
        setInput(restored);
        setWordIndex(pi);
      }
      return;
    }

    if (e.key.length === 1) {
      e.preventDefault();
      if (status === "idle") { setStatus("running"); startLoop(); }
      const target = wordsRef.current[wordIndexRef.current] ?? "";
      const pos = inputRef.current.length;
      if (pos > target.length + 8) return;
      if (e.key !== target[pos]) playError();
      const v = inputRef.current + e.key;
      inputRef.current = v;
      setInput(v);
    }
  }

  const bestForCfg = best[bestKey()] ?? 0;
  const progressLabel =
    testType === "time" ? `${Math.ceil(remaining)}` : `${Math.min(wordIndex, words.length)}/${words.length}`;
  const modeLabel = testType === "time" ? `${timeSetting}s` : testType === "words" ? `${wordsSetting} words` : "quote";

  return (
    <div className="flex flex-col items-center gap-5">
      {status !== "done" && (
        <div className="flex w-full max-w-2xl flex-col gap-3 rounded-xl border border-border bg-muted/30 p-3">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <TypePill icon={<ClockIcon className="size-3.5" />} label="Time" active={testType === "time"} onClick={() => { setTestType("time"); newTest({ ...cfg, testType: "time" }); }} />
            <TypePill icon={<TypeIcon className="size-3.5" />} label="Words" active={testType === "words"} onClick={() => { setTestType("words"); newTest({ ...cfg, testType: "words" }); }} />
            <TypePill icon={<QuoteIcon className="size-3.5" />} label="Quote" active={testType === "quote"} onClick={() => { setTestType("quote"); newTest({ ...cfg, testType: "quote" }); }} />

            {testType !== "quote" && <span className="mx-1 h-4 w-px bg-border" />}

            {testType === "time" &&
              TIME_OPTIONS.map((d) => (
                <Pill key={d} active={timeSetting === d} onClick={() => { setTimeSetting(d); newTest({ ...cfg, testType: "time", timeSetting: d }); }}>{d}s</Pill>
              ))}
            {testType === "words" &&
              WORD_OPTIONS.map((d) => (
                <Pill key={d} active={wordsSetting === d} onClick={() => { setWordsSetting(d); newTest({ ...cfg, testType: "words", wordsSetting: d }); }}>{d}</Pill>
              ))}

            {testType !== "quote" && (
              <>
                <span className="mx-1 h-4 w-px bg-border" />
                <Pill active={punctuation} onClick={() => { const v = !punctuation; setPunctuation(v); newTest({ ...cfg, punctuation: v }); }}>
                  <HashIcon className="mr-1 inline size-3" />punctuation
                </Pill>
                <Pill active={numbers} onClick={() => { const v = !numbers; setNumbers(v); newTest({ ...cfg, numbers: v }); }}>numbers</Pill>
              </>
            )}

            <span className="mx-1 h-4 w-px bg-border" />
            <button
              type="button"
              onClick={() => setSound((s) => !s)}
              aria-label={sound ? "Mute error sound" : "Enable error sound"}
              className={"grid size-7 place-items-center rounded-full border transition-colors " + (sound ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/40")}
            >
              {sound ? <Volume2Icon className="size-3.5" /> : <VolumeXIcon className="size-3.5" />}
            </button>
          </div>
        </div>
      )}

      {status === "done" && result ? (
        <Results result={result} samples={wpmSamples} best={bestForCfg} mode={modeLabel} onRestart={() => newTest(cfg)} />
      ) : (
        <>
          <div className="flex w-full max-w-2xl items-end justify-between">
            <div>
              <div className="text-4xl font-bold tabular-nums text-primary">{progressLabel}</div>
              <div className="text-xs text-muted-foreground">{testType === "time" ? "seconds left" : testType === "words" ? "words" : "progress"}</div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold tabular-nums">{status === "running" ? liveWpm : 0}</div>
              <div className="text-xs text-muted-foreground">live WPM</div>
            </div>
          </div>

          <div
            ref={boxRef}
            tabIndex={0}
            role="textbox"
            aria-label="Typing test — type the words shown"
            onKeyDown={onKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={
              "relative h-36 w-full max-w-2xl overflow-hidden rounded-2xl border-2 p-5 text-2xl leading-relaxed outline-none transition-colors " +
              (focused ? "border-primary/50 bg-card" : "border-dashed border-border bg-muted/30")
            }
          >
            {!focused && (
              <div className="absolute inset-0 z-10 grid place-items-center rounded-2xl bg-background/70 backdrop-blur-[1px]">
                <span className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium">
                  {status === "idle" ? "Click here and start typing" : "Click to resume"}
                </span>
              </div>
            )}
            <div ref={rowsRef} className="relative flex flex-wrap gap-x-2 gap-y-1">
              {caret.show && focused && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-0 top-0 w-0.5 rounded-full bg-primary animate-pulse"
                  style={{ height: `${caret.h}px`, transform: `translate(${caret.left}px, ${caret.top}px)`, transition: "transform 90ms ease" }}
                />
              )}
              {words.length === 0 ? (
                <span className="text-muted-foreground">Loading…</span>
              ) : (
                words.map((w, i) => (
                  <Word
                    key={i}
                    wordRef={i === wordIndex ? currentWordRef : undefined}
                    caretRef={i === wordIndex ? caretAnchorRef : undefined}
                    target={w}
                    typedValue={i < wordIndex ? typed[i] ?? "" : i === wordIndex ? input : ""}
                    state={i < wordIndex ? "done" : i === wordIndex ? "current" : "future"}
                  />
                ))
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Timer starts on your first keystroke.</span>
            <button type="button" onClick={() => newTest(cfg)} className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 font-medium text-foreground hover:border-primary/40">
              <RotateCcwIcon className="size-3" /> Restart (Tab / Enter)
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function Results({ result, samples, best, mode, onRestart }: {
  result: Result; samples: number[]; best: number; mode: string; onRestart: () => void;
}) {
  const [copied, setCopied] = React.useState(false);

  function saveImage() {
    const c = document.createElement("canvas");
    c.width = 1200; c.height = 675;
    const x = c.getContext("2d");
    if (!x) return;
    const grad = x.createLinearGradient(0, 0, 1200, 675);
    grad.addColorStop(0, "#0f172a");
    grad.addColorStop(1, "#1e3a5f");
    x.fillStyle = grad; x.fillRect(0, 0, 1200, 675);
    x.textAlign = "center";
    x.fillStyle = "#93c5fd"; x.font = "600 34px 'Segoe UI', Arial, sans-serif";
    x.fillText("OhoTool · Typing Speed Test", 600, 110);
    x.fillStyle = "#ffffff"; x.font = "800 210px 'Segoe UI', Arial, sans-serif";
    x.fillText(String(result.wpm), 600, 380);
    x.fillStyle = "#93c5fd"; x.font = "600 44px 'Segoe UI', Arial, sans-serif";
    x.fillText("WPM", 600, 440);
    x.fillStyle = "#cbd5e1"; x.font = "500 38px 'Segoe UI', Arial, sans-serif";
    x.fillText(`${result.accuracy}% accuracy   ·   ${result.consistency}% consistency   ·   ${mode}`, 600, 530);
    x.fillStyle = "#94a3b8"; x.font = "500 30px 'Segoe UI', Arial, sans-serif";
    x.fillText("ohotool.com/tools/typing-speed-test", 600, 620);
    c.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `typing-${result.wpm}wpm.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }

  async function share() {
    const text = `I typed ${result.wpm} WPM (${result.accuracy}% accuracy) on OhoTool's typing speed test! Can you beat me?`;
    const nav = navigator as Navigator & { share?: (d: { title?: string; text?: string; url?: string }) => Promise<void> };
    if (nav.share) {
      try { await nav.share({ title: "Typing Speed Test", text, url: SHARE_URL }); return; } catch { /* fall through */ }
    }
    try {
      await navigator.clipboard.writeText(`${text} ${SHARE_URL}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch { /* ignore */ }
  }

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-5 py-4">
      {/* Shareable branded card */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-6 text-center">
        <div className="text-xs font-medium uppercase tracking-wide text-primary">OhoTool · Typing Speed Test</div>
        <div className="mt-3 flex items-end justify-center gap-8">
          <div>
            <div className="text-7xl font-bold leading-none tabular-nums text-emerald-500">{result.wpm}</div>
            <div className="mt-1 text-sm font-medium text-muted-foreground">WPM</div>
          </div>
          <div className="pb-2">
            <div className="text-3xl font-bold tabular-nums">{result.accuracy}%</div>
            <div className="text-xs text-muted-foreground">accuracy</div>
          </div>
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          {result.consistency}% consistency · {mode} · raw {result.raw}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button onClick={onRestart} className="min-w-40">
          <RotateCcwIcon className="size-4" /> Next test (Tab)
        </Button>
        <Button variant="outline" onClick={saveImage}>
          <DownloadIcon className="size-4" /> Save image
        </Button>
        <Button variant="outline" onClick={share}>
          {copied ? <CheckIcon className="size-4 text-emerald-500" /> : <Share2Icon className="size-4" />}
          {copied ? "Copied!" : "Share"}
        </Button>
      </div>

      {samples.length > 1 && <WpmChart samples={samples} />}

      <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Raw WPM" value={String(result.raw)} />
        <Stat label="Consistency" value={`${result.consistency}%`} />
        <Stat label="Characters" value={`${result.correct}/${result.incorrect}/${result.extra}/${result.missed}`} sub="correct/wrong/extra/missed" />
        <Stat label="Best" value={best > 0 ? String(best) : "—"} icon={<TrophyIcon className="size-3.5 text-amber-500" />} />
      </div>
    </div>
  );
}

function WpmChart({ samples }: { samples: number[] }) {
  const W = 600, H = 120, pad = 6;
  const max = Math.max(...samples, 10);
  const pts = samples.map((s, i) => {
    const x = pad + (i / (samples.length - 1)) * (W - pad * 2);
    const y = H - pad - (s / max) * (H - pad * 2);
    return [x, y] as const;
  });
  const line = pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${pad},${H - pad} ${line} ${W - pad},${H - pad}`;
  return (
    <div className="w-full rounded-xl border border-border bg-card p-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-28 w-full" preserveAspectRatio="none">
        <polygon points={area} className="fill-primary/10" />
        <polyline points={line} fill="none" className="stroke-primary" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <div className="mt-1 text-center text-xs text-muted-foreground">WPM over time (peak {max})</div>
    </div>
  );
}

function Word({ target, typedValue, state, wordRef, caretRef }: {
  target: string;
  typedValue: string;
  state: "done" | "current" | "future";
  wordRef?: React.Ref<HTMLSpanElement>;
  caretRef?: React.Ref<HTMLSpanElement>;
}) {
  if (state === "future") {
    return <span ref={wordRef} className="text-muted-foreground/50">{target}</span>;
  }
  const chars = target.split("");
  const extra = typedValue.slice(target.length).split("");
  const caretAt = typedValue.length;
  const anchor = <span ref={caretRef} className="inline-block w-0 align-baseline" style={{ height: "1.15em" }} aria-hidden />;
  return (
    <span ref={wordRef}>
      {chars.map((c, j) => {
        let cls = "text-muted-foreground/50";
        if (j < typedValue.length) cls = typedValue[j] === c ? "text-foreground" : "text-red-500 underline decoration-red-500/60";
        return (
          <React.Fragment key={j}>
            {state === "current" && j === caretAt && anchor}
            <span className={cls}>{c}</span>
          </React.Fragment>
        );
      })}
      {extra.map((c, j) => (
        <span key={"x" + j} className="text-red-500 underline decoration-red-500/60">{c}</span>
      ))}
      {state === "current" && caretAt >= target.length && anchor}
    </span>
  );
}

function TypePill({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={"inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors " + (active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
    >
      {icon}{label}
    </button>
  );
}

function Pill({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={"rounded-full border px-3 py-1 text-xs font-medium transition-colors " + (active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/40")}
    >
      {children}
    </button>
  );
}

function Stat({ label, value, sub, icon }: { label: string; value: string; sub?: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3 text-center">
      <div className="flex items-center justify-center gap-1 text-lg font-semibold tabular-nums">{icon}{value}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
      {sub && <div className="mt-0.5 text-[10px] text-muted-foreground/70">{sub}</div>}
    </div>
  );
}
