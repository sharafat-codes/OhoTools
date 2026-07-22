"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/copy-button";

const selectClass =
  "h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

export function RemoveLineBreaks() {
  const [text, setText] = React.useState("");
  const [replaceWith, setReplaceWith] = React.useState("space");
  const [removeBlank, setRemoveBlank] = React.useState(false);
  const [trimLines, setTrimLines] = React.useState(true);

  let output = text;

  if (trimLines || removeBlank) {
    let lines = output.split(/\r?\n/);
    if (trimLines) lines = lines.map((l) => l.trim());
    if (removeBlank) lines = lines.filter((l) => l.length > 0);
    output = lines.join("\n");
  }

  const joiner = replaceWith === "space" ? " " : replaceWith === "comma" ? ", " : "";
  if (replaceWith !== "keep") {
    output = output.replace(/\r?\n/g, joiner);
    if (replaceWith === "space" || replaceWith === "comma") {
      output = output.replace(replaceWith === "space" ? / {2,}/g : /(,\s){2,}/g, replaceWith === "space" ? " " : ", ").trim();
    }
  }

  const checkbox = "size-4 rounded border-input";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="rlb-text">Text</Label>
        <Textarea
          id="rlb-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste text with line breaks…"
          className="min-h-32"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => setText("The quick brown fox\njumps over\n\nthe lazy dog")}>Try example</Button>
        <Button variant="ghost" size="sm" onClick={() => setText("")}>Clear</Button>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <div className="flex items-center gap-2">
          <Label htmlFor="rlb-mode" className="whitespace-nowrap">
            Replace breaks with
          </Label>
          <select id="rlb-mode" value={replaceWith} onChange={(e) => setReplaceWith(e.target.value)} className={selectClass}>
            <option value="space">A space</option>
            <option value="comma">A comma</option>
            <option value="">Nothing</option>
            <option value="keep">Keep line breaks</option>
          </select>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input type="checkbox" checked={trimLines} onChange={(e) => setTrimLines(e.target.checked)} className={checkbox} />
          Trim each line
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input type="checkbox" checked={removeBlank} onChange={(e) => setRemoveBlank(e.target.checked)} className={checkbox} />
          Remove blank lines
        </label>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="rlb-out">Result</Label>
          <CopyButton value={output} label="" />
        </div>
        <Textarea id="rlb-out" readOnly value={output} className="min-h-32" />
      </div>
    </div>
  );
}
