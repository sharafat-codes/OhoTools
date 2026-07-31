"use client";

import * as React from "react";
import { toast } from "sonner";
import { ArrowLeftRightIcon, CopyIcon } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Dir = "json2xml" | "xml2json";

async function convert(input: string, dir: Dir): Promise<string> {
  const { XMLParser, XMLBuilder } = await import("fast-xml-parser");
  if (dir === "json2xml") {
    const obj = JSON.parse(input);
    const builder = new XMLBuilder({
      format: true,
      indentBy: "  ",
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      suppressEmptyNode: true,
    });
    return builder.build(obj).trim();
  }
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    parseAttributeValue: true,
    trimValues: true,
  });
  return JSON.stringify(parser.parse(input), null, 2);
}

const SAMPLE_JSON = `{
  "note": {
    "to": "Sam",
    "from": "Alex",
    "body": "Hello there"
  }
}`;

export function JsonXml() {
  const [input, setInput] = React.useState("");
  const [dir, setDir] = React.useState<Dir>("json2xml");
  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    const id = setTimeout(async () => {
      if (!input.trim()) {
        setOutput("");
        setError(null);
        return;
      }
      try {
        const out = await convert(input, dir);
        if (!cancelled) {
          setOutput(out);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setOutput("");
          setError((e as Error).message || "Invalid input for this direction.");
        }
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [input, dir]);

  function swap() {
    setDir((d) => (d === "json2xml" ? "xml2json" : "json2xml"));
    setInput(output || SAMPLE_JSON);
  }

  function copy() {
    navigator.clipboard?.writeText(output).then(
      () => toast.success("Copied output"),
      () => toast.error("Could not copy."),
    );
  }

  const [inLabel, outLabel] = dir === "json2xml" ? ["JSON", "XML"] : ["XML", "JSON"];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {(["json2xml", "xml2json"] as const).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDir(d)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
              dir === d ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted/40",
            )}
          >
            {d === "json2xml" ? "JSON → XML" : "XML → JSON"}
          </button>
        ))}
        <Button variant="ghost" size="sm" onClick={swap} className="ml-auto">
          <ArrowLeftRightIcon className="size-3.5" />
          Swap
        </Button>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="jx-in">{inLabel}</Label>
          {dir === "json2xml" && (
            <button type="button" onClick={() => setInput(SAMPLE_JSON)} className="text-xs font-medium text-primary hover:underline">
              Paste sample
            </button>
          )}
        </div>
        <textarea
          id="jx-in"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
          rows={8}
          placeholder={dir === "json2xml" ? "Paste JSON here…" : "Paste XML here…"}
          className="w-full resize-y rounded-lg border border-input bg-transparent p-3 font-mono text-xs leading-relaxed outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {output && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label>{outLabel}</Label>
            <Button variant="outline" size="sm" onClick={copy}>
              <CopyIcon className="size-3.5" />
              Copy
            </Button>
          </div>
          <textarea
            readOnly
            value={output}
            rows={8}
            className="w-full resize-y rounded-lg border border-border bg-muted/30 p-3 font-mono text-xs leading-relaxed outline-none"
          />
        </div>
      )}
    </div>
  );
}
