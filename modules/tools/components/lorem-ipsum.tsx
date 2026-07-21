"use client";

import * as React from "react";
import { RefreshCwIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/copy-button";
import { Card, CardContent } from "@/components/ui/card";

const WORDS =
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum".split(
    " ",
  );

type Unit = "paragraphs" | "sentences" | "words";

function pick() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}
function sentence() {
  const len = 6 + Math.floor(Math.random() * 8);
  const words = Array.from({ length: len }, pick);
  const s = words.join(" ");
  return s.charAt(0).toUpperCase() + s.slice(1) + ".";
}
function paragraph(first: boolean) {
  const count = 3 + Math.floor(Math.random() * 4);
  const sentences = Array.from({ length: count }, sentence);
  if (first) sentences[0] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
  return sentences.join(" ");
}

export function LoremIpsum() {
  const [count, setCount] = React.useState(3);
  const [unit, setUnit] = React.useState<Unit>("paragraphs");
  const [output, setOutput] = React.useState("");

  function generate() {
    const n = Math.min(50, Math.max(1, count));
    if (unit === "paragraphs") {
      setOutput(Array.from({ length: n }, (_, i) => paragraph(i === 0)).join("\n\n"));
    } else if (unit === "sentences") {
      setOutput(Array.from({ length: n }, sentence).join(" "));
    } else {
      setOutput(Array.from({ length: n }, pick).join(" ") + ".");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lorem-count">Amount</Label>
          <Input
            id="lorem-count"
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-24"
          />
        </div>
        <div className="inline-flex rounded-lg bg-muted p-0.5">
          {(["paragraphs", "sentences", "words"] as Unit[]).map((u) => (
            <button
              key={u}
              onClick={() => setUnit(u)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors",
                unit === u ? "bg-background shadow-sm" : "text-muted-foreground",
              )}
            >
              {u}
            </button>
          ))}
        </div>
        <Button onClick={generate}>
          <RefreshCwIcon />
          Generate
        </Button>
      </div>

      {output && (
        <Card>
          <CardContent className="flex flex-col gap-3">
            <div className="flex justify-end">
              <CopyButton value={output} />
            </div>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              {output.split("\n\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
