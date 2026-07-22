"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/copy-button";
import { Card, CardContent } from "@/components/ui/card";

// Combining diacritical marks (U+0300–U+036F); built via RegExp so the source
// contains no literal combining characters.
const COMBINING_MARKS = new RegExp("[\\u0300-\\u036f]", "g");

function slugify(text: string) {
  return text
    .normalize("NFKD")
    .replace(COMBINING_MARKS, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function Slugify() {
  const [text, setText] = React.useState("");
  const slug = slugify(text);

  return (
    <div className="flex flex-col gap-4">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="My Awesome Blog Post!"
      />
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => setText("My Awesome Blog Post! (2024 Edition)")}>Try example</Button>
        <Button variant="ghost" size="sm" onClick={() => setText("")}>Clear</Button>
      </div>
      {slug && (
        <Card>
          <CardContent className="flex items-center justify-between gap-3">
            <code className="truncate font-mono text-sm">{slug}</code>
            <CopyButton value={slug} label="" />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
