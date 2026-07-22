import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { DiscountCalculator } from "@/modules/tools/components/discount-calculator";

const tool = getTool("discount-calculator")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/discount-calculator" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <DiscountCalculator />
    </ToolShell>
  );
}
