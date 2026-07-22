"use client";

import * as React from "react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/copy-button";

const EXAMPLE = `<article>
  <h1>Hello, world</h1>
  <p>This is <strong>bold</strong> and <a href="#">a link</a>.</p>
  <ul><li>One</li><li>Two</li></ul>
</article>`;

function strip(html: string, keepLines: boolean): string {
  if (!html.trim()) return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  if (keepLines) {
    doc.querySelectorAll("br").forEach((br) => br.replaceWith("\n"));
    doc
      .querySelectorAll("p, div, li, tr, h1, h2, h3, h4, h5, h6, blockquote, section, article")
      .forEach((el) => el.append("\n"));
  }
  let text = doc.body.textContent ?? "";
  text = keepLines ? text.replace(/\n[ \t]+/g, "\n").replace(/\n{3,}/g, "\n\n") : text.replace(/\s+/g, " ");
  return text.trim();
}

export function StripHtml() {
  const [input, setInput] = React.useState("");
  const [keepLines, setKeepLines] = React.useState(true);
  const [output, setOutput] = React.useState("");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="sh-in">HTML</Label>
        <Textarea
          id="sh-in"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setOutput(strip(e.target.value, keepLines));
          }}
          placeholder="Paste HTML to strip the tags…"
          className="min-h-32 font-mono text-xs"
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={keepLines}
            onChange={(e) => {
              setKeepLines(e.target.checked);
              setOutput(strip(input, e.target.checked));
            }}
            className="size-4 rounded border-input"
          />
          Keep line breaks
        </label>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setInput(EXAMPLE);
              setOutput(strip(EXAMPLE, keepLines));
            }}
          >
            Try example
          </Button>
          <Button variant="ghost" size="sm" onClick={() => { setInput(""); setOutput(""); }}>
            Clear
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="sh-out">Plain text</Label>
          <CopyButton value={output} label="" />
        </div>
        <Textarea id="sh-out" readOnly value={output} className="min-h-32" placeholder="Plain text output…" />
      </div>
    </div>
  );
}
