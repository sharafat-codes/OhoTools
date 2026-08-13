"use client";

import * as React from "react";

function nextNewYear(): Date {
  const now = new Date();
  return new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0);
}
function nextChristmas(): Date {
  const now = new Date();
  const y = now.getFullYear();
  const xmas = new Date(y, 11, 25, 0, 0, 0);
  return xmas.getTime() < now.getTime() ? new Date(y + 1, 11, 25) : xmas;
}
function toLocalInput(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function CountdownToDate() {
  const [target, setTarget] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [now, setNow] = React.useState<number | null>(null);

  React.useEffect(() => {
    setTarget((t) => t || toLocalInput(nextNewYear()));
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const targetMs = target ? new Date(target).getTime() : NaN;
  const valid = Number.isFinite(targetMs);
  const diff = valid && now !== null ? targetMs - now : 0;
  const reached = valid && now !== null && diff <= 0;

  const d = Math.max(0, Math.floor(diff / 86400000));
  const h = Math.max(0, Math.floor((diff % 86400000) / 3600000));
  const m = Math.max(0, Math.floor((diff % 3600000) / 60000));
  const s = Math.max(0, Math.floor((diff % 60000) / 1000));

  function preset(getter: () => Date, label: string) {
    setTarget(toLocalInput(getter()));
    setTitle(label);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 rounded-xl border border-border bg-muted/30 p-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Event title (optional)</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My event"
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary/40"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Target date &amp; time</span>
          <input
            type="datetime-local"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary/40"
          />
        </label>
        <div className="flex flex-wrap gap-2 sm:col-span-2">
          <span className="text-xs text-muted-foreground">Quick set:</span>
          <Preset onClick={() => preset(nextNewYear, "New Year")}>New Year</Preset>
          <Preset onClick={() => preset(nextChristmas, "Christmas")}>Christmas</Preset>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-6 text-center">
        {title && <div className="mb-3 text-lg font-semibold">{title}</div>}
        {now === null ? (
          <div className="text-muted-foreground">Loading…</div>
        ) : !valid ? (
          <div className="text-muted-foreground">Pick a date to start the countdown.</div>
        ) : reached ? (
          <div className="text-3xl font-bold text-emerald-500">🎉 It&apos;s here!</div>
        ) : (
          <div className="flex items-stretch justify-center gap-3 sm:gap-5">
            <Unit value={d} label="days" />
            <Unit value={h} label="hours" />
            <Unit value={m} label="minutes" />
            <Unit value={s} label="seconds" />
          </div>
        )}
        {valid && !reached && now !== null && (
          <div className="mt-4 text-sm text-muted-foreground">
            until {new Date(targetMs).toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })}
          </div>
        )}
      </div>
    </div>
  );
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex min-w-16 flex-col items-center rounded-xl bg-background/60 px-3 py-3 sm:min-w-20">
      <span className="text-4xl font-bold tabular-nums sm:text-5xl">{String(value).padStart(2, "0")}</span>
      <span className="mt-1 text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

function Preset({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium hover:border-primary/40"
    >
      {children}
    </button>
  );
}
