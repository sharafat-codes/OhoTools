"use client";

import * as React from "react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/copy-button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const EXAMPLE = `# Hello, world

A **markdown** example with a [link](https://ohotool.com), a list:

- One
- Two
- Three

\`\`\`js
console.log("code block");
\`\`\`

> A blockquote.`;

export function MarkdownToHtml() {
  const [input, setInput] = React.useState("");
  const [html, setHtml] = React.useState("");

  async function convert(md: string) {
    setInput(md);
    if (!md.trim()) {
      setHtml("");
      return;
    }
    const { marked } = await import("marked");
    setHtml(String(marked.parse(md, { async: false })).trim());
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="mth-in">Markdown</Label>
        <Textarea
          id="mth-in"
          value={input}
          onChange={(e) => convert(e.target.value)}
          placeholder="# Type or paste Markdown…"
          className="min-h-40 font-mono text-xs"
        />
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => convert(EXAMPLE)}>Try example</Button>
          <Button variant="ghost" size="sm" onClick={() => convert("")}>Clear</Button>
        </div>
      </div>

      {html && (
        <Tabs defaultValue="html" className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="html">HTML</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <CopyButton value={html} label="Copy HTML" />
          </div>
          <TabsContent value="html" className="mt-3">
            <pre className="max-h-96 overflow-auto rounded-lg bg-muted p-3 text-xs">
              <code className="font-mono">{html}</code>
            </pre>
          </TabsContent>
          <TabsContent value="preview" className="mt-3">
            <div
              className="max-h-96 overflow-auto rounded-lg border border-border p-4 text-sm [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_h1]:mb-2 [&_h1]:mt-3 [&_h1]:font-heading [&_h1]:text-xl [&_h1]:font-semibold [&_h2]:mb-2 [&_h2]:mt-3 [&_h2]:font-heading [&_h2]:text-lg [&_h2]:font-semibold [&_li]:ml-4 [&_li]:list-disc [&_p]:mb-2 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-3"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
