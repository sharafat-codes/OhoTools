import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AgeCalculator } from "@/modules/tools/components/age-calculator";

const tool = getTool("age-calculator")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/age-calculator" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AgeCalculator />
    </ToolShell>
  );
}
