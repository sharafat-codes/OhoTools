import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { CaseConverter } from "@/modules/tools/components/case-converter";

const tool = getTool("case-converter")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/case-converter" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <CaseConverter />
    </ToolShell>
  );
}
