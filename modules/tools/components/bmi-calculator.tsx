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

// Color-coded scale mapped across BMI 15–40. Segment widths are proportional to
// each range's span within that window, so a boundary like 25 lands where the
// green/amber colors actually meet.
const SEGMENTS = [
  { color: "bg-sky-400", width: 14 }, // 15–18.5 (3.5 span)
  { color: "bg-emerald-500", width: 26 }, // 18.5–25 (6.5)
  { color: "bg-amber-400", width: 20 }, // 25–30 (5)
  { color: "bg-red-500", width: 40 }, // 30–40 (10)
];

// Position (0–100%) of a BMI value on the 15–40 scale, clamped to the ends.
function scalePos(bmi: number) {
  return Math.max(0, Math.min(100, ((bmi - 15) / 25) * 100));
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

  // healthy weight range for this height (aligns with the green 18.5–25 band)
  const range =
    heightM != null
      ? { min: 18.5 * heightM * heightM, max: 25 * heightM * heightM }
      : null;
  const toDisplayWeight = (k: number) =>
    unit === "metric" ? `${k.toFixed(1)} kg` : `${(k / 0.45359237).toFixed(1)} lb`;

  // Secondary metrics. BMI Prime = ratio to the upper limit of "normal" (25);
  // Ponderal Index = weight / height³ (a height-robust alternative to BMI).
  const bmiPrime = bmi != null ? bmi / 25 : null;
  const ponderal = heightM != null && weightKg != null ? weightKg / (heightM * heightM * heightM) : null;

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
        <Card className="animate-in fade-in-0 slide-in-from-bottom-1 duration-300">
          <CardContent className="flex flex-col gap-5 py-6">
            <div className="flex flex-col items-center gap-1 text-center">
              <div className="text-sm text-muted-foreground">Your BMI</div>
              <div className="font-heading text-4xl font-semibold">{bmi.toFixed(1)}</div>
              <div className={cn("text-lg font-medium", cat.color)}>{cat.label}</div>
            </div>

            {/* Color-coded scale with a marker at the current BMI */}
            <div className="px-1">
              <div className="relative pt-2.5">
                <div
                  className="absolute top-0 z-10 -translate-x-1/2 text-foreground transition-[left] duration-300 ease-out"
                  style={{ left: `${scalePos(bmi)}%` }}
                  aria-hidden
                >
                  <div
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: "5px solid transparent",
                      borderRight: "5px solid transparent",
                      borderTop: "7px solid currentColor",
                    }}
                  />
                </div>
                <div className="flex h-2.5 overflow-hidden rounded-full">
                  {SEGMENTS.map((s) => (
                    <div key={s.color} className={s.color} style={{ width: `${s.width}%` }} />
                  ))}
                </div>
              </div>
              <div className="relative mt-1 h-4 text-[10px] text-muted-foreground">
                <span className="absolute -translate-x-1/2" style={{ left: `${scalePos(18.5)}%` }}>
                  18.5
                </span>
                <span className="absolute -translate-x-1/2" style={{ left: `${scalePos(25)}%` }}>
                  25
                </span>
                <span className="absolute -translate-x-1/2" style={{ left: `${scalePos(30)}%` }}>
                  30
                </span>
              </div>
            </div>

            {/* Secondary metrics */}
            <div className="grid grid-cols-2 gap-3 text-center">
              {range && (
                <div className="col-span-2 rounded-lg border border-border p-3">
                  <div className="text-xs text-muted-foreground">Healthy weight for your height</div>
                  <div className="font-medium">
                    {toDisplayWeight(range.min)} – {toDisplayWeight(range.max)}
                  </div>
                </div>
              )}
              {bmiPrime != null && (
                <div className="rounded-lg border border-border p-3">
                  <div className="text-xs text-muted-foreground">BMI Prime</div>
                  <div className="font-medium">{bmiPrime.toFixed(2)}</div>
                </div>
              )}
              {ponderal != null && (
                <div className="rounded-lg border border-border p-3">
                  <div className="text-xs text-muted-foreground">Ponderal Index</div>
                  <div className="font-medium">{ponderal.toFixed(1)} kg/m³</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <p className="text-sm text-muted-foreground">Enter your height and weight to calculate BMI.</p>
      )}

      <p className="text-xs text-muted-foreground">
        BMI is a quick screening measure, not a diagnosis. It doesn&apos;t distinguish muscle from fat, and it&apos;s
        interpreted differently for children and teens, athletes, and during pregnancy.
      </p>
    </div>
  );
}
