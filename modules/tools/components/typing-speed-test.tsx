"use client";

import * as React from "react";
import { GaugeIcon, RotateCcwIcon, TrophyIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

const DURATIONS = [15, 30, 60] as const;
type Duration = (typeof DURATIONS)[number];
type Status = "idle" | "running" | "done";

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
];

function makeWords(n: number): string[] {
  const out: string[] = [];
  let prev = -1;
  for (let i = 0; i < n; i++) {
    let idx = Math.floor(Math.random() * WORD_BANK.length);
    if (idx === prev) idx = (idx + 1) % WORD_BANK.length;
    prev = idx;
    out.push(WORD_BANK[idx]);
  }
  return out;
}

type Result = { wpm: number; raw: number; accuracy: number };

export function TypingSpeedTest() {
  const [duration, setDuration] = React.useState<Duration>(30);
  const [status, setStatus] = React.useState<Status>("idle");
  const [words, setWords] = React.useState<string[]>([]);
  const [wordIndex, setWordIndex] = React.useState(0);
  const [input, setInput] = React.useState("");
  const [typed, setTyped] = React.useState<string[]>([]);
  const [remaining, setRemaining] = React.useState<number>(30);
  const [result, setResult] = React.useState<Result | null>(null);
  const [best, setBest] = React.useState<Record<number, number>>({});
  const [focused, setFocused] = React.useState(false);

  const startRef = React.useRef(0);
  const elapsedMsRef = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);
  const boxRef = React.useRef<HTMLDivElement>(null);
  const currentWordRef = React.useRef<HTMLSpanElement>(null);

  // Generate words on the client only (avoids SSR/client hydration mismatch).
  React.useEffect(() => {
    setWords(makeWords(220));
    try {
      const raw = localStorage.getItem("ohotool.typing.best");
      if (raw) setBest(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const stopLoop = React.useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  React.useEffect(() => stopLoop, [stopLoop]);

  // Keep the active word in view as it scrolls.
  React.useEffect(() => {
    currentWordRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [wordIndex]);

  function tick() {
    const elapsed = (performance.now() - startRef.current) / 1000;
    const left = duration - elapsed;
    if (left <= 0) {
      elapsedMsRef.current = duration * 1000;
      stopLoop();
      setRemaining(0);
      setStatus("done");
      return;
    }
    setRemaining(left);
    rafRef.current = requestAnimationFrame(tick);
  }

  // Compute the result when the test ends — reads the latest state directly, so
  // no stale-closure math (the rAF loop only flips status).
  React.useEffect(() => {
    if (status !== "done") return;
    let correct = 0;
    let typedChars = 0;
    for (let i = 0; i < wordIndex; i++) {
      const t = typed[i] ?? "";
      const target = words[i] ?? "";
      typedChars += t.length + 1; // + the space that committed the word
      const n = Math.min(t.length, target.length);
      for (let j = 0; j < n; j++) if (t[j] === target[j]) correct++;
      if (t === target) correct++; // credit the space
    }
    // Current, uncommitted word.
    {
      const t = input;
      const target = words[wordIndex] ?? "";
      typedChars += t.length;
      const n = Math.min(t.length, target.length);
      for (let j = 0; j < n; j++) if (t[j] === target[j]) correct++;
    }
    const minutes = (elapsedMsRef.current || duration * 1000) / 60000;
    const wpm = minutes > 0 ? Math.round(correct / 5 / minutes) : 0;
    const raw = minutes > 0 ? Math.round(typedChars / 5 / minutes) : 0;
    const accuracy = typedChars > 0 ? Math.round((correct / typedChars) * 100) : 100;
    setResult({ wpm, raw, accuracy });

    if (wpm > (best[duration] ?? 0)) {
      const next = { ...best, [duration]: wpm };
      setBest(next);
      try {
        localStorage.setItem("ohotool.typing.best", JSON.stringify(next));
      } catch {
        /* ignore */
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.ctrlKey || e.metaKey || e.altKey) return; // let shortcuts through
    if (status === "done") return;

    if (e.key === " ") {
      e.preventDefault();
      if (input.length === 0) return; // ignore leading/empty spaces
      const nextIndex = wordIndex + 1;
      setTyped((prev) => {
        const copy = prev.slice();
        copy[wordIndex] = input;
        return copy;
      });
      setInput("");
      setWordIndex(nextIndex);
      if (nextIndex >= words.length) {
        elapsedMsRef.current = performance.now() - startRef.current;
        stopLoop();
        setStatus("done");
      }
      return;
    }

    if (e.key === "Backspace") {
      e.preventDefault();
      setInput((s) => s.slice(0, -1));
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      return;
    }

    if (e.key.length === 1) {
      e.preventDefault();
      if (status === "idle") {
        startRef.current = performance.now();
        setRemaining(duration);
        setStatus("running");
        rafRef.current = requestAnimationFrame(tick);
      }
      const target = words[wordIndex] ?? "";
      if (input.length > target.length + 8) return; // cap runaway input
      setInput((s) => s + e.key);
    }
  }

  function restart(nextDuration: Duration = duration) {
    stopLoop();
    setStatus("idle");
    setWords(makeWords(220));
    setWordIndex(0);
    setInput("");
    setTyped([]);
    setResult(null);
    setRemaining(nextDuration);
    boxRef.current?.focus();
  }

  function pickDuration(d: Duration) {
    setDuration(d);
    restart(d);
  }

  const bestWpm = best[duration] ?? 0;

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Duration + live stat */}
      <div className="flex w-full max-w-2xl flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {DURATIONS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => pickDuration(d)}
              disabled={status === "running"}
              className={
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors disabled:opacity-40 " +
                (duration === d
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary/40")
              }
            >
              {d}s
            </button>
          ))}
        </div>
        <div className="text-2xl font-semibold tabular-nums text-primary">
          {status === "running" ? `${Math.ceil(remaining)}s` : `${duration}s`}
        </div>
      </div>

      {status === "done" && result ? (
        <div className="flex w-full max-w-2xl flex-col items-center gap-5 py-6">
          <div className="text-center">
            <div className="text-sm font-medium text-muted-foreground">Your typing speed</div>
            <div className="text-6xl font-bold tabular-nums text-emerald-500">{result.wpm}</div>
            <div className="text-sm font-medium text-muted-foreground">words per minute</div>
          </div>
          <div className="grid w-full grid-cols-3 gap-3">
            <Stat label="WPM" value={String(result.wpm)} />
            <Stat label="Accuracy" value={`${result.accuracy}%`} />
            <Stat label="Raw WPM" value={String(result.raw)} />
          </div>
          {bestWpm > 0 && (
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <TrophyIcon className="size-4 text-amber-500" />
              Best at {duration}s: <span className="font-semibold text-foreground">{bestWpm} WPM</span>
            </p>
          )}
          <Button onClick={() => restart()} className="w-44">
            <RotateCcwIcon className="size-4" />
            Try again
          </Button>
        </div>
      ) : (
        <>
          <div
            ref={boxRef}
            tabIndex={0}
            role="textbox"
            aria-label="Typing test — type the words shown"
            onKeyDown={onKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={
              "relative h-40 w-full max-w-2xl overflow-hidden rounded-2xl border-2 p-5 text-xl leading-relaxed outline-none transition-colors " +
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
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              {words.length === 0 ? (
                <span className="text-muted-foreground">Loading words…</span>
              ) : (
                words.map((w, i) => (
                  <Word
                    key={i}
                    ref={i === wordIndex ? currentWordRef : undefined}
                    target={w}
                    typedValue={i < wordIndex ? typed[i] ?? "" : i === wordIndex ? input : ""}
                    state={i < wordIndex ? "done" : i === wordIndex ? "current" : "future"}
                  />
                ))
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {focused
              ? "Type the words above. The timer starts on your first keystroke."
              : "Best on a physical keyboard. Your typing is never recorded."}
          </p>
        </>
      )}
    </div>
  );
}

const Word = React.forwardRef<HTMLSpanElement, {
  target: string;
  typedValue: string;
  state: "done" | "current" | "future";
}>(function Word({ target, typedValue, state }, ref) {
  if (state === "future") {
    return (
      <span ref={ref} className="text-muted-foreground/50">
        {target}
      </span>
    );
  }

  const chars = target.split("");
  const extra = typedValue.slice(target.length).split("");
  const caretAt = typedValue.length;

  return (
    <span ref={ref} className={state === "current" ? "rounded bg-primary/5" : ""}>
      {chars.map((c, j) => {
        let cls = "text-muted-foreground/50";
        if (j < typedValue.length) {
          cls = typedValue[j] === c ? "text-foreground" : "text-red-500 underline decoration-red-500/60";
        }
        return (
          <React.Fragment key={j}>
            {state === "current" && j === caretAt && <Caret />}
            <span className={cls}>{c}</span>
          </React.Fragment>
        );
      })}
      {extra.map((c, j) => (
        <span key={"x" + j} className="text-red-500 underline decoration-red-500/60">
          {c}
        </span>
      ))}
      {state === "current" && caretAt >= target.length && <Caret />}
    </span>
  );
});

function Caret() {
  return <span className="inline-block w-0 animate-pulse border-l-2 border-primary align-middle" aria-hidden />;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3 text-center">
      <div className="text-2xl font-semibold tabular-nums">{value}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
