"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/copy-button";

const selectClass =
  "h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

export function TextRepeater() {
  const [text, setText] = React.useState("");
  const [count, setCount] = React.useState("10");
  const [sep, setSep] = React.useState("newline");
  const [numbered, setNumbered] = React.useState(false);

  const n = Math.min(Math.max(parseInt(count) || 0, 0), 100000);
  const separator = sep === "newline" ? "\n" : sep === "space" ? " " : sep === "comma" ? ", " : "";

  const output =
    text && n > 0
      ? Array.from({ length: n }, (_, i) => (numbered ? `${i + 1}. ${text}` : text)).join(separator)
      : "";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="tr-text">Text to repeat</Label>
        <Textarea
          id="tr-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text…"
          className="min-h-24"
        />
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex w-28 flex-col gap-1.5">
          <Label htmlFor="tr-count">Times</Label>
          <Input id="tr-count" type="number" min={1} value={count} onChange={(e) => setCount(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="tr-sep">Separator</Label>
          <select id="tr-sep" value={sep} onChange={(e) => setSep(e.target.value)} className={selectClass}>
            <option value="newline">New line</option>
            <option value="space">Space</option>
            <option value="comma">Comma</option>
            <option value="none">None</option>
          </select>
        </div>
        <label className="flex h-9 cursor-pointer items-center gap-2 text-sm">
          <input type="checkbox" checked={numbered} onChange={(e) => setNumbered(e.target.checked)} className="size-4 rounded border-input" />
          Number each line
        </label>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="tr-out">
            Result {output && <span className="text-muted-foreground">· {output.length.toLocaleString()} chars</span>}
          </Label>
          <CopyButton value={output} label="" />
        </div>
        <Textarea id="tr-out" readOnly value={output} className="min-h-32 font-mono" />
      </div>
    </div>
  );
}
