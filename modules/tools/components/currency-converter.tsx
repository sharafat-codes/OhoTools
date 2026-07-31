"use client";

import * as React from "react";
import { ArrowLeftRightIcon, LoaderCircleIcon } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const selectClass =
  "h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

export function CurrencyConverter() {
  const [rates, setRates] = React.useState<Record<string, number> | null>(null);
  const [updated, setUpdated] = React.useState("");
  const [amount, setAmount] = React.useState("1");
  const [from, setFrom] = React.useState("USD");
  const [to, setTo] = React.useState("EUR");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    fetch("/api/rates")
      .then((r) => r.json())
      .then((d: { rates?: Record<string, number>; updated?: string; error?: string }) => {
        if (cancelled) return;
        if (d.rates) {
          setRates(d.rates);
          setUpdated(d.updated ?? "");
        } else {
          setError("Exchange rates are unavailable right now. Please try again later.");
        }
      })
      .catch(() => {
        if (!cancelled) setError("Could not load exchange rates.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const codes = React.useMemo(() => (rates ? Object.keys(rates).sort() : []), [rates]);
  const amt = parseFloat(amount);
  const result =
    rates && Number.isFinite(amt) && rates[from] && rates[to] ? (amt / rates[from]) * rates[to] : null;

  return (
    <div className="flex flex-col gap-5">
      {error && <p className="text-sm text-destructive">{error}</p>}

      {!rates && !error && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <LoaderCircleIcon className="size-4 animate-spin" />
          Loading exchange rates…
        </p>
      )}

      {rates && (
        <>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cc-amount">Amount</Label>
            <Input
              id="cc-amount"
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full sm:w-56"
            />
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-1 flex-col gap-1.5">
              <Label htmlFor="cc-from">From</Label>
              <select id="cc-from" value={from} onChange={(e) => setFrom(e.target.value)} className={selectClass}>
                {codes.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Swap currencies"
              onClick={() => {
                setFrom(to);
                setTo(from);
              }}
              className="mb-0.5"
            >
              <ArrowLeftRightIcon />
            </Button>
            <div className="flex flex-1 flex-col gap-1.5">
              <Label htmlFor="cc-to">To</Label>
              <select id="cc-to" value={to} onChange={(e) => setTo(e.target.value)} className={selectClass}>
                {codes.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <div className="text-sm text-muted-foreground">
              {Number.isFinite(amt) ? amt.toLocaleString() : "—"} {from} =
            </div>
            <div className="font-heading text-2xl font-semibold tabular-nums">
              {result === null
                ? "—"
                : `${result.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${to}`}
            </div>
            {result !== null && rates[from] && rates[to] && (
              <div className="mt-1 text-xs text-muted-foreground">
                1 {from} = {((1 / rates[from]) * rates[to]).toLocaleString(undefined, { maximumFractionDigits: 4 })} {to}
              </div>
            )}
          </div>

          {updated && <p className="text-xs text-muted-foreground">Rates updated: {updated}</p>}
        </>
      )}
    </div>
  );
}
