"use client";

import * as React from "react";
import { AlertCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DOWS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

type Sets = {
  min: Set<number>;
  hour: Set<number>;
  dom: Set<number>;
  month: Set<number>;
  dow: Set<number>;
};

function parseField(expr: string, min: number, max: number): number[] {
  const out = new Set<number>();
  for (const part of expr.split(",")) {
    const [rangePart, stepPart] = part.split("/");
    const step = stepPart !== undefined ? parseInt(stepPart, 10) : 1;
    if (!Number.isInteger(step) || step < 1) throw new Error(`Invalid step in "${part}".`);
    let lo: number;
    let hi: number;
    if (rangePart === "*") {
      lo = min;
      hi = max;
    } else if (rangePart.includes("-")) {
      const [a, b] = rangePart.split("-");
      lo = parseInt(a, 10);
      hi = parseInt(b, 10);
    } else {
      lo = parseInt(rangePart, 10);
      hi = stepPart !== undefined ? max : lo;
    }
    if (!Number.isInteger(lo) || !Number.isInteger(hi)) throw new Error(`Invalid value in "${part}".`);
    if (lo < min || hi > max || lo > hi) throw new Error(`"${part}" is out of range (${min}-${max}).`);
    for (let v = lo; v <= hi; v += step) out.add(v);
  }
  return [...out].sort((a, b) => a - b);
}

function phrase(expr: string, vals: number[], unit: string) {
  if (expr === "*") return `every ${unit}`;
  const m = expr.match(/^\*\/(\d+)$/);
  if (m) return `every ${m[1]} ${unit}s`;
  if (vals.length === 1) return `at ${unit} ${vals[0]}`;
  return `at ${unit}s ${vals.join(", ")}`;
}

function analyze(expr: string) {
  const trimmed = expr.trim();
  if (!trimmed) return { error: null as string | null, rows: [] as { label: string; text: string }[], sets: null as Sets | null, fields: [] as string[] };
  const fields = trimmed.split(/\s+/);
  if (fields.length !== 5) {
    return { error: "A cron expression has 5 fields: minute hour day month weekday.", rows: [], sets: null, fields: [] };
  }
  try {
    const min = parseField(fields[0], 0, 59);
    const hour = parseField(fields[1], 0, 23);
    const dom = parseField(fields[2], 1, 31);
    const month = parseField(fields[3], 1, 12);
    const dow = [...new Set(parseField(fields[4], 0, 7).map((v) => (v === 7 ? 0 : v)))].sort((a, b) => a - b);
    const sets: Sets = {
      min: new Set(min),
      hour: new Set(hour),
      dom: new Set(dom),
      month: new Set(month),
      dow: new Set(dow),
    };
    const rows = [
      { label: "Minute", text: phrase(fields[0], min, "minute") },
      { label: "Hour", text: phrase(fields[1], hour, "hour") },
      { label: "Day of month", text: fields[2] === "*" ? "every day" : `on day ${dom.join(", ")}` },
      { label: "Month", text: fields[3] === "*" ? "every month" : `in ${month.map((m) => MONTHS[m - 1]).join(", ")}` },
      { label: "Day of week", text: fields[4] === "*" ? "any day" : `on ${dow.map((d) => DOWS[d]).join(", ")}` },
    ];
    return { error: null, rows, sets, fields };
  } catch (e) {
    return { error: (e as Error).message, rows: [], sets: null, fields: [] };
  }
}

function computeNextRuns(sets: Sets, fields: string[]) {
  const domR = fields[2] !== "*";
  const dowR = fields[4] !== "*";
  const runs: Date[] = [];
  const d = new Date();
  d.setSeconds(0, 0);
  d.setMinutes(d.getMinutes() + 1);
  for (let i = 0; i < 527040 && runs.length < 5; i++) {
    if (sets.min.has(d.getMinutes()) && sets.hour.has(d.getHours()) && sets.month.has(d.getMonth() + 1)) {
      const domOk = sets.dom.has(d.getDate());
      const dowOk = sets.dow.has(d.getDay());
      const dayOk = domR && dowR ? domOk || dowOk : domR ? domOk : dowR ? dowOk : true;
      if (dayOk) runs.push(new Date(d));
    }
    d.setMinutes(d.getMinutes() + 1);
  }
  return runs;
}

export function CronExplainer() {
  const [expr, setExpr] = React.useState("*/5 * * * *");
  const [nextRuns, setNextRuns] = React.useState<Date[]>([]);

  const analysis = React.useMemo(() => analyze(expr), [expr]);

  // Next runs depend on the current time — compute client-side (in an effect) to
  // avoid a server/client hydration mismatch. Deferred so setState isn't called
  // synchronously in the effect body.
  React.useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      setNextRuns(analysis.sets ? computeNextRuns(analysis.sets, analysis.fields) : []);
    });
    return () => {
      cancelled = true;
    };
  }, [analysis]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="cron">Cron expression</Label>
        <Input
          id="cron"
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          placeholder="*/5 * * * *"
          className="font-mono"
          aria-invalid={!!analysis.error}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => setExpr("0 9 * * 1-5")}>Try example</Button>
        <Button variant="ghost" size="sm" onClick={() => setExpr("")}>Clear</Button>
      </div>

      {analysis.error && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
          <span>{analysis.error}</span>
        </div>
      )}

      {analysis.rows.length > 0 && (
        <>
          <Card>
            <CardContent className="flex flex-col gap-2">
              <span className="text-sm font-medium">Schedule</span>
              {analysis.rows.map((r) => (
                <div key={r.label} className="flex justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">{r.label}</span>
                  <span className="text-right">{r.text}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col gap-2">
              <span className="text-sm font-medium">Next runs</span>
              {nextRuns.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No runs within the next year.
                </p>
              ) : (
                nextRuns.map((d, i) => (
                  <div key={i} className="text-sm text-muted-foreground">
                    {d.toLocaleString()}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
