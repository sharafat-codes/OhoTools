"use client";

import * as React from "react";
import { SpaceIcon, RotateCcwIcon, TrophyIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

// 0 = untimed "just count"; the rest are timed speed challenges (seconds).
const MODES = [0, 5, 10, 30, 60] as const;
type Mode = (typeof MODES)[number];
type Status = "idle" | "running" | "done";

function rating(pps: number): { label: string; className: string } {
  if (pps >= 12) return { label: "Superhuman", className: "text-fuchsia-500" };
  if (pps >= 9) return { label: "Insane", className: "text-emerald-500" };
  if (pps >= 7) return { label: "Very fast", className: "text-emerald-500" };
  if (pps >= 5) return { label: "Fast", className: "text-primary" };
  if (pps >= 3.5) return { label: "Average", className: "text-foreground" };
  return { label: "Warming up", className: "text-muted-foreground" };
}

export function SpacebarCounter() {
  const [duration, setDuration] = React.useState<Mode>(0);
  const [status, setStatus] = React.useState<Status>("idle");
  const [count, setCount] = React.useState(0);
  const [remaining, setRemaining] = React.useState(0);
  const [best, setBest] = React.useState<Record<number, number>>({});
  const [focused, setFocused] = React.useState(false);

  const startRef = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);
  const countRef = React.useRef(0);
  const padRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("ohotool.spacebar.best");
      if (raw) setBest(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    padRef.current?.focus();
  }, []);

  const stopLoop = React.useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  React.useEffect(() => stopLoop, [stopLoop]);

  function finish(finalCount: number) {
    stopLoop();
    setStatus("done");
    setRemaining(0);
    if (duration <= 0) return;
    const pps = finalCount / duration;
    if (pps > (best[duration] ?? 0)) {
      const next = { ...best, [duration]: pps };
      setBest(next);
      try {
        localStorage.setItem("ohotool.spacebar.best", JSON.stringify(next));
      } catch {
        /* ignore */
      }
    }
  }

  function tick() {
    const elapsed = (performance.now() - startRef.current) / 1000;
    const left = duration - elapsed;
    if (left <= 0) {
      finish(countRef.current);
      return;
    }
    setRemaining(left);
    rafRef.current = requestAnimationFrame(tick);
  }

  function press() {
    if (status === "done") return;
    if (status === "idle") {
      countRef.current = 1;
      setCount(1);
      if (duration > 0) {
        startRef.current = performance.now();
        setRemaining(duration);
        rafRef.current = requestAnimationFrame(tick);
      }
      setStatus("running");
      return;
    }
    countRef.current += 1;
    setCount(countRef.current);
  }

  function reset(nextDuration: Mode = duration) {
    stopLoop();
    countRef.current = 0;
    setStatus("idle");
    setCount(0);
    setRemaining(nextDuration > 0 ? nextDuration : 0);
    padRef.current?.focus();
  }

  function pickDuration(d: Mode) {
    setDuration(d);
    reset(d);
  }

  const pps = status === "done" && duration > 0 ? count / duration : 0;
  const r = rating(pps);
  const bestPps = duration > 0 ? best[duration] ?? 0 : 0;

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Mode picker */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {MODES.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => pickDuration(d)}
            disabled={status === "running" && duration > 0}
            className={
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors disabled:opacity-40 " +
              (duration === d
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:border-primary/40")
            }
          >
            {d === 0 ? "Just count" : `${d}s`}
          </button>
        ))}
      </div>

      {/* Spacebar pad */}
      <div
        ref={padRef}
        tabIndex={0}
        role="application"
        aria-label="Spacebar counter — press the spacebar to count"
        onKeyDown={(e) => {
          if (e.code === "Space" || e.key === " ") {
            e.preventDefault();
            press();
          }
        }}
        onPointerDown={(e) => {
          e.preventDefault();
          if (!focused) {
            padRef.current?.focus();
            return;
          }
          press();
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={
          "relative flex h-64 w-full max-w-xl select-none touch-manipulation flex-col items-center justify-center gap-2 rounded-2xl border-2 text-center outline-none transition-colors " +
          (status === "running"
            ? "border-primary bg-primary/10"
            : status === "done"
              ? "border-emerald-500/40 bg-emerald-500/5"
              : focused
                ? "border-primary/50 bg-card"
                : "border-dashed border-primary/40 bg-card")
        }
      >
        {!focused && status === "idle" && (
          <div className="absolute inset-0 z-10 grid place-items-center rounded-2xl bg-background/70 backdrop-blur-[1px]">
            <span className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium">
              Click here, then press Space
            </span>
          </div>
        )}

        {status === "idle" && (
          <>
            <SpaceIcon className="size-10 text-primary" />
            <span className="text-lg font-semibold">Press Space to start</span>
            <span className="text-sm text-muted-foreground">
              {duration === 0 ? "Counts every spacebar press." : `${duration}-second speed test.`}
            </span>
          </>
        )}

        {status === "running" && (
          <>
            <span className="text-6xl font-bold tabular-nums text-primary">{count}</span>
            <span className="text-sm font-medium text-muted-foreground">spacebar presses</span>
            {duration > 0 && (
              <span className="mt-1 text-2xl font-semibold tabular-nums">{remaining.toFixed(1)}s</span>
            )}
          </>
        )}

        {status === "done" && (
          <>
            <span className="text-sm font-medium text-muted-foreground">Your spacebar speed</span>
            <span className="text-6xl font-bold tabular-nums text-emerald-500">{pps.toFixed(1)}</span>
            <span className="text-sm font-medium text-muted-foreground">presses per second</span>
            <span className={"mt-1 text-sm font-semibold " + r.className}>{r.label}</span>
          </>
        )}
      </div>

      {/* Stats / reset */}
      {status === "done" ? (
        <div className="flex w-full max-w-xl flex-col items-center gap-4">
          <div className="grid w-full grid-cols-3 gap-3">
            <Stat label="Presses" value={String(count)} />
            <Stat label="Seconds" value={String(duration)} />
            <Stat label="Per second" value={pps.toFixed(2)} />
          </div>
          <Button onClick={() => reset()} className="w-44">
            <RotateCcwIcon className="size-4" />
            Try again
          </Button>
        </div>
      ) : status === "running" && duration === 0 ? (
        <Button variant="outline" onClick={() => reset()} className="w-44">
          <RotateCcwIcon className="size-4" />
          Reset counter
        </Button>
      ) : (
        bestPps > 0 && (
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <TrophyIcon className="size-4 text-amber-500" />
            Your best at {duration}s:{" "}
            <span className="font-semibold text-foreground">{bestPps.toFixed(2)}/s</span>
          </p>
        )
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3 text-center">
      <div className="text-2xl font-semibold tabular-nums">{value}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
