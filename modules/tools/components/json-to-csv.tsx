"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/copy-button";
import { Card, CardContent } from "@/components/ui/card";

type Mode = "json2csv" | "csv2json";

function jsonToCsv(text: string) {
  const data = JSON.parse(text);
  if (!Array.isArray(data)) throw new Error("Expected a JSON array of objects.");
  const keys = [
    ...new Set(
      data.flatMap((o) => (o && typeof o === "object" ? Object.keys(o) : [])),
    ),
  ];
  const esc = (v: unknown) => {
    const s = v == null ? "" : typeof v === "object" ? JSON.stringify(v) : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const rows = data.map((o) =>
    keys.map((k) => esc((o as Record<string, unknown>)?.[k])).join(","),
  );
  return [keys.join(","), ...rows].join("\n");
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
      continue;
    }
    if (c === '"') inQuotes = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  row.push(field);
  if (row.length > 1 || row[0] !== "") rows.push(row);
  return rows;
}

function csvToJson(text: string) {
  const rows = parseCsv(text.trim());
  if (rows.length < 1) return "[]";
  const [headers, ...body] = rows;
  const objs = body.map((r) =>
    Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ""])),
  );
  return JSON.stringify(objs, null, 2);
}

export function JsonToCsv() {
  const [mode, setMode] = React.useState<Mode>("json2csv");
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  function convert(text: string, m: Mode) {
    if (!text.trim()) {
      setOutput("");
      setError(null);
      return;
    }
    try {
      setOutput(m === "json2csv" ? jsonToCsv(text) : csvToJson(text));
      setError(null);
    } catch (e) {
      setOutput("");
      setError((e as Error).message);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="inline-flex w-fit rounded-lg bg-muted p-0.5 text-sm">
        {(
          [
            { k: "json2csv", label: "JSON → CSV" },
            { k: "csv2json", label: "CSV → JSON" },
          ] as const
        ).map((m) => (
          <button
            key={m.k}
            onClick={() => {
              setMode(m.k);
              convert(input, m.k);
            }}
            className={cn(
              "rounded-md px-3 py-1 font-medium transition-colors",
              mode === m.k ? "bg-background shadow-sm" : "text-muted-foreground",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <Textarea
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          convert(e.target.value, mode);
        }}
        placeholder={
          mode === "json2csv"
            ? '[{"name":"Ada","role":"eng"},{"name":"Bo","role":"design"}]'
            : "name,role\nAda,eng\nBo,design"
        }
        rows={6}
        className="font-mono text-xs"
      />

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => { const s = '[{"name":"Ada","role":"engineer"},{"name":"Bo","role":"designer"}]'; setInput(s); convert(s, mode); }}>Try example</Button>
        <Button variant="ghost" size="sm" onClick={() => { setInput(""); setOutput(""); setError(null); }}>Clear</Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {output && (
        <Card>
          <CardContent className="flex flex-col gap-3">
            <div className="flex justify-end">
              <CopyButton value={output} />
            </div>
            <pre className="max-h-96 overflow-auto rounded-lg bg-muted p-3 text-xs">
              <code className="font-mono">{output}</code>
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
