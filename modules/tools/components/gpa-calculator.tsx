"use client";

import * as React from "react";
import { PlusIcon, Trash2Icon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const GRADES: { label: string; points: number }[] = [
  { label: "A+ / A (4.0)", points: 4.0 },
  { label: "A− (3.7)", points: 3.7 },
  { label: "B+ (3.3)", points: 3.3 },
  { label: "B (3.0)", points: 3.0 },
  { label: "B− (2.7)", points: 2.7 },
  { label: "C+ (2.3)", points: 2.3 },
  { label: "C (2.0)", points: 2.0 },
  { label: "C− (1.7)", points: 1.7 },
  { label: "D+ (1.3)", points: 1.3 },
  { label: "D (1.0)", points: 1.0 },
  { label: "F (0.0)", points: 0.0 },
];

const selectClass =
  "h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

type Row = { id: number; name: string; points: number; credits: string };

export function GpaCalculator() {
  const idRef = React.useRef(3);
  const [rows, setRows] = React.useState<Row[]>([
    { id: 0, name: "", points: 4.0, credits: "3" },
    { id: 1, name: "", points: 3.7, credits: "3" },
    { id: 2, name: "", points: 3.0, credits: "4" },
  ]);

  function update(id: number, patch: Partial<Row>) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }
  function addRow() {
    setRows((rs) => [...rs, { id: idRef.current++, name: "", points: 4.0, credits: "3" }]);
  }
  function removeRow(id: number) {
    setRows((rs) => rs.filter((r) => r.id !== id));
  }

  let totalCredits = 0;
  let totalPoints = 0;
  for (const r of rows) {
    const c = parseFloat(r.credits);
    if (Number.isFinite(c) && c > 0) {
      totalCredits += c;
      totalPoints += c * r.points;
    }
  }
  const gpa = totalCredits > 0 ? totalPoints / totalCredits : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-2 text-xs text-muted-foreground">
          <span>Course (optional)</span>
          <span className="w-32">Grade</span>
          <span className="w-20">Credits</span>
          <span className="w-8" />
        </div>
        {rows.map((r) => (
          <div key={r.id} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-2">
            <Input
              value={r.name}
              onChange={(e) => update(r.id, { name: e.target.value })}
              placeholder="e.g. Calculus"
            />
            <select
              value={r.points}
              onChange={(e) => update(r.id, { points: parseFloat(e.target.value) })}
              className={`${selectClass} w-32`}
              aria-label="Grade"
            >
              {GRADES.map((g) => (
                <option key={g.label} value={g.points}>
                  {g.label}
                </option>
              ))}
            </select>
            <Input
              type="number"
              min={0}
              value={r.credits}
              onChange={(e) => update(r.id, { credits: e.target.value })}
              className="w-20"
              aria-label="Credits"
            />
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => removeRow(r.id)}
              aria-label="Remove course"
              disabled={rows.length === 1}
            >
              <Trash2Icon />
            </Button>
          </div>
        ))}
      </div>

      <Button variant="outline" size="sm" className="w-fit" onClick={addRow}>
        <PlusIcon />
        Add course
      </Button>

      <Card>
        <CardContent className="flex items-center justify-between py-5">
          <div>
            <div className="text-sm text-muted-foreground">Your GPA</div>
            <div className="text-xs text-muted-foreground">{totalCredits} total credits</div>
          </div>
          <div className="font-heading text-4xl font-semibold">{gpa !== null ? gpa.toFixed(2) : "—"}</div>
        </CardContent>
      </Card>
    </div>
  );
}
