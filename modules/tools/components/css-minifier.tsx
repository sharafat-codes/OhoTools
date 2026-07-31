"use client";

import { MinifyTool } from "@/modules/tools/components/minify-tool";

const SAMPLE = `/* primary button */
.button {
  color: #6d28d9;
  background: #ffffff;
  padding: 10px   20px;
  margin: 0px;
  border-radius: 8px;
}

.button:hover {
  color: #a855f7;
}`;

async function minifyCss(input: string): Promise<string> {
  const { minify } = await import("csso");
  return minify(input).css;
}

export function CssMinifier() {
  return (
    <MinifyTool
      inputLabel="CSS"
      placeholder="Paste your CSS here…"
      downloadName="minified.css"
      sample={SAMPLE}
      transform={minifyCss}
    />
  );
}
