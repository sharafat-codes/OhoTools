"use client";

import * as React from "react";

const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "INR", "PKR"] as const;
const PERIODS = [
  { key: "hourly", label: "Hourly" },
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "biweekly", label: "Bi-weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "yearly", label: "Yearly" },
] as const;
type Period = (typeof PERIODS)[number]["key"];

export function SalaryCalculator() {
  const [currency, setCurrency] = React.useState("USD");
  const [amount, setAmount] = React.useState(25);
  const [period, setPeriod] = React.useState<Period>("hourly");
  const [hoursPerWeek, setHoursPerWeek] = React.useState(40);
  const [daysPerWeek, setDaysPerWeek] = React.useState(5);
  const [weeksPerYear, setWeeksPerYear] = React.useState(52);

  const inputCls = "w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary/40";

  const money = React.useCallback(
    (n: number) =>
      new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 2 }).format(
        Number.isFinite(n) ? n : 0,
      ),
    [currency],
  );

  const results = React.useMemo(() => {
    const hpw = Math.max(hoursPerWeek, 0);
    const dpw = Math.max(daysPerWeek, 0);
    const wpy = Math.max(weeksPerYear, 0);
    let annual = 0;
    if (period === "hourly") annual = amount * hpw * wpy;
    else if (period === "daily") annual = amount * dpw * wpy;
    else if (period === "weekly") annual = amount * wpy;
    else if (period === "biweekly") annual = amount * (wpy / 2);
    else if (period === "monthly") annual = amount * 12;
    else annual = amount;

    const safe = (num: number, den: number) => (den > 0 ? num / den : 0);
    return {
      hourly: safe(annual, hpw * wpy),
      daily: safe(annual, dpw * wpy),
      weekly: safe(annual, wpy),
      biweekly: safe(annual, wpy / 2),
      monthly: annual / 12,
      yearly: annual,
    };
  }, [amount, period, hoursPerWeek, daysPerWeek, weeksPerYear]);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 rounded-xl border border-border bg-muted/30 p-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Currency</span>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={inputCls}>
            {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Amount</span>
            <input type="number" min={0} value={amount} onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))} className={inputCls} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Per</span>
            <select value={period} onChange={(e) => setPeriod(e.target.value as Period)} className={inputCls}>
              {PERIODS.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
            </select>
          </label>
        </div>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Hours per week</span>
          <input type="number" min={0} max={168} value={hoursPerWeek} onChange={(e) => setHoursPerWeek(Number(e.target.value) || 0)} className={inputCls} />
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Days per week</span>
            <input type="number" min={0} max={7} value={daysPerWeek} onChange={(e) => setDaysPerWeek(Number(e.target.value) || 0)} className={inputCls} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Weeks per year</span>
            <input type="number" min={0} max={52} value={weeksPerYear} onChange={(e) => setWeeksPerYear(Number(e.target.value) || 0)} className={inputCls} />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Cell label="Hourly" value={money(results.hourly)} />
        <Cell label="Daily" value={money(results.daily)} />
        <Cell label="Weekly" value={money(results.weekly)} />
        <Cell label="Bi-weekly" value={money(results.biweekly)} />
        <Cell label="Monthly" value={money(results.monthly)} />
        <Cell label="Yearly" value={money(results.yearly)} highlight />
      </div>

      <p className="text-center text-xs text-muted-foreground">
        These are <strong>gross</strong> figures, before tax. Take-home pay depends on your country&apos;s tax and deductions.
      </p>
    </div>
  );
}

function Cell({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={"rounded-xl border p-3 text-center " + (highlight ? "border-primary/40 bg-primary/5" : "border-border bg-card")}>
      <div className="text-lg font-semibold tabular-nums">{value}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
