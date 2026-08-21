"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/components/copy-button";
import { SliderField } from "@/components/slider-field";

const FIRST = ["Ali", "Aisha", "Omar", "Fatima", "Liam", "Emma", "Noah", "Olivia", "Raj", "Priya", "Yusuf", "Zara", "Chen", "Mia", "Diego", "Sofia"];
const LAST = ["Khan", "Ahmed", "Patel", "Smith", "Johnson", "Garcia", "Kim", "Nguyen", "Ali", "Hassan", "Sharma", "Lee", "Rossi", "Silva", "Brown"];
const CITY = ["Karachi", "Lahore", "Mumbai", "London", "New York", "Dubai", "Toronto", "Berlin", "Sydney", "Cairo", "Istanbul", "Tokyo"];
const COUNTRY = ["Pakistan", "India", "United States", "United Kingdom", "UAE", "Canada", "Germany", "Australia", "Egypt", "Turkey", "Japan"];
const COMPANY = ["Acme Inc", "Globex", "Initech", "Umbrella", "Soylent", "Hooli", "Stark Industries", "Wayne Enterprises", "Wonka Co", "Pied Piper"];
const JOB = ["Software Engineer", "Product Manager", "Designer", "Data Analyst", "Marketing Lead", "Accountant", "Teacher", "Doctor", "Sales Rep"];
const DOMAIN = ["example.com", "mail.com", "test.org", "demo.io", "inbox.net"];

const FIELDS = [
  { key: "id", label: "ID (UUID)" },
  { key: "firstName", label: "First name" },
  { key: "lastName", label: "Last name" },
  { key: "fullName", label: "Full name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "city", label: "City" },
  { key: "country", label: "Country" },
  { key: "company", label: "Company" },
  { key: "jobTitle", label: "Job title" },
  { key: "date", label: "Date" },
  { key: "boolean", label: "Boolean" },
  { key: "number", label: "Number" },
] as const;

type FieldKey = (typeof FIELDS)[number]["key"];

function pick<T>(a: T[]): T {
  return a[Math.floor(Math.random() * a.length)];
}

function value(key: FieldKey): string | number | boolean {
  const first = pick(FIRST);
  const last = pick(LAST);
  switch (key) {
    case "id": return crypto.randomUUID();
    case "firstName": return first;
    case "lastName": return last;
    case "fullName": return `${first} ${last}`;
    case "email": return `${first}.${last}`.toLowerCase() + `${Math.floor(Math.random() * 90 + 10)}@${pick(DOMAIN)}`;
    case "phone": return `+${Math.floor(Math.random() * 90 + 10)}-${Math.floor(Math.random() * 9000000000 + 1000000000)}`;
    case "city": return pick(CITY);
    case "country": return pick(COUNTRY);
    case "company": return pick(COMPANY);
    case "jobTitle": return pick(JOB);
    case "date": {
      const d = new Date(2020, 0, 1).getTime() + Math.floor(Math.random() * 1.9e11);
      return new Date(d).toISOString().slice(0, 10);
    }
    case "boolean": return Math.random() > 0.5;
    case "number": return Math.floor(Math.random() * 10000);
  }
}

function toCsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "";
  const cols = Object.keys(rows[0]);
  const esc = (v: unknown) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
}

export function MockDataGenerator() {
  const [selected, setSelected] = React.useState<FieldKey[]>(["id", "fullName", "email", "country"]);
  const [count, setCount] = React.useState(10);
  const [format, setFormat] = React.useState<"json" | "csv">("json");
  const [output, setOutput] = React.useState("");

  function toggle(k: FieldKey) {
    setSelected((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));
  }

  function generate() {
    if (!selected.length) { setOutput(""); return; }
    const rows = Array.from({ length: count }, () => {
      const row: Record<string, unknown> = {};
      // Keep field order stable to match the checkbox list.
      for (const f of FIELDS) if (selected.includes(f.key)) row[f.key] = value(f.key);
      return row;
    });
    setOutput(format === "json" ? JSON.stringify(rows, null, 2) : toCsv(rows));
  }

  function download() {
    const blob = new Blob([output], { type: format === "json" ? "application/json" : "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mock-data.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Fields</span>
        <div className="flex flex-wrap gap-1.5">
          {FIELDS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => toggle(f.key)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                selected.includes(f.key) ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/40",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <SliderField label="Rows" value={count} min={1} max={200} step={1} onChange={setCount} />

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Format</span>
        <div className="inline-flex w-fit rounded-lg bg-muted p-0.5">
          {(["json", "csv"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={cn("rounded-md px-3 py-1 text-sm font-medium uppercase transition-colors", format === f ? "bg-background shadow-sm" : "text-muted-foreground")}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <Button onClick={generate} disabled={!selected.length} className="w-fit">Generate {count} rows</Button>

      {output && (
        <Card>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Output ({format.toUpperCase()})</span>
              <div className="flex gap-2">
                <CopyButton value={output} />
                <Button variant="outline" size="sm" onClick={download}>Download</Button>
              </div>
            </div>
            <pre className="max-h-96 overflow-auto rounded-lg bg-muted p-3 text-xs">
              <code className="font-mono whitespace-pre-wrap">{output}</code>
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
