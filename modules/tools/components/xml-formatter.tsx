"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/copy-button";

const INDENT = "  ";
const EXAMPLE =
  '<catalog><book id="bk101"><author>Gambardella, Matthew</author><title>XML Developer\'s Guide</title><price>44.95</price></book></catalog>';

function serialize(node: Node, depth: number): string {
  const pad = INDENT.repeat(depth);
  if (node.nodeType === Node.TEXT_NODE) {
    const t = node.textContent?.trim();
    return t ? pad + t + "\n" : "";
  }
  if (node.nodeType === Node.COMMENT_NODE) return `${pad}<!--${node.textContent}-->\n`;
  if (node.nodeType === Node.CDATA_SECTION_NODE) return `${pad}<![CDATA[${node.textContent}]]>\n`;
  if (node.nodeType === Node.PROCESSING_INSTRUCTION_NODE) {
    const pi = node as ProcessingInstruction;
    return `${pad}<?${pi.target} ${pi.data}?>\n`;
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return "";

  const el = node as Element;
  const attrs = Array.from(el.attributes)
    .map((a) => ` ${a.name}="${a.value}"`)
    .join("");
  const children = Array.from(el.childNodes);
  const meaningful = children.filter(
    (c) => !(c.nodeType === Node.TEXT_NODE && !c.textContent?.trim()),
  );

  if (meaningful.length === 0) return `${pad}<${el.tagName}${attrs}/>\n`;
  if (meaningful.length === 1 && meaningful[0].nodeType === Node.TEXT_NODE) {
    return `${pad}<${el.tagName}${attrs}>${meaningful[0].textContent!.trim()}</${el.tagName}>\n`;
  }

  let out = `${pad}<${el.tagName}${attrs}>\n`;
  for (const c of meaningful) out += serialize(c, depth + 1);
  out += `${pad}</${el.tagName}>\n`;
  return out;
}

function formatXml(xml: string): { ok: boolean; result: string } {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const err = doc.querySelector("parsererror");
  if (err) {
    return { ok: false, result: err.textContent?.replace(/\s+/g, " ").trim() || "Invalid XML" };
  }
  let result = "";
  for (const c of Array.from(doc.childNodes)) result += serialize(c, 0);
  return { ok: true, result: result.trim() };
}

export function XmlFormatter() {
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  function run(minify: boolean) {
    if (!input.trim()) {
      setError("Paste some XML first.");
      setOutput("");
      return;
    }
    const { ok, result } = formatXml(input);
    if (!ok) {
      setError(result);
      setOutput("");
      return;
    }
    setError(null);
    setOutput(minify ? result.replace(/>\s+</g, "><").replace(/\n\s*/g, "") : result);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="xmlf-in">XML</Label>
        <Textarea
          id="xmlf-in"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="<root><item>value</item></root>"
          className="min-h-32 font-mono text-xs"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={() => run(false)}>Format</Button>
        <Button variant="outline" onClick={() => run(true)}>Minify</Button>
        <Button variant="outline" size="sm" onClick={() => { setInput(EXAMPLE); setOutput(""); setError(null); }}>Try example</Button>
        <Button variant="ghost" size="sm" onClick={() => { setInput(""); setOutput(""); setError(null); }}>Clear</Button>
      </div>

      {error && <p className="text-sm text-destructive break-words">Invalid XML: {error}</p>}

      {output && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="xmlf-out">Result</Label>
            <CopyButton value={output} label="" />
          </div>
          <pre className="max-h-96 overflow-auto rounded-lg bg-muted p-3 text-xs">
            <code className="font-mono">{output}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
