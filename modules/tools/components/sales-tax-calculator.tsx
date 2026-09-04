"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

function money(n: number) {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function num(v: string) {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

function Result({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="font-heading text-2xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
}

export function SalesTaxCalculator() {
  const [mode, setMode] = React.useState("add");
  const [rate, setRate] = React.useState("8.25");

  // add: net price → total incl. tax
  const [net, setNet] = React.useState("100");
  // remove: total incl. tax → net price
  const [gross, setGross] = React.useState("108.25");

  const r = num(rate);

  return (
    <Tabs value={mode} onValueChange={(v) => setMode(v as string)} className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="add">Add tax</TabsTrigger>
        <TabsTrigger value="remove">Remove tax</TabsTrigger>
      </TabsList>

      <div className="mt-4 flex flex-col gap-1.5">
        <Label htmlFor="tax-rate">Sales tax rate (%)</Label>
        <Input id="tax-rate" type="number" value={rate} onChange={(e) => setRate(e.target.value)} />
      </div>

      <TabsContent value="add" className="mt-4 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="net">Price before tax</Label>
          <Input id="net" type="number" value={net} onChange={(e) => setNet(e.target.value)} />
        </div>
        {(() => {
          const p = num(net);
          if (p === null || r === null) return <Result label="Total" value="—" />;
          const tax = p * (r / 100);
          return (
            <div className="grid grid-cols-2 gap-3">
              <Result label="Sales tax" value={money(tax)} />
              <Result label="Total (with tax)" value={money(p + tax)} />
            </div>
          );
        })()}
      </TabsContent>

      <TabsContent value="remove" className="mt-4 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="gross">Price including tax</Label>
          <Input id="gross" type="number" value={gross} onChange={(e) => setGross(e.target.value)} />
        </div>
        {(() => {
          const t = num(gross);
          if (t === null || r === null) return <Result label="Price before tax" value="—" />;
          const base = t / (1 + r / 100);
          return (
            <div className="grid grid-cols-2 gap-3">
              <Result label="Price before tax" value={money(base)} />
              <Result label="Sales tax" value={money(t - base)} />
            </div>
          );
        })()}
      </TabsContent>
    </Tabs>
  );
}
