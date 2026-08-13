"use client";

import * as React from "react";

const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "INR", "PKR"] as const;

export function MortgageCalculator() {
  const [currency, setCurrency] = React.useState<string>("USD");
  const [price, setPrice] = React.useState(350000);
  const [dpMode, setDpMode] = React.useState<"pct" | "amt">("pct");
  const [dp, setDp] = React.useState(20);
  const [rate, setRate] = React.useState(6.5);
  const [years, setYears] = React.useState(30);
  const [taxYear, setTaxYear] = React.useState(3600);
  const [insYear, setInsYear] = React.useState(1200);
  const [hoaMonth, setHoaMonth] = React.useState(0);
  const [showSchedule, setShowSchedule] = React.useState(false);

  const inputCls =
    "w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary/40";

  const money = React.useCallback(
    (n: number, dpDigits = 0) =>
      new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: dpDigits }).format(
        Number.isFinite(n) ? n : 0,
      ),
    [currency],
  );

  const calc = React.useMemo(() => {
    const downAmount = dpMode === "pct" ? (price * dp) / 100 : dp;
    const loan = Math.max(price - downAmount, 0);
    const r = rate / 100 / 12;
    const n = Math.max(Math.round(years * 12), 1);
    const pi = r > 0 ? (loan * r) / (1 - Math.pow(1 + r, -n)) : loan / n;
    const monthlyTax = taxYear / 12;
    const monthlyIns = insYear / 12;
    const monthly = pi + monthlyTax + monthlyIns + hoaMonth;
    const totalInterest = pi * n - loan;

    // Yearly amortization.
    const rows: { year: number; interest: number; principal: number; balance: number }[] = [];
    let balance = loan;
    for (let y = 1; y <= years; y++) {
      let yInt = 0, yPrin = 0;
      for (let m = 0; m < 12; m++) {
        if (balance <= 0) break;
        const interest = balance * r;
        let principal = pi - interest;
        if (principal > balance) principal = balance;
        balance -= principal;
        yInt += interest;
        yPrin += principal;
      }
      rows.push({ year: y, interest: yInt, principal: yPrin, balance: Math.max(balance, 0) });
    }

    return { downAmount, loan, pi, monthlyTax, monthlyIns, monthly, totalInterest, rows };
  }, [price, dp, dpMode, rate, years, taxYear, insYear, hoaMonth]);

  const dpPercent = dpMode === "pct" ? dp : price > 0 ? (dp / price) * 100 : 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 rounded-xl border border-border bg-muted/30 p-4 sm:grid-cols-2">
        <Field label="Currency">
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={inputCls}>
            {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Home price">
          <input type="number" min={0} value={price} onChange={(e) => setPrice(Math.max(0, Number(e.target.value) || 0))} className={inputCls} />
        </Field>

        <Field label={`Down payment (${dpMode === "pct" ? "%" : currency})`}>
          <div className="flex gap-2">
            <input type="number" min={0} value={dp} onChange={(e) => setDp(Math.max(0, Number(e.target.value) || 0))} className={inputCls + " flex-1"} />
            <button
              type="button"
              onClick={() => setDpMode((m) => (m === "pct" ? "amt" : "pct"))}
              className="rounded-lg border border-border bg-card px-3 text-sm font-medium hover:border-primary/40"
            >
              {dpMode === "pct" ? "%" : currency}
            </button>
          </div>
          <span className="mt-1 text-xs text-muted-foreground">
            {money(calc.downAmount)} · {dpPercent.toFixed(1)}% down · loan {money(calc.loan)}
          </span>
        </Field>
        <Field label="Interest rate (% / year)">
          <input type="number" min={0} step={0.01} value={rate} onChange={(e) => setRate(Math.max(0, Number(e.target.value) || 0))} className={inputCls} />
        </Field>

        <Field label="Loan term (years)">
          <input type="number" min={1} max={40} value={years} onChange={(e) => setYears(Math.max(1, Math.min(40, Number(e.target.value) || 1)))} className={inputCls} />
        </Field>
        <Field label="Property tax (per year)">
          <input type="number" min={0} value={taxYear} onChange={(e) => setTaxYear(Math.max(0, Number(e.target.value) || 0))} className={inputCls} />
        </Field>

        <Field label="Home insurance (per year)">
          <input type="number" min={0} value={insYear} onChange={(e) => setInsYear(Math.max(0, Number(e.target.value) || 0))} className={inputCls} />
        </Field>
        <Field label="HOA (per month)">
          <input type="number" min={0} value={hoaMonth} onChange={(e) => setHoaMonth(Math.max(0, Number(e.target.value) || 0))} className={inputCls} />
        </Field>
      </div>

      {/* Result */}
      <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-6 text-center">
        <div className="text-sm font-medium text-primary">Estimated monthly payment</div>
        <div className="mt-1 text-4xl font-bold tabular-nums sm:text-5xl">{money(calc.monthly, 2)}</div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
          <Break label="Principal & interest" value={money(calc.pi, 2)} />
          <Break label="Property tax" value={money(calc.monthlyTax, 2)} />
          <Break label="Insurance" value={money(calc.monthlyIns, 2)} />
          <Break label="HOA" value={money(hoaMonth, 2)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Loan amount" value={money(calc.loan)} />
        <Stat label="Total interest" value={money(calc.totalInterest)} />
        <Stat label="Total of payments" value={money(calc.loan + calc.totalInterest)} />
      </div>

      {/* Amortization */}
      <div className="rounded-xl border border-border bg-card">
        <button
          type="button"
          onClick={() => setShowSchedule((s) => !s)}
          className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium"
        >
          Amortization schedule (yearly)
          <span className="text-muted-foreground">{showSchedule ? "Hide" : "Show"}</span>
        </button>
        {showSchedule && (
          <div className="max-h-80 overflow-auto border-t border-border">
            <table className="w-full text-right text-sm">
              <thead className="sticky top-0 bg-muted/60 text-xs text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left">Year</th>
                  <th className="px-3 py-2">Principal</th>
                  <th className="px-3 py-2">Interest</th>
                  <th className="px-3 py-2">Balance</th>
                </tr>
              </thead>
              <tbody>
                {calc.rows.map((row) => (
                  <tr key={row.year} className="border-t border-border/60">
                    <td className="px-3 py-1.5 text-left font-medium">{row.year}</td>
                    <td className="px-3 py-1.5 tabular-nums">{money(row.principal)}</td>
                    <td className="px-3 py-1.5 tabular-nums text-muted-foreground">{money(row.interest)}</td>
                    <td className="px-3 py-1.5 tabular-nums">{money(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium">{label}</span>
      {children}
    </label>
  );
}

function Break({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-background/60 p-2">
      <div className="font-semibold tabular-nums">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3 text-center">
      <div className="text-base font-semibold tabular-nums">{value}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
