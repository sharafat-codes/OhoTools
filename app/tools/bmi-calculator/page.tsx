import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { BmiCalculator } from "@/modules/tools/components/bmi-calculator";

const tool = getTool("bmi-calculator")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/bmi-calculator" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <BmiCalculator />
    </ToolShell>
  );
}
