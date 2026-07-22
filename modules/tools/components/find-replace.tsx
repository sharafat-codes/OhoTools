"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/copy-button";

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function FindReplace() {
  const [text, setText] = React.useState("");
  const [find, setFind] = React.useState("");
  const [replace, setReplace] = React.useState("");
  const [caseInsensitive, setCaseInsensitive] = React.useState(true);
  const [useRegex, setUseRegex] = React.useState(false);
  const [wholeWord, setWholeWord] = React.useState(false);

  let output = text;
  let count = 0;
  let error: string | null = null;

  if (find) {
    try {
      let pattern = useRegex ? find : escapeRegExp(find);
      if (wholeWord) pattern = `\\b${pattern}\\b`;
      const flags = "g" + (caseInsensitive ? "i" : "");
      const re = new RegExp(pattern, flags);
      count = (text.match(re) || []).length;
      output = text.replace(re, replace);
    } catch (e) {
      error = e instanceof Error ? e.message : "Invalid pattern";
    }
  }

  const checkbox = "size-4 rounded border-input";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="fr-text">Text</Label>
        <Textarea
          id="fr-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your text here…"
          className="min-h-32 font-mono"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => { setText("The quick brown fox. The quick brown dog."); setFind("quick"); setReplace("slow"); }}>Try example</Button>
        <Button variant="ghost" size="sm" onClick={() => { setText(""); setFind(""); setReplace(""); }}>Clear</Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="fr-find">Find</Label>
          <Input id="fr-find" value={find} onChange={(e) => setFind(e.target.value)} className="font-mono" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="fr-replace">Replace with</Label>
          <Input id="fr-replace" value={replace} onChange={(e) => setReplace(e.target.value)} className="font-mono" />
        </div>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
        <label className="flex cursor-pointer items-center gap-2">
          <input type="checkbox" checked={caseInsensitive} onChange={(e) => setCaseInsensitive(e.target.checked)} className={checkbox} />
          Case-insensitive
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input type="checkbox" checked={wholeWord} onChange={(e) => setWholeWord(e.target.checked)} className={checkbox} disabled={useRegex} />
          Whole word
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input type="checkbox" checked={useRegex} onChange={(e) => setUseRegex(e.target.checked)} className={checkbox} />
          Regex
        </label>
      </div>

      {error ? (
        <p className="text-sm text-destructive">Invalid regex: {error}</p>
      ) : (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="fr-out">
              Result {find && <span className="text-muted-foreground">· {count} match{count === 1 ? "" : "es"}</span>}
            </Label>
            <CopyButton value={output} label="" />
          </div>
          <Textarea id="fr-out" readOnly value={output} className="min-h-32 font-mono" />
        </div>
      )}
    </div>
  );
}
