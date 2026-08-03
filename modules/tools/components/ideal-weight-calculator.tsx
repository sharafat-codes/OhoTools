"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

function num(v: string) {
  const n = parseFloat(v);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function IdealWeightCalculator() {
  const [unit, setUnit] = React.useState("metric");
  const [gender, setGender] = React.useState("male");
  const [cm, setCm] = React.useState("175");
  const [ft, setFt] = React.useState("5");
  const [inch, setInch] = React.useState("9");

  let heightCm: number | null = null;
  if (unit === "metric") {
    heightCm = num(cm);
  } else {
    const f = num(ft) ?? 0;
    const i = parseFloat(inch) || 0;
    const totalIn = f * 12 + i;
    heightCm = totalIn > 0 ? totalIn * 2.54 : null;
  }

  const male = gender === "male";
  const over5ft = heightCm != null ? Math.max(0, heightCm / 2.54 - 60) : 0; // inches above 5 ft

  const formulas =
    heightCm != null
      ? [
          { name: "Devine", kg: (male ? 50 : 45.5) + 2.3 * over5ft },
          { name: "Robinson", kg: (male ? 52 : 49) + (male ? 1.9 : 1.7) * over5ft },
          { name: "Miller", kg: (male ? 56.2 : 53.1) + (male ? 1.41 : 1.36) * over5ft },
          { name: "Hamwi", kg: (male ? 48 : 45.5) + (male ? 2.7 : 2.2) * over5ft },
        ]
      : [];

  const m = heightCm != null ? heightCm / 100 : 0;
  const healthy = heightCm != null ? { min: 18.5 * m * m, max: 25 * m * m } : null;

  const show = (kg: number) => (unit === "metric" ? `${kg.toFixed(1)} kg` : `${(kg / 0.45359237).toFixed(1)} lb`);

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
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cm">Height (cm)</Label>
            <Input id="cm" type="number" value={cm} onChange={(e) => setCm(e.target.value)} />
          </div>
        ) : (
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
        )}
      </div>

      {heightCm != null && healthy ? (
        <Card className="animate-in fade-in-0 slide-in-from-bottom-1 duration-300">
          <CardContent className="flex flex-col gap-4 py-6">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Healthy weight range for your height</div>
              <div className="font-heading text-3xl font-semibold">
                {show(healthy.min)} – {show(healthy.max)}
              </div>
              <div className="text-xs text-muted-foreground">based on a BMI of 18.5–25</div>
            </div>
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-left text-muted-foreground">
                    <th className="px-4 py-2 font-medium">Formula</th>
                    <th className="px-4 py-2 text-right font-medium">Ideal weight</th>
                  </tr>
                </thead>
                <tbody>
                  {formulas.map((f) => (
                    <tr key={f.name} className="border-b border-border last:border-0">
                      <td className="px-4 py-2 text-muted-foreground">{f.name}</td>
                      <td className="px-4 py-2 text-right font-medium">{show(f.kg)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <p className="text-sm text-muted-foreground">Enter your height to estimate an ideal weight.</p>
      )}

      <p className="text-xs text-muted-foreground">
        &ldquo;Ideal weight&rdquo; formulas are rough estimates that don&apos;t account for build, muscle, or age. Use
        the healthy BMI range as a guide and consult a professional for advice.
      </p>
    </div>
  );
}
