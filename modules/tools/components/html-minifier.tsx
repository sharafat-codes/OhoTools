"use client";

import { MinifyTool } from "@/modules/tools/components/minify-tool";
import { minifyHtml } from "@/modules/tools/components/minify-lib";

const SAMPLE = `<!doctype html>
<html>
  <head>
    <!-- page metadata -->
    <title>Example page</title>
  </head>
  <body>
    <h1>Hello world</h1>
    <p>   This   paragraph   has   lots   of   spacing.   </p>
  </body>
</html>`;

export function HtmlMinifier() {
  return (
    <MinifyTool
      inputLabel="HTML"
      placeholder="Paste your HTML here…"
      downloadName="minified.html"
      sample={SAMPLE}
      transform={minifyHtml}
    />
  );
}
