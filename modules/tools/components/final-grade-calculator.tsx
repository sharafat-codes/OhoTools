"use client";

import * as React from "react";

export function FinalGradeCalculator() {
  const [current, setCurrent] = React.useState(82);
  const [target, setTarget] = React.useState(90);
  const [weight, setWeight] = React.useState(30);

  const w = weight / 100;
  const needed = w > 0 ? (target - current * (1 - w)) / w : NaN;

  let verdict: { text: string; className: string };
  if (!Number.isFinite(needed)) {
    verdict = { text: "Enter a final exam weight above 0%.", className: "text-muted-foreground" };
  } else if (needed > 100) {
    verdict = {
      text: `You'd need ${needed.toFixed(1)}% — not reachable from the final alone. Aim a bit lower, or look for extra credit.`,
      className: "text-red-500",
    };
  } else if (needed <= 0) {
    verdict = {
      text: `You've already secured it — even a 0% on the final keeps you at or above ${target}%.`,
      className: "text-emerald-500",
    };
  } else {
    verdict = { text: `Score at least this on your final to reach ${target}% overall.`, className: "text-muted-foreground" };
  }

  const showNumber = Number.isFinite(needed) && needed <= 100 && needed > 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 rounded-xl border border-border bg-muted/30 p-4 sm:grid-cols-3">
        <Field label="Current grade (%)" value={current} onChange={setCurrent} />
        <Field label="Target grade (%)" value={target} onChange={setTarget} />
        <Field label="Final exam weight (%)" value={weight} onChange={setWeight} />
      </div>

      <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-6 text-center">
        <div className="text-sm font-medium text-primary">Score needed on the final</div>
        <div className="mt-1 text-6xl font-bold tabular-nums">
          {showNumber ? `${needed.toFixed(1)}%` : "—"}
        </div>
        <p className={"mt-3 text-sm " + verdict.className}>{verdict.text}</p>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium">{label}</span>
      <input
        type="number"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
        className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary/40"
      />
    </label>
  );
}
