"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/copy-button";
import { Card, CardContent } from "@/components/ui/card";

const OPTIONS = [
  { key: "trim", label: "Trim whitespace" },
  { key: "removeEmpty", label: "Remove empty lines" },
  { key: "dedupe", label: "Remove duplicates" },
  { key: "sort", label: "Sort A–Z" },
  { key: "caseInsensitive", label: "Ignore case" },
  { key: "reverse", label: "Reverse order" },
] as const;

type OptKey = (typeof OPTIONS)[number]["key"];

export function LineSorter() {
  const [text, setText] = React.useState("");
  const [opts, setOpts] = React.useState<Record<OptKey, boolean>>({
    trim: true,
    removeEmpty: true,
    dedupe: true,
    sort: true,
    caseInsensitive: false,
    reverse: false,
  });

  let lines = text.split("\n");
  if (opts.trim) lines = lines.map((l) => l.trim());
  if (opts.removeEmpty) lines = lines.filter((l) => l !== "");
  if (opts.dedupe) {
    const seen = new Set<string>();
    lines = lines.filter((l) => {
      const k = opts.caseInsensitive ? l.toLowerCase() : l;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }
  if (opts.sort) {
    lines = [...lines].sort((a, b) =>
      opts.caseInsensitive
        ? a.toLowerCase().localeCompare(b.toLowerCase())
        : a.localeCompare(b),
    );
  }
  if (opts.reverse) lines = [...lines].reverse();

  const output = lines.join("\n");
  const inputCount = text.trim() ? text.split("\n").length : 0;

  return (
    <div className="flex flex-col gap-4">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={"banana\napple\napple\ncherry"}
        rows={7}
        className="font-mono text-xs"
      />

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => setText("banana\napple\ncherry\napple\ndate\nbanana\nelderberry")}>Try example</Button>
        <Button variant="ghost" size="sm" onClick={() => setText("")}>Clear</Button>
      </div>

      <div className="flex flex-wrap gap-3">
        {OPTIONS.map((o) => (
          <label key={o.key} className="flex items-center gap-1.5 text-sm">
            <input
              type="checkbox"
              checked={opts[o.key]}
              onChange={(e) => setOpts((s) => ({ ...s, [o.key]: e.target.checked }))}
              className="size-4 accent-primary"
            />
            {o.label}
          </label>
        ))}
      </div>

      {output && (
        <Card>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {inputCount} → {lines.length} lines
              </span>
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
