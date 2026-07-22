"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const CURRENCIES = ["$", "€", "£", "₹", "¥"];

function num(v: string) {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

export function LoanCalculator() {
  const [amount, setAmount] = React.useState("25000");
  const [rate, setRate] = React.useState("6.5");
  const [years, setYears] = React.useState("5");
  const [cur, setCur] = React.useState("$");

  const P = num(amount);
  const annual = num(rate);
  const term = num(years);

  let monthly: number | null = null;
  let total: number | null = null;
  let interest: number | null = null;

  if (P !== null && P > 0 && annual !== null && term !== null && term > 0) {
    const n = term * 12;
    const r = annual / 100 / 12;
    monthly = r === 0 ? P / n : (P * r) / (1 - Math.pow(1 + r, -n));
    total = monthly * n;
    interest = total - P;
  }

  const money = (v: number) =>
    `${cur}${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="amount">Loan amount</Label>
          <div className="flex items-center gap-2">
            <select
              value={cur}
              onChange={(e) => setCur(e.target.value)}
              aria-label="Currency"
              className="h-9 rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="flex-1" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="rate">Annual interest rate (%)</Label>
          <Input id="rate" type="number" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="years">Loan term (years)</Label>
          <Input id="years" type="number" value={years} onChange={(e) => setYears(e.target.value)} />
        </div>
      </div>

      {monthly !== null && total !== null && interest !== null ? (
        <>
          <Card>
            <CardContent className="py-5 text-center">
              <div className="text-sm text-muted-foreground">Monthly payment</div>
              <div className="font-heading text-4xl font-semibold">{money(monthly)}</div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="py-4">
                <div className="text-xs text-muted-foreground">Total interest</div>
                <div className="font-heading text-xl font-semibold">{money(interest)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4">
                <div className="text-xs text-muted-foreground">Total repaid</div>
                <div className="font-heading text-xl font-semibold">{money(total)}</div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">Enter a loan amount, rate, and term to estimate your payment.</p>
      )}
    </div>
  );
}
