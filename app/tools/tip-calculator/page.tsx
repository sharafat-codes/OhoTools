import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { TipCalculator } from "@/modules/tools/components/tip-calculator";

const tool = getTool("tip-calculator")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/tip-calculator" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <TipCalculator />
    </ToolShell>
  );
}
