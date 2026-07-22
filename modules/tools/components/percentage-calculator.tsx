"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

function fmt(n: number) {
  if (!Number.isFinite(n)) return "—";
  return Number(n.toFixed(6)).toLocaleString(undefined, { maximumFractionDigits: 6 });
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

function num(v: string) {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

export function PercentageCalculator() {
  const [mode, setMode] = React.useState("of");

  // mode "of": what is A% of B
  const [ofA, setOfA] = React.useState("15");
  const [ofB, setOfB] = React.useState("200");
  // mode "is": A is what percent of B
  const [isA, setIsA] = React.useState("30");
  const [isB, setIsB] = React.useState("200");
  // mode "change": percent change from A to B
  const [chA, setChA] = React.useState("200");
  const [chB, setChB] = React.useState("250");

  return (
    <Tabs value={mode} onValueChange={(v) => setMode(v as string)} className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="of">% of a number</TabsTrigger>
        <TabsTrigger value="is">X is what %</TabsTrigger>
        <TabsTrigger value="change">% change</TabsTrigger>
      </TabsList>

      <TabsContent value="of" className="mt-4 flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex min-w-24 flex-1 flex-col gap-1.5">
            <Label htmlFor="of-a">Percent</Label>
            <Input id="of-a" type="number" value={ofA} onChange={(e) => setOfA(e.target.value)} />
          </div>
          <span className="pb-2.5 text-sm text-muted-foreground">% of</span>
          <div className="flex min-w-24 flex-1 flex-col gap-1.5">
            <Label htmlFor="of-b">Value</Label>
            <Input id="of-b" type="number" value={ofB} onChange={(e) => setOfB(e.target.value)} />
          </div>
        </div>
        <Result
          label={`${ofA || "?"}% of ${ofB || "?"} is`}
          value={num(ofA) !== null && num(ofB) !== null ? fmt((num(ofA)! / 100) * num(ofB)!) : "—"}
        />
      </TabsContent>

      <TabsContent value="is" className="mt-4 flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex min-w-24 flex-1 flex-col gap-1.5">
            <Label htmlFor="is-a">Number</Label>
            <Input id="is-a" type="number" value={isA} onChange={(e) => setIsA(e.target.value)} />
          </div>
          <span className="pb-2.5 text-sm text-muted-foreground">is what % of</span>
          <div className="flex min-w-24 flex-1 flex-col gap-1.5">
            <Label htmlFor="is-b">Total</Label>
            <Input id="is-b" type="number" value={isB} onChange={(e) => setIsB(e.target.value)} />
          </div>
        </div>
        <Result
          label={`${isA || "?"} is this % of ${isB || "?"}`}
          value={num(isA) !== null && num(isB) ? `${fmt((num(isA)! / num(isB)!) * 100)}%` : "—"}
        />
      </TabsContent>

      <TabsContent value="change" className="mt-4 flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex min-w-24 flex-1 flex-col gap-1.5">
            <Label htmlFor="ch-a">From</Label>
            <Input id="ch-a" type="number" value={chA} onChange={(e) => setChA(e.target.value)} />
          </div>
          <span className="pb-2.5 text-sm text-muted-foreground">→</span>
          <div className="flex min-w-24 flex-1 flex-col gap-1.5">
            <Label htmlFor="ch-b">To</Label>
            <Input id="ch-b" type="number" value={chB} onChange={(e) => setChB(e.target.value)} />
          </div>
        </div>
        {(() => {
          const a = num(chA);
          const b = num(chB);
          if (a === null || b === null || a === 0) return <Result label="Percentage change" value="—" />;
          const change = ((b - a) / Math.abs(a)) * 100;
          return (
            <Result
              label={change >= 0 ? "Percentage increase" : "Percentage decrease"}
              value={`${change >= 0 ? "+" : ""}${fmt(change)}%`}
            />
          );
        })()}
      </TabsContent>
    </Tabs>
  );
}
