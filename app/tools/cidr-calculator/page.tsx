import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { CidrCalculator } from "@/modules/tools/components/cidr-calculator";

const tool = getTool("cidr-calculator")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/cidr-calculator" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <CidrCalculator />
    </ToolShell>
  );
}
