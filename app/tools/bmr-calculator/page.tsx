import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { BmrCalculator } from "@/modules/tools/components/bmr-calculator";

const tool = getTool("bmr-calculator")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/bmr-calculator" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <BmrCalculator />
    </ToolShell>
  );
}
