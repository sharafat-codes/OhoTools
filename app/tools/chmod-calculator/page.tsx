import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { ChmodCalculator } from "@/modules/tools/components/chmod-calculator";

const tool = getTool("chmod-calculator")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/chmod-calculator" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <ChmodCalculator />
    </ToolShell>
  );
}
