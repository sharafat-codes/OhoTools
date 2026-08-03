"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ACTIVITY = [
  { label: "Sedentary — little or no exercise", value: 1.2 },
  { label: "Light — 1–3 days/week", value: 1.375 },
  { label: "Moderate — 3–5 days/week", value: 1.55 },
  { label: "Active — 6–7 days/week", value: 1.725 },
  { label: "Very active — hard exercise or physical job", value: 1.9 },
];

function num(v: string) {
  const n = parseFloat(v);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function CalorieCalculator() {
  const [unit, setUnit] = React.useState("metric");
  const [age, setAge] = React.useState("30");
  const [gender, setGender] = React.useState("male");
  const [cm, setCm] = React.useState("175");
  const [kg, setKg] = React.useState("70");
  const [ft, setFt] = React.useState("5");
  const [inch, setInch] = React.useState("9");
  const [lb, setLb] = React.useState("154");
  const [activity, setActivity] = React.useState("1.55");

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

  const a = num(age);
  const bmr =
    heightCm && weightKg && a ? 10 * weightKg + 6.25 * heightCm - 5 * a + (gender === "male" ? 5 : -161) : null;
  const tdee = bmr ? bmr * parseFloat(activity) : null;

  const goals =
    tdee != null
      ? [
          { label: "Lose weight (~0.5 kg / week)", value: tdee - 500 },
          { label: "Mild weight loss (~0.25 kg / week)", value: tdee - 250 },
          { label: "Maintain weight", value: tdee, highlight: true },
          { label: "Mild weight gain (~0.25 kg / week)", value: tdee + 250 },
          { label: "Gain weight (~0.5 kg / week)", value: tdee + 500 },
        ]
      : [];

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
          <Label htmlFor="age">Age</Label>
          <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="gender">Gender</Label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {unit === "metric" ? (
          <>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cm">Height (cm)</Label>
              <Input id="cm" type="number" value={cm} onChange={(e) => setCm(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="kg">Weight (kg)</Label>
              <Input id="kg" type="number" value={kg} onChange={(e) => setKg(e.target.value)} />
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ft">Height (ft)</Label>
                <Input id="ft" type="number" value={ft} onChange={(e) => setFt(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="in">(in)</Label>
                <Input id="in" type="number" value={inch} onChange={(e) => setInch(e.target.value)} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lb">Weight (lb)</Label>
              <Input id="lb" type="number" value={lb} onChange={(e) => setLb(e.target.value)} />
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="activity">Activity level</Label>
        <select
          id="activity"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          {ACTIVITY.map((a2) => (
            <option key={a2.value} value={a2.value}>
              {a2.label}
            </option>
          ))}
        </select>
      </div>

      {tdee != null ? (
        <Card className="animate-in fade-in-0 slide-in-from-bottom-1 duration-300">
          <CardContent className="flex flex-col gap-4 py-6">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Daily calories to maintain weight</div>
              <div className="font-heading text-4xl font-semibold">{Math.round(tdee).toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">calories/day</div>
            </div>
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <tbody>
                  {goals.map((g) => (
                    <tr key={g.label} className={"border-b border-border last:border-0 " + (g.highlight ? "bg-primary/5" : "")}>
                      <td className="px-4 py-2 text-muted-foreground">{g.label}</td>
                      <td className="px-4 py-2 text-right font-medium">{Math.round(g.value).toLocaleString()} cal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <p className="text-sm text-muted-foreground">Enter your details to estimate your daily calories.</p>
      )}

      <p className="text-xs text-muted-foreground">
        Estimates use the Mifflin-St Jeor equation. These are general guidelines, not medical advice — consult a
        professional for personalized targets.
      </p>
    </div>
  );
}
