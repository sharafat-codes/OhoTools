"use client";

import * as React from "react";

/** Milliseconds until a local date (+ optional HH:MM); negative once passed. */
function msUntil(date: string, time?: string): number {
  const [h, m] = (time ?? "00:00").split(":").map(Number);
  const d = new Date(`${date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return NaN;
  d.setHours(Number.isNaN(h) ? 0 : h, Number.isNaN(m) ? 0 : m, 0, 0);
  return d.getTime() - Date.now();
}

/**
 * Days / hours / minutes / seconds to the big day.
 *
 * Renders nothing until mounted: the numbers depend on the viewer's clock, so
 * a server-rendered value would always hydrate as a mismatch.
 */
export function CardCountdown({ date, time, accent, ink = "light" }: { date: string; time?: string; accent: string; ink?: "light" | "dark" }) {
  const [left, setLeft] = React.useState<number | null>(null);

  React.useEffect(() => {
    const tick = () => setLeft(msUntil(date, time));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [date, time]);

  if (left === null || Number.isNaN(left)) return null;

  if (left <= 0) {
    return (
      <p className="text-center font-heading text-2xl font-semibold tracking-tight" style={{ color: accent }}>
        It&apos;s today 🎉
      </p>
    );
  }

  const s = Math.floor(left / 1000);
  const parts = [
    { n: Math.floor(s / 86400), label: "days" },
    { n: Math.floor((s % 86400) / 3600), label: "hours" },
    { n: Math.floor((s % 3600) / 60), label: "minutes" },
    { n: s % 60, label: "seconds" },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3" role="timer" aria-live="off">
      {parts.map((p) => (
        <div
          key={p.label}
          className={
            "rounded-2xl border px-2 py-3 text-center backdrop-blur-sm sm:py-4 " +
            (ink === "light" ? "border-white/15 bg-white/10" : "border-black/10 bg-white/60")
          }
        >
          <div className="font-heading text-2xl font-semibold tabular-nums sm:text-4xl" style={{ color: accent }}>
            {String(p.n).padStart(2, "0")}
          </div>
          <div className="mt-0.5 text-[10px] uppercase tracking-[0.2em] opacity-70 sm:text-xs">{p.label}</div>
        </div>
      ))}
    </div>
  );
}
