"use client";

import * as React from "react";
import { AlertCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/copy-button";
import { Card, CardContent } from "@/components/ui/card";

function safeKey(k: string) {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k) ? k : JSON.stringify(k);
}

function toType(value: unknown, indent: number): string {
  if (value === null) return "null";
  if (Array.isArray(value)) {
    if (value.length === 0) return "unknown[]";
    const el = toType(value[0], indent);
    return el.includes("\n") ? `Array<${el}>` : `${el}[]`;
  }
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return "Record<string, unknown>";
    const pad = "  ".repeat(indent + 1);
    const lines = entries.map(([k, v]) => `${pad}${safeKey(k)}: ${toType(v, indent + 1)};`);
    return `{\n${lines.join("\n")}\n${"  ".repeat(indent)}}`;
  }
  if (typeof value === "string") return "string";
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "boolean";
  return "unknown";
}

function generate(json: string): string {
  const value = JSON.parse(json);
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return `interface Root ${toType(value, 0)}`;
  }
  return `type Root = ${toType(value, 0)};`;
}

export function JsonToTypescript() {
  const [input, setInput] = React.useState("");

  let output = "";
  let error: string | null = null;
  if (input.trim()) {
    try {
      output = generate(input);
    } catch (e) {
      error = (e as Error).message;
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='{"id":1,"name":"Ada","tags":["a","b"],"address":{"city":"London"}}'
        rows={6}
        className="font-mono text-xs"
      />

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => setInput('{"id":1,"name":"Ada","tags":["a","b"],"address":{"city":"London"}}')}>Try example</Button>
        <Button variant="ghost" size="sm" onClick={() => setInput("")}>Clear</Button>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
          <span>Invalid JSON: {error}</span>
        </div>
      )}

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
