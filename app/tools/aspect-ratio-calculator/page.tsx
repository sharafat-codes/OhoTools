import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AspectRatioCalculator } from "@/modules/tools/components/aspect-ratio-calculator";

const tool = getTool("aspect-ratio-calculator")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/aspect-ratio-calculator" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AspectRatioCalculator />
    </ToolShell>
  );
}
