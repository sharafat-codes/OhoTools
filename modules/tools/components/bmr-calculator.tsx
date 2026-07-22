"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const selectClass =
  "h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

const ACTIVITY = [
  { label: "Sedentary (little exercise)", factor: 1.2 },
  { label: "Light (1–3 days/week)", factor: 1.375 },
  { label: "Moderate (3–5 days/week)", factor: 1.55 },
  { label: "Active (6–7 days/week)", factor: 1.725 },
  { label: "Very active (hard training)", factor: 1.9 },
];

function num(v: string) {
  const n = parseFloat(v);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function BmrCalculator() {
  const [unit, setUnit] = React.useState("metric");
  const [sex, setSex] = React.useState("male");
  const [age, setAge] = React.useState("30");
  const [activity, setActivity] = React.useState("1.2");
  // metric
  const [cm, setCm] = React.useState("175");
  const [kg, setKg] = React.useState("70");
  // imperial
  const [ft, setFt] = React.useState("5");
  const [inch, setInch] = React.useState("9");
  const [lb, setLb] = React.useState("154");

  const ageN = num(age);
  let heightCm: number | null = null;
  let weightKg: number | null = null;
  if (unit === "metric") {
    heightCm = num(cm);
    weightKg = num(kg);
  } else {
    const f = num(ft) ?? 0;
    const i = parseFloat(inch) || 0;
    const totalIn = f * 12 + i;
    heightCm = totalIn > 0 ? totalIn * 2.54 : null;
    const pounds = num(lb);
    weightKg = pounds ? pounds * 0.45359237 : null;
  }

  let bmr: number | null = null;
  if (heightCm && weightKg && ageN) {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageN + (sex === "male" ? 5 : -161);
  }
  const factor = parseFloat(activity) || 1.2;
  const tdee = bmr ? bmr * factor : null;

  const cal = (n: number) => `${Math.round(n).toLocaleString()} kcal`;

  return (
    <div className="flex flex-col gap-4">
      <Tabs value={unit} onValueChange={(v) => setUnit(v as string)}>
        <TabsList>
          <TabsTrigger value="metric">Metric</TabsTrigger>
          <TabsTrigger value="imperial">Imperial</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="bmr-age">Age</Label>
          <Input id="bmr-age" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="bmr-sex">Sex</Label>
          <select id="bmr-sex" value={sex} onChange={(e) => setSex(e.target.value)} className={selectClass}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

      {unit === "metric" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="bmr-cm">Height (cm)</Label>
            <Input id="bmr-cm" type="number" value={cm} onChange={(e) => setCm(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="bmr-kg">Weight (kg)</Label>
            <Input id="bmr-kg" type="number" value={kg} onChange={(e) => setKg(e.target.value)} />
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="bmr-ft">Height (ft)</Label>
            <Input id="bmr-ft" type="number" value={ft} onChange={(e) => setFt(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="bmr-in">Height (in)</Label>
            <Input id="bmr-in" type="number" value={inch} onChange={(e) => setInch(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="bmr-lb">Weight (lb)</Label>
            <Input id="bmr-lb" type="number" value={lb} onChange={(e) => setLb(e.target.value)} />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="bmr-act">Activity level</Label>
        <select id="bmr-act" value={activity} onChange={(e) => setActivity(e.target.value)} className={selectClass}>
          {ACTIVITY.map((a) => (
            <option key={a.factor} value={a.factor}>
              {a.label}
            </option>
          ))}
        </select>
      </div>

      {bmr && tdee ? (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="py-4 text-center">
                <div className="text-xs text-muted-foreground">BMR (at rest)</div>
                <div className="font-heading text-2xl font-semibold">{cal(bmr)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4 text-center">
                <div className="text-xs text-muted-foreground">Maintenance (TDEE)</div>
                <div className="font-heading text-2xl font-semibold">{cal(tdee)}</div>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-border p-3">
              <div className="text-xs text-muted-foreground">Lose weight (−500)</div>
              <div className="font-medium">{cal(tdee - 500)}/day</div>
            </div>
            <div className="rounded-lg border border-border p-3">
              <div className="text-xs text-muted-foreground">Gain weight (+500)</div>
              <div className="font-medium">{cal(tdee + 500)}/day</div>
            </div>
          </div>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">Enter your age, height, and weight.</p>
      )}
    </div>
  );
}
