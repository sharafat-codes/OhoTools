"use client";

import * as React from "react";
import { RotateCcwIcon } from "lucide-react";

// A key: [event.code, display label, width in "units" (1u = one standard key)].
type Key = { code: string; label: string; w?: number };

const ROWS: Key[][] = [
  [
    { code: "Backquote", label: "`" },
    { code: "Digit1", label: "1" },
    { code: "Digit2", label: "2" },
    { code: "Digit3", label: "3" },
    { code: "Digit4", label: "4" },
    { code: "Digit5", label: "5" },
    { code: "Digit6", label: "6" },
    { code: "Digit7", label: "7" },
    { code: "Digit8", label: "8" },
    { code: "Digit9", label: "9" },
    { code: "Digit0", label: "0" },
    { code: "Minus", label: "-" },
    { code: "Equal", label: "=" },
    { code: "Backspace", label: "Backspace", w: 2 },
  ],
  [
    { code: "Tab", label: "Tab", w: 1.5 },
    { code: "KeyQ", label: "Q" },
    { code: "KeyW", label: "W" },
    { code: "KeyE", label: "E" },
    { code: "KeyR", label: "R" },
    { code: "KeyT", label: "T" },
    { code: "KeyY", label: "Y" },
    { code: "KeyU", label: "U" },
    { code: "KeyI", label: "I" },
    { code: "KeyO", label: "O" },
    { code: "KeyP", label: "P" },
    { code: "BracketLeft", label: "[" },
    { code: "BracketRight", label: "]" },
    { code: "Backslash", label: "\\", w: 1.5 },
  ],
  [
    { code: "CapsLock", label: "Caps", w: 1.75 },
    { code: "KeyA", label: "A" },
    { code: "KeyS", label: "S" },
    { code: "KeyD", label: "D" },
    { code: "KeyF", label: "F" },
    { code: "KeyG", label: "G" },
    { code: "KeyH", label: "H" },
    { code: "KeyJ", label: "J" },
    { code: "KeyK", label: "K" },
    { code: "KeyL", label: "L" },
    { code: "Semicolon", label: ";" },
    { code: "Quote", label: "'" },
    { code: "Enter", label: "Enter", w: 2.25 },
  ],
  [
    { code: "ShiftLeft", label: "Shift", w: 2.25 },
    { code: "KeyZ", label: "Z" },
    { code: "KeyX", label: "X" },
    { code: "KeyC", label: "C" },
    { code: "KeyV", label: "V" },
    { code: "KeyB", label: "B" },
    { code: "KeyN", label: "N" },
    { code: "KeyM", label: "M" },
    { code: "Comma", label: "," },
    { code: "Period", label: "." },
    { code: "Slash", label: "/" },
    { code: "ShiftRight", label: "Shift", w: 2.75 },
  ],
  [
    { code: "ControlLeft", label: "Ctrl", w: 1.5 },
    { code: "MetaLeft", label: "Win", w: 1.25 },
    { code: "AltLeft", label: "Alt", w: 1.25 },
    { code: "Space", label: "Space", w: 6.25 },
    { code: "AltRight", label: "Alt", w: 1.25 },
    { code: "MetaRight", label: "Win", w: 1.25 },
    { code: "ControlRight", label: "Ctrl", w: 1.5 },
  ],
];

const ARROWS: Key[][] = [
  [{ code: "ArrowUp", label: "↑" }],
  [
    { code: "ArrowLeft", label: "←" },
    { code: "ArrowDown", label: "↓" },
    { code: "ArrowRight", label: "→" },
  ],
];

// Keys we intercept so the browser doesn't scroll, tab away, or navigate while
// the tester is focused. (F5/F11/F12 etc. are reserved by the browser and can't
// be captured — that's expected.)
const PREVENT = new Set([
  "Tab",
  "Space",
  "Backspace",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Quote",
  "Slash",
]);

const UNIT = 2.5; // rem per key unit

export function KeyboardTester() {
  const [tested, setTested] = React.useState<Set<string>>(new Set());
  const [held, setHeld] = React.useState<Set<string>>(new Set());
  const [last, setLast] = React.useState<{ key: string; code: string; keyCode: number } | null>(null);
  const [focused, setFocused] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    ref.current?.focus();
  }, []);

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (PREVENT.has(e.code)) e.preventDefault();
    setLast({ key: e.key === " " ? "Space" : e.key, code: e.code, keyCode: e.keyCode });
    setHeld((h) => new Set(h).add(e.code));
    setTested((t) => (t.has(e.code) ? t : new Set(t).add(e.code)));
  }

  function onKeyUp(e: React.KeyboardEvent<HTMLDivElement>) {
    setHeld((h) => {
      const next = new Set(h);
      next.delete(e.code);
      return next;
    });
  }

  function reset() {
    setTested(new Set());
    setHeld(new Set());
    setLast(null);
    ref.current?.focus();
  }

  const renderKey = (k: Key) => {
    const isHeld = held.has(k.code);
    const isTested = tested.has(k.code);
    return (
      <div
        key={k.code}
        style={{ width: `${(k.w ?? 1) * UNIT}rem` }}
        className={
          "grid h-10 shrink-0 place-items-center rounded-md border text-xs font-medium transition-colors " +
          (isHeld
            ? "border-primary bg-primary text-primary-foreground shadow-sm"
            : isTested
              ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
              : "border-border bg-card text-muted-foreground")
        }
      >
        {k.label}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Readout */}
      <div className="grid w-full max-w-xl grid-cols-3 gap-3">
        <Readout label="Key" value={last?.key ?? "—"} />
        <Readout label="event.code" value={last?.code ?? "—"} mono />
        <Readout label="keyCode" value={last ? String(last.keyCode) : "—"} mono />
      </div>

      {/* Keyboard capture area */}
      <div
        ref={ref}
        tabIndex={0}
        role="application"
        aria-label="Keyboard tester — press keys to test them"
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          setHeld(new Set());
        }}
        className={
          "relative w-full overflow-x-auto rounded-2xl border-2 p-4 outline-none transition-colors " +
          (focused ? "border-primary/50 bg-card" : "border-dashed border-border bg-muted/30")
        }
      >
        {!focused && (
          <div className="absolute inset-0 z-10 grid place-items-center rounded-2xl bg-background/70 backdrop-blur-[1px]">
            <span className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium">
              Click here, then press any key
            </span>
          </div>
        )}

        <div className="mx-auto flex w-max items-start gap-3">
          {/* Main block */}
          <div className="flex flex-col gap-1.5">
            {ROWS.map((row, i) => (
              <div key={i} className="flex gap-1.5">
                {row.map(renderKey)}
              </div>
            ))}
          </div>

          {/* Arrow cluster */}
          <div className="flex flex-col justify-end gap-1.5 pb-1.5">
            {ARROWS.map((row, i) => (
              <div key={i} className="flex justify-center gap-1.5">
                {row.map(renderKey)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend + reset */}
      <div className="flex w-full max-w-xl flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded-sm border border-primary bg-primary" /> Held now
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded-sm border border-emerald-500/50 bg-emerald-500/15" /> Tested
          </span>
          <span>
            <span className="font-semibold text-foreground">{tested.size}</span> keys tested
          </span>
        </div>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 font-medium text-foreground hover:border-primary/40"
        >
          <RotateCcwIcon className="size-3.5" />
          Reset
        </button>
      </div>
    </div>
  );
}

function Readout({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3 text-center">
      <div className={"truncate text-lg font-semibold " + (mono ? "font-mono text-base" : "")}>{value}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
