"use client";

import * as React from "react";
import { BabyIcon, CalendarHeartIcon } from "lucide-react";

type Method = "lmp" | "conception" | "ivf5" | "ivf3";

const METHODS: { key: Method; label: string }[] = [
  { key: "lmp", label: "Last period" },
  { key: "conception", label: "Conception date" },
  { key: "ivf5", label: "IVF (day 5)" },
  { key: "ivf3", label: "IVF (day 3)" },
];

function parseDate(s: string): Date | null {
  if (!s) return null;
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}
function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}
function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}
function fmt(d: Date): string {
  return d.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

export function DueDateCalculator() {
  const [method, setMethod] = React.useState<Method>("lmp");
  const [date, setDate] = React.useState("");
  const [cycle, setCycle] = React.useState(28);
  const [today, setToday] = React.useState<Date | null>(null);

  React.useEffect(() => {
    const t = new Date();
    setToday(new Date(t.getFullYear(), t.getMonth(), t.getDate()));
  }, []);

  const d = parseDate(date);
  let dueDate: Date | null = null;
  let conception: Date | null = null;
  if (d) {
    if (method === "lmp") {
      conception = addDays(d, cycle - 14);
      dueDate = addDays(conception, 266);
    } else if (method === "conception") {
      conception = d;
      dueDate = addDays(d, 266);
    } else if (method === "ivf5") {
      dueDate = addDays(d, 261);
      conception = addDays(d, -5);
    } else {
      dueDate = addDays(d, 263);
      conception = addDays(d, -3);
    }
  }

  // Gestational age is measured from an LMP-equivalent = dueDate - 280.
  const lmpEquiv = dueDate ? addDays(dueDate, -280) : null;
  let gaWeeks: number | null = null;
  let gaDays = 0;
  let progress = 0;
  let daysToGo = 0;
  if (lmpEquiv && dueDate && today) {
    const elapsed = daysBetween(lmpEquiv, today);
    gaWeeks = Math.floor(elapsed / 7);
    gaDays = ((elapsed % 7) + 7) % 7;
    progress = Math.max(0, Math.min(100, Math.round((elapsed / 280) * 100)));
    daysToGo = daysBetween(today, dueDate);
    if (elapsed < 0) gaWeeks = null;
  }

  const trimester =
    gaWeeks === null ? null : gaWeeks < 14 ? "First trimester" : gaWeeks < 28 ? "Second trimester" : "Third trimester";

  return (
    <div className="flex flex-col gap-5">
      {/* Method */}
      <div className="flex flex-wrap justify-center gap-2">
        {METHODS.map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={() => setMethod(m.key)}
            className={
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors " +
              (method === m.key ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/40")
            }
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="grid gap-4 rounded-xl border border-border bg-muted/30 p-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">
            {method === "lmp" ? "First day of your last period" : method === "conception" ? "Conception date" : "Embryo transfer date"}
          </span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary/40"
          />
        </label>
        {method === "lmp" && (
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Average cycle length (days)</span>
            <input
              type="number"
              min={20}
              max={45}
              value={cycle}
              onChange={(e) => setCycle(Math.max(20, Math.min(45, Number(e.target.value) || 28)))}
              className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary/40"
            />
          </label>
        )}
      </div>

      {/* Result */}
      {dueDate ? (
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-6 text-center">
            <div className="flex items-center justify-center gap-2 text-sm font-medium text-primary">
              <CalendarHeartIcon className="size-4" /> Estimated due date
            </div>
            <div className="mt-2 text-2xl font-bold sm:text-3xl">{fmt(dueDate)}</div>
            {gaWeeks !== null ? (
              <div className="mt-3 text-sm text-muted-foreground">
                You are <span className="font-semibold text-foreground">{gaWeeks} weeks {gaDays} days</span> along
                {trimester ? ` · ${trimester}` : ""}
                {daysToGo > 0 ? ` · ${daysToGo} days to go` : daysToGo === 0 ? " · due today!" : ` · ${Math.abs(daysToGo)} days overdue`}
              </div>
            ) : (
              <div className="mt-3 text-sm text-muted-foreground">Enter a past date to see how far along you are.</div>
            )}
            {gaWeeks !== null && (
              <div className="mx-auto mt-4 h-2 w-full max-w-sm overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Stat label="Due date" value={dueDate.toLocaleDateString()} />
            {conception && <Stat label="Conception (est.)" value={conception.toLocaleDateString()} />}
            {gaWeeks !== null && <Stat label="Progress" value={`${progress}%`} />}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
          <BabyIcon className="size-8 text-primary" />
          Pick a date above to estimate your due date.
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground">
        This is an estimate for general information, not medical advice. Your healthcare provider may adjust your due date.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3 text-center">
      <div className="text-base font-semibold">{value}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
