"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/copy-button";
import { Card, CardContent } from "@/components/ui/card";

function escapeAttr(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function MetaTagGenerator() {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [image, setImage] = React.useState("");

  const t = escapeAttr(title.trim());
  const d = escapeAttr(description.trim());
  const u = escapeAttr(url.trim());
  const img = escapeAttr(image.trim());

  const lines: string[] = [];
  if (title.trim()) lines.push(`<title>${t}</title>`);
  if (description.trim()) lines.push(`<meta name="description" content="${d}" />`);
  if (url.trim()) lines.push(`<link rel="canonical" href="${u}" />`);
  if (title.trim() || description.trim() || url.trim() || image.trim()) {
    lines.push("");
    lines.push(`<meta property="og:type" content="website" />`);
    if (title.trim()) lines.push(`<meta property="og:title" content="${t}" />`);
    if (description.trim()) lines.push(`<meta property="og:description" content="${d}" />`);
    if (url.trim()) lines.push(`<meta property="og:url" content="${u}" />`);
    if (image.trim()) lines.push(`<meta property="og:image" content="${img}" />`);
    lines.push("");
    lines.push(`<meta name="twitter:card" content="summary_large_image" />`);
    if (title.trim()) lines.push(`<meta name="twitter:title" content="${t}" />`);
    if (description.trim()) lines.push(`<meta name="twitter:description" content="${d}" />`);
    if (image.trim()) lines.push(`<meta name="twitter:image" content="${img}" />`);
  }
  const output = lines.join("\n");

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="mt-title">
            Title{" "}
            <span className="text-xs text-muted-foreground">({title.length}/60)</span>
          </Label>
          <Input id="mt-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Page title" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="mt-url">Canonical URL</Label>
          <Input id="mt-url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/page" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="mt-desc">
          Description{" "}
          <span className="text-xs text-muted-foreground">({description.length}/155)</span>
        </Label>
        <Textarea id="mt-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A concise description of the page." rows={2} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="mt-image">Social image URL</Label>
        <Input id="mt-image" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://example.com/og.png" />
      </div>

      {output && (
        <Card>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Paste into your &lt;head&gt;</span>
              <CopyButton value={output} />
            </div>
            <pre className="max-h-80 overflow-auto rounded-lg bg-muted p-3 text-xs">
              <code className="font-mono">{output}</code>
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
