"use client";

import * as React from "react";

import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/components/copy-button";

// Minimal RFC-4180-ish CSV parser: handles quoted fields, escaped quotes ("")
// inside quotes, and commas/newlines within quotes.
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  let i = 0;
  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
        inQuotes = false; i++; continue;
      }
      field += c; i++; continue;
    }
    if (c === '"') { inQuotes = true; i++; continue; }
    if (c === ",") { row.push(field); field = ""; i++; continue; }
    if (c === "\r") { i++; continue; }
    if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; i++; continue; }
    field += c; i++;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.length > 1 || r[0] !== "");
}

export function CsvToJson() {
  const [input, setInput] = React.useState("");
  const [headers, setHeaders] = React.useState(true);
  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState("");

  function convert(text: string, useHeaders: boolean) {
    if (!text.trim()) { setOutput(""); setError(""); return; }
    try {
      const rows = parseCsv(text);
      if (!rows.length) { setOutput("[]"); setError(""); return; }
      let json: unknown;
      if (useHeaders) {
        const cols = rows[0];
        json = rows.slice(1).map((r) => {
          const o: Record<string, string> = {};
          cols.forEach((c, idx) => { o[c] = r[idx] ?? ""; });
          return o;
        });
      } else {
        json = rows;
      }
      setOutput(JSON.stringify(json, null, 2));
      setError("");
    } catch {
      setOutput("");
      setError("Couldn't parse that CSV. Check for unbalanced quotes.");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Textarea
        value={input}
        onChange={(e) => { setInput(e.target.value); convert(e.target.value, headers); }}
        rows={6}
        placeholder={"name,email,age\nAli,ali@example.com,28\nSara,sara@example.com,31"}
        className="font-mono text-xs"
      />
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm font-medium select-none">
          <input
            type="checkbox"
            checked={headers}
            onChange={(e) => { setHeaders(e.target.checked); convert(input, e.target.checked); }}
            className="size-4 accent-primary"
          />
          First row is headers
        </label>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {output && (
        <Card>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">JSON output</span>
              <CopyButton value={output} />
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
