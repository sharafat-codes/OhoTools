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

export function DiscountCalculator() {
  const [price, setPrice] = React.useState("120");
  const [discount, setDiscount] = React.useState("25");
  const [tax, setTax] = React.useState("0");
  const [cur, setCur] = React.useState("$");

  const p = num(price);
  const d = num(discount);
  const t = num(tax) ?? 0;

  let saved: number | null = null;
  let afterDiscount: number | null = null;
  let final: number | null = null;

  if (p !== null && d !== null) {
    saved = (p * d) / 100;
    afterDiscount = p - saved;
    final = afterDiscount * (1 + t / 100);
  }

  const money = (v: number) =>
    `${cur}${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="disc-price">Original price</Label>
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
            <Input id="disc-price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="flex-1" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="disc-pct">Discount (%)</Label>
          <Input id="disc-pct" type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="disc-tax">Tax (%) — optional</Label>
          <Input id="disc-tax" type="number" value={tax} onChange={(e) => setTax(e.target.value)} />
        </div>
      </div>

      {final !== null && saved !== null ? (
        <>
          <Card>
            <CardContent className="py-5 text-center">
              <div className="text-sm text-muted-foreground">Final price</div>
              <div className="font-heading text-4xl font-semibold">{money(final)}</div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="py-4">
                <div className="text-xs text-muted-foreground">You save</div>
                <div className="font-heading text-xl font-semibold text-emerald-500">{money(saved)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4">
                <div className="text-xs text-muted-foreground">Price after discount</div>
                <div className="font-heading text-xl font-semibold">{money(afterDiscount!)}</div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">Enter a price and discount to see the final price.</p>
      )}
    </div>
  );
}
