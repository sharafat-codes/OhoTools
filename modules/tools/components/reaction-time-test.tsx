"use client";

import * as React from "react";
import { ZapIcon, HandIcon, TrophyIcon, RotateCcwIcon } from "lucide-react";

type Status = "idle" | "waiting" | "ready" | "tooearly" | "result";

function rating(ms: number): string {
  if (ms < 180) return "Lightning reflexes";
  if (ms < 220) return "Excellent";
  if (ms < 260) return "Great";
  if (ms < 300) return "Average";
  if (ms < 400) return "A little slow";
  return "Keep practicing";
}

export function ReactionTimeTest() {
  const [status, setStatus] = React.useState<Status>("idle");
  const [ms, setMs] = React.useState(0);
  const [attempts, setAttempts] = React.useState<number[]>([]);
  const [best, setBest] = React.useState<number | null>(null);

  const readyAtRef = React.useRef(0);
  const timeoutRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("ohotool.reaction.best");
      if (raw) setBest(Number(raw));
    } catch {
      /* ignore */
    }
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  function armWaiting() {
    setStatus("waiting");
    const delay = 1500 + Math.random() * 3500; // 1.5s – 5s
    timeoutRef.current = window.setTimeout(() => {
      readyAtRef.current = performance.now();
      setStatus("ready");
    }, delay);
  }

  function handleClick() {
    if (status === "idle" || status === "result" || status === "tooearly") {
      armWaiting();
      return;
    }

    if (status === "waiting") {
      // Clicked before green — false start.
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
      setStatus("tooearly");
      return;
    }

    if (status === "ready") {
      const reaction = Math.round(performance.now() - readyAtRef.current);
      setMs(reaction);
      setStatus("result");
      setAttempts((a) => [reaction, ...a].slice(0, 5));
      // Keep the localStorage write out of the setState updater (Strict Mode
      // double-invokes updaters); `best` is current here in the event handler.
      const nextBest = best === null ? reaction : Math.min(best, reaction);
      if (nextBest !== best) {
        setBest(nextBest);
        try {
          localStorage.setItem("ohotool.reaction.best", String(nextBest));
        } catch {
          /* ignore */
        }
      }
    }
  }

  const average =
    attempts.length > 0 ? Math.round(attempts.reduce((s, n) => s + n, 0) / attempts.length) : null;

  const pad = {
    idle: {
      className: "border-primary/40 bg-primary/10 hover:bg-primary/15",
      icon: <ZapIcon className="size-9 text-primary" />,
      title: "Reaction Time Test",
      sub: "Click anywhere to begin.",
    },
    waiting: {
      className: "border-rose-500/50 bg-rose-500/15 text-rose-600 dark:text-rose-400",
      icon: <HandIcon className="size-9" />,
      title: "Wait for green…",
      sub: "Don't click yet.",
    },
    ready: {
      className: "border-emerald-500/60 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300",
      icon: <ZapIcon className="size-9" />,
      title: "Click!",
      sub: "Now — as fast as you can.",
    },
    tooearly: {
      className: "border-amber-500/50 bg-amber-500/15 text-amber-700 dark:text-amber-300",
      icon: <HandIcon className="size-9" />,
      title: "Too soon!",
      sub: "You clicked before green. Click to try again.",
    },
    result: {
      className: "border-primary/50 bg-primary/10",
      icon: null,
      title: "",
      sub: "Click to go again.",
    },
  }[status];

  return (
    <div className="flex flex-col items-center gap-5">
      <button
        type="button"
        onPointerDown={(e) => {
          e.preventDefault();
          handleClick();
        }}
        className={
          "flex h-72 w-full max-w-xl select-none touch-manipulation flex-col items-center justify-center gap-2 rounded-2xl border-2 px-6 text-center transition-colors " +
          pad.className
        }
      >
        {status === "result" ? (
          <>
            <span className="text-6xl font-bold tabular-nums">{ms}</span>
            <span className="text-sm font-medium opacity-80">milliseconds</span>
            <span className="mt-1 text-base font-semibold">{rating(ms)}</span>
            <span className="mt-2 text-sm text-muted-foreground">{pad.sub}</span>
          </>
        ) : (
          <>
            {pad.icon}
            <span className="text-2xl font-bold">{pad.title}</span>
            <span className="text-sm font-medium opacity-90">{pad.sub}</span>
          </>
        )}
      </button>

      {(attempts.length > 0 || best !== null) && (
        <div className="flex w-full max-w-xl flex-col items-center gap-4">
          <div className="grid w-full grid-cols-3 gap-3">
            <Stat label="Last" value={attempts.length ? `${attempts[0]} ms` : "—"} />
            <Stat label="Average" value={average !== null ? `${average} ms` : "—"} />
            <Stat
              label="Best"
              value={best !== null ? `${best} ms` : "—"}
              icon={<TrophyIcon className="size-3.5 text-amber-500" />}
            />
          </div>

          {attempts.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              <span>Recent:</span>
              {attempts.map((a, i) => (
                <span key={i} className="rounded-full border border-border bg-card px-2 py-0.5 tabular-nums">
                  {a} ms
                </span>
              ))}
            </div>
          )}

          {status === "result" && (
            <button
              type="button"
              onClick={armWaiting}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              <RotateCcwIcon className="size-4" />
              Go again
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3 text-center">
      <div className="flex items-center justify-center gap-1 text-2xl font-semibold tabular-nums">{value}</div>
      <div className="mt-0.5 flex items-center justify-center gap-1 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
    </div>
  );
}
