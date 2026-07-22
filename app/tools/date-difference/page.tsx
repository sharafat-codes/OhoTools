import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { DateDifference } from "@/modules/tools/components/date-difference";

const tool = getTool("date-difference")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/date-difference" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <DateDifference />
    </ToolShell>
  );
}
