"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

function money(n: number) {
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

export function CompoundInterestCalculator() {
  const [principal, setPrincipal] = React.useState("1000");
  const [rate, setRate] = React.useState("7");
  const [years, setYears] = React.useState("10");
  const [monthly, setMonthly] = React.useState("100");

  const P = parseFloat(principal) || 0;
  const r = (parseFloat(rate) || 0) / 100;
  const t = parseFloat(years) || 0;
  const PMT = parseFloat(monthly) || 0;

  // Compounded monthly, with monthly contributions.
  const i = r / 12;
  const N = Math.round(t * 12);
  const fv = i === 0 ? P + PMT * N : P * Math.pow(1 + i, N) + PMT * ((Math.pow(1 + i, N) - 1) / i);
  const contributed = P + PMT * N;
  const interest = Math.max(0, fv - contributed);
  const valid = t > 0 && (P > 0 || PMT > 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="principal">Initial amount</Label>
          <Input id="principal" type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="monthly">Monthly contribution</Label>
          <Input id="monthly" type="number" value={monthly} onChange={(e) => setMonthly(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="rate">Annual interest rate (%)</Label>
          <Input id="rate" type="number" value={rate} onChange={(e) => setRate(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="years">Years</Label>
          <Input id="years" type="number" value={years} onChange={(e) => setYears(e.target.value)} />
        </div>
      </div>

      {valid ? (
        <Card className="animate-in fade-in-0 slide-in-from-bottom-1 duration-300">
          <CardContent className="flex flex-col gap-4 py-6">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Future value after {t} years</div>
              <div className="font-heading text-4xl font-semibold">{money(fv)}</div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-lg border border-border p-3">
                <div className="text-xs text-muted-foreground">Total contributed</div>
                <div className="font-medium">{money(contributed)}</div>
              </div>
              <div className="rounded-lg border border-border p-3">
                <div className="text-xs text-muted-foreground">Total interest earned</div>
                <div className="font-medium text-primary">{money(interest)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <p className="text-sm text-muted-foreground">Enter an amount, rate, and time to see how it grows.</p>
      )}

      <p className="text-xs text-muted-foreground">
        Assumes interest is compounded monthly and contributions are made at the end of each month. Currency-agnostic —
        the figures are in whatever currency you enter.
      </p>
    </div>
  );
}
