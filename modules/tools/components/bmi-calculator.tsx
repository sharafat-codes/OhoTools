"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

function num(v: string) {
  const n = parseFloat(v);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function category(bmi: number) {
  if (bmi < 18.5) return { label: "Underweight", color: "text-sky-500" };
  if (bmi < 25) return { label: "Normal weight", color: "text-emerald-500" };
  if (bmi < 30) return { label: "Overweight", color: "text-amber-500" };
  return { label: "Obese", color: "text-red-500" };
}

export function BmiCalculator() {
  const [unit, setUnit] = React.useState("metric");

  // metric
  const [cm, setCm] = React.useState("175");
  const [kg, setKg] = React.useState("70");
  // imperial
  const [ft, setFt] = React.useState("5");
  const [inch, setInch] = React.useState("9");
  const [lb, setLb] = React.useState("154");

  let heightM: number | null = null;
  let weightKg: number | null = null;

  if (unit === "metric") {
    const h = num(cm);
    heightM = h ? h / 100 : null;
    weightKg = num(kg);
  } else {
    const f = num(ft) ?? 0;
    const i = parseFloat(inch) || 0;
    const totalIn = f * 12 + i;
    heightM = totalIn > 0 ? totalIn * 0.0254 : null;
    const pounds = num(lb);
    weightKg = pounds ? pounds * 0.45359237 : null;
  }

  const bmi = heightM && weightKg ? weightKg / (heightM * heightM) : null;
  const cat = bmi ? category(bmi) : null;

  // healthy weight range for this height
  const range =
    heightM != null
      ? { min: 18.5 * heightM * heightM, max: 24.9 * heightM * heightM }
      : null;
  const toDisplayWeight = (k: number) =>
    unit === "metric" ? `${k.toFixed(1)} kg` : `${(k / 0.45359237).toFixed(1)} lb`;

  return (
    <div className="flex flex-col gap-4">
      <Tabs value={unit} onValueChange={(v) => setUnit(v as string)}>
        <TabsList>
          <TabsTrigger value="metric">Metric</TabsTrigger>
          <TabsTrigger value="imperial">Imperial</TabsTrigger>
        </TabsList>
      </Tabs>

      {unit === "metric" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cm">Height (cm)</Label>
            <Input id="cm" type="number" value={cm} onChange={(e) => setCm(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="kg">Weight (kg)</Label>
            <Input id="kg" type="number" value={kg} onChange={(e) => setKg(e.target.value)} />
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ft">Height (ft)</Label>
            <Input id="ft" type="number" value={ft} onChange={(e) => setFt(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="in">Height (in)</Label>
            <Input id="in" type="number" value={inch} onChange={(e) => setInch(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="lb">Weight (lb)</Label>
            <Input id="lb" type="number" value={lb} onChange={(e) => setLb(e.target.value)} />
          </div>
        </div>
      )}

      {bmi && cat ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-1 py-6 text-center">
            <div className="text-sm text-muted-foreground">Your BMI</div>
            <div className="font-heading text-4xl font-semibold">{bmi.toFixed(1)}</div>
            <div className={cn("text-lg font-medium", cat.color)}>{cat.label}</div>
            {range && (
              <div className="mt-2 text-sm text-muted-foreground">
                Healthy range for your height: {toDisplayWeight(range.min)} – {toDisplayWeight(range.max)}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <p className="text-sm text-muted-foreground">Enter your height and weight to calculate BMI.</p>
      )}
    </div>
  );
}
