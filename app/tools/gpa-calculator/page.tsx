import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { GpaCalculator } from "@/modules/tools/components/gpa-calculator";

const tool = getTool("gpa-calculator")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/gpa-calculator" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <GpaCalculator />
    </ToolShell>
  );
}
