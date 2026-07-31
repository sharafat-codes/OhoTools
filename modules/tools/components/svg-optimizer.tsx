"use client";

import { MinifyTool } from "@/modules/tools/components/minify-tool";
import { optimizeSvg } from "@/modules/tools/components/svg-lib";

const SAMPLE = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
     width="100" height="100" viewBox="0 0 100 100">
  <!-- Created with a vector editor -->
  <metadata>Some editor metadata here</metadata>
  <circle cx="50.0000000" cy="50.0000000" r="40.123456789"
          fill="#6d28d9" inkscape:label="circle" />
</svg>`;

export function SvgOptimizer() {
  return (
    <MinifyTool
      inputLabel="SVG code"
      placeholder="Paste your SVG markup here…"
      downloadName="optimized.svg"
      sample={SAMPLE}
      transform={optimizeSvg}
    />
  );
}
