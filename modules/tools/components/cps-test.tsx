"use client";

import * as React from "react";
import { MousePointerClickIcon, RotateCcwIcon, TrophyIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

const DURATIONS = [1, 5, 10, 30, 60] as const;
type Duration = (typeof DURATIONS)[number];
type Status = "idle" | "running" | "done";

function rating(cps: number): { label: string; className: string } {
  if (cps >= 12) return { label: "Superhuman — auto-clicker territory", className: "text-fuchsia-500" };
  if (cps >= 9) return { label: "Insane", className: "text-emerald-500" };
  if (cps >= 7) return { label: "Very fast", className: "text-emerald-500" };
  if (cps >= 5) return { label: "Fast", className: "text-primary" };
  if (cps >= 3.5) return { label: "Average", className: "text-foreground" };
  return { label: "Warming up", className: "text-muted-foreground" };
}

export function CpsTest() {
  const [duration, setDuration] = React.useState<Duration>(5);
  const [status, setStatus] = React.useState<Status>("idle");
  const [clicks, setClicks] = React.useState(0);
  const [remaining, setRemaining] = React.useState(5);
  const [best, setBest] = React.useState<Record<number, number>>({});

  const startRef = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);
  const clicksRef = React.useRef(0);

  // Load saved best scores per duration.
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("ohotool.cps.best");
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

  // Side effects (state + localStorage) live here, never inside a setState
  // updater — React Strict Mode double-invokes updaters, which would fire the
  // localStorage write and best-score check twice.
  function finish(finalClicks: number) {
    stopLoop();
    setStatus("done");
    setRemaining(0);
    const cps = finalClicks / duration;
    if (cps > (best[duration] ?? 0)) {
      const next = { ...best, [duration]: cps };
      setBest(next);
      try {
        localStorage.setItem("ohotool.cps.best", JSON.stringify(next));
      } catch {
        /* ignore */
      }
    }
  }

  function tick() {
    const elapsed = (performance.now() - startRef.current) / 1000;
    const left = duration - elapsed;
    if (left <= 0) {
      finish(clicksRef.current);
      return;
    }
    setRemaining(left);
    rafRef.current = requestAnimationFrame(tick);
  }

  function handlePadDown() {
    if (status === "done") return;
    if (status === "idle") {
      // First click starts the run and counts as click #1.
      startRef.current = performance.now();
      clicksRef.current = 1;
      setClicks(1);
      setRemaining(duration);
      setStatus("running");
      rafRef.current = requestAnimationFrame(tick);
      return;
    }
    clicksRef.current += 1;
    setClicks(clicksRef.current);
  }

  function reset(nextDuration: Duration = duration) {
    stopLoop();
    clicksRef.current = 0;
    setStatus("idle");
    setClicks(0);
    setRemaining(nextDuration);
  }

  function pickDuration(d: Duration) {
    setDuration(d);
    reset(d);
  }

  const cps = status === "done" ? clicks / duration : status === "running" ? clicks / Math.max(duration - remaining, 0.001) : 0;
  const bestCps = best[duration] ?? 0;
  const r = rating(cps);

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Duration picker */}
      <div className="flex flex-wrap items-center justify-center gap-2">
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

      {/* Click pad */}
      <button
        type="button"
        onPointerDown={(e) => {
          e.preventDefault();
          handlePadDown();
        }}
        className={
          "relative flex h-64 w-full max-w-xl select-none touch-manipulation flex-col items-center justify-center gap-2 rounded-2xl border-2 text-center transition-colors " +
          (status === "running"
            ? "border-primary bg-primary/10"
            : status === "done"
              ? "border-emerald-500/40 bg-emerald-500/5"
              : "border-dashed border-primary/40 bg-card hover:bg-primary/5")
        }
      >
        {status === "idle" && (
          <>
            <MousePointerClickIcon className="size-9 text-primary" />
            <span className="text-lg font-semibold">Click here to start</span>
            <span className="text-sm text-muted-foreground">
              The {duration}-second timer starts on your first click.
            </span>
          </>
        )}

        {status === "running" && (
          <>
            <span className="text-6xl font-bold tabular-nums text-primary">{clicks}</span>
            <span className="text-sm font-medium text-muted-foreground">clicks</span>
            <span className="mt-1 text-2xl font-semibold tabular-nums">{remaining.toFixed(1)}s</span>
          </>
        )}

        {status === "done" && (
          <>
            <span className="text-sm font-medium text-muted-foreground">Your click speed</span>
            <span className="text-6xl font-bold tabular-nums text-emerald-500">{cps.toFixed(1)}</span>
            <span className="text-sm font-medium text-muted-foreground">clicks per second</span>
            <span className={"mt-1 text-sm font-semibold " + r.className}>{r.label}</span>
          </>
        )}
      </button>

      {/* Stats + reset */}
      {status === "done" ? (
        <div className="flex w-full max-w-xl flex-col items-center gap-4">
          <div className="grid w-full grid-cols-3 gap-3">
            <Stat label="Clicks" value={String(clicks)} />
            <Stat label="Seconds" value={String(duration)} />
            <Stat label="CPS" value={cps.toFixed(2)} />
          </div>
          <Button onClick={() => reset()} className="w-44">
            <RotateCcwIcon className="size-4" />
            Try again
          </Button>
        </div>
      ) : (
        bestCps > 0 && (
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <TrophyIcon className="size-4 text-amber-500" />
            Your best at {duration}s: <span className="font-semibold text-foreground">{bestCps.toFixed(2)} CPS</span>
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
