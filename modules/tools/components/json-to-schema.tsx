"use client";

import * as React from "react";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/copy-button";

// Infer a JSON Schema (draft-07) from an example JSON value. Objects list all
// keys as required (a sensible default for a single example); arrays are typed
// from their first item.
function infer(value: unknown): Record<string, unknown> {
  if (value === null) return { type: "null" };
  if (Array.isArray(value)) {
    return value.length === 0 ? { type: "array", items: {} } : { type: "array", items: infer(value[0]) };
  }
  const t = typeof value;
  if (t === "object") {
    const properties: Record<string, unknown> = {};
    const required: string[] = [];
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      properties[k] = infer(v);
      required.push(k);
    }
    const schema: Record<string, unknown> = { type: "object", properties };
    if (required.length) schema.required = required;
    return schema;
  }
  if (t === "number") return { type: Number.isInteger(value as number) ? "integer" : "number" };
  if (t === "boolean") return { type: "boolean" };
  return { type: "string" };
}

function generate(json: string): { ok: true; schema: string } | { ok: false; error: string } {
  const trimmed = json.trim();
  if (!trimmed) return { ok: false, error: "" };
  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch (e) {
    return { ok: false, error: `Invalid JSON — ${(e as Error).message}` };
  }
  const schema = { $schema: "http://json-schema.org/draft-07/schema#", ...infer(parsed) };
  return { ok: true, schema: JSON.stringify(schema, null, 2) };
}

export function JsonToSchema() {
  const [input, setInput] = React.useState(`{
  "id": 1,
  "name": "Alex",
  "active": true,
  "tags": ["admin", "editor"],
  "profile": { "age": 30, "city": "NYC" }
}`);

  const result = React.useMemo(() => generate(input), [input]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="js-in">Example JSON</Label>
        <Textarea
          id="js-in"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{ "name": "Alex" }'
          className="min-h-72 font-mono text-xs"
        />
        {!result.ok && result.error && <p className="text-sm text-destructive">{result.error}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="js-out">JSON Schema (draft-07)</Label>
          {result.ok && <CopyButton value={result.schema} label="" />}
        </div>
        <pre className="min-h-72 min-w-0 overflow-auto rounded-lg border border-border bg-muted/40 p-4 text-xs leading-relaxed">
          <code className="font-mono">{result.ok ? result.schema : "—"}</code>
        </pre>
      </div>
    </div>
  );
}
