import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { PercentageCalculator } from "@/modules/tools/components/percentage-calculator";

const tool = getTool("percentage-calculator")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/percentage-calculator" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <PercentageCalculator />
    </ToolShell>
  );
}
