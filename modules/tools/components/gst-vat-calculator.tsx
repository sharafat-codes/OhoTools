"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CURRENCIES = ["$", "€", "£", "₹", "¥"];

function num(v: string) {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

export function GstVatCalculator() {
  const [mode, setMode] = React.useState("add");
  const [amount, setAmount] = React.useState("100");
  const [rate, setRate] = React.useState("20");
  const [cur, setCur] = React.useState("$");

  const a = num(amount);
  const r = num(rate);

  let net: number | null = null;
  let tax: number | null = null;
  let gross: number | null = null;

  if (a !== null && r !== null) {
    if (mode === "add") {
      net = a;
      tax = (a * r) / 100;
      gross = a + tax;
    } else {
      gross = a;
      net = a / (1 + r / 100);
      tax = gross - net;
    }
  }

  const money = (v: number) =>
    `${cur}${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="flex flex-col gap-4">
      <Tabs value={mode} onValueChange={(v) => setMode(v as string)}>
        <TabsList>
          <TabsTrigger value="add">Add tax</TabsTrigger>
          <TabsTrigger value="remove">Remove tax</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="gst-amount">{mode === "add" ? "Amount (excl. tax)" : "Amount (incl. tax)"}</Label>
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
            <Input id="gst-amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="flex-1" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="gst-rate">Tax rate (%)</Label>
          <Input id="gst-rate" type="number" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} />
        </div>
      </div>

      {net !== null && tax !== null && gross !== null ? (
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="py-4">
              <div className="text-xs text-muted-foreground">Net</div>
              <div className="font-heading text-lg font-semibold">{money(net)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-xs text-muted-foreground">Tax</div>
              <div className="font-heading text-lg font-semibold text-primary">{money(tax)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-xs text-muted-foreground">Gross</div>
              <div className="font-heading text-lg font-semibold">{money(gross)}</div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Enter an amount and tax rate.</p>
      )}
    </div>
  );
}
