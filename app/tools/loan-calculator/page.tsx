import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { LoanCalculator } from "@/modules/tools/components/loan-calculator";

const tool = getTool("loan-calculator")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/loan-calculator" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <LoanCalculator />
    </ToolShell>
  );
}
