"use client";

import { MinifyTool } from "@/modules/tools/components/minify-tool";

const SAMPLE = `// greet the user
function greet(name) {
  const message = "Hello, " + name + "!";
  console.log(message);
  return message;
}

greet("world");`;

async function minifyJs(input: string): Promise<string> {
  const { minify } = await import("terser");
  const result = await minify(input, { format: { comments: false } });
  if (result.code == null) {
    throw new Error("Could not minify — check your JavaScript for syntax errors.");
  }
  return result.code;
}

export function JsMinifier() {
  return (
    <MinifyTool
      inputLabel="JavaScript"
      placeholder="Paste your JavaScript here…"
      downloadName="minified.js"
      sample={SAMPLE}
      transform={minifyJs}
    />
  );
}
