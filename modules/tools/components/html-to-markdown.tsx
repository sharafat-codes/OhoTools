"use client";

import * as React from "react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/copy-button";

const EXAMPLE = `<h1>Hello, world</h1>
<p>An <strong>HTML</strong> example with a <a href="https://ohotool.com">link</a>.</p>
<ul><li>One</li><li>Two</li></ul>
<pre><code>console.log("code");</code></pre>`;

export function HtmlToMarkdown() {
  const [input, setInput] = React.useState("");
  const [markdown, setMarkdown] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  async function convert(html: string) {
    setInput(html);
    if (!html.trim()) {
      setMarkdown("");
      setError(null);
      return;
    }
    try {
      const { default: TurndownService } = await import("turndown");
      const td = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced" });
      setMarkdown(td.turndown(html));
      setError(null);
    } catch (e) {
      setError((e as Error).message || "Could not convert that HTML.");
      setMarkdown("");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="htm-in">HTML</Label>
        <Textarea
          id="htm-in"
          value={input}
          onChange={(e) => convert(e.target.value)}
          placeholder="Paste HTML to convert to Markdown…"
          className="min-h-40 font-mono text-xs"
        />
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => convert(EXAMPLE)}>Try example</Button>
          <Button variant="ghost" size="sm" onClick={() => convert("")}>Clear</Button>
        </div>
      </div>

      {error && <p className="text-sm text-destructive break-words">{error}</p>}

      {markdown && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="htm-out">Markdown</Label>
            <CopyButton value={markdown} label="" />
          </div>
          <pre className="max-h-96 overflow-auto rounded-lg bg-muted p-3 text-xs">
            <code className="font-mono whitespace-pre-wrap">{markdown}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
