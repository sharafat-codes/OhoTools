import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { SplitPdf } from "@/modules/tools/components/split-pdf";

const tool = getTool("split-pdf")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/split-pdf" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <SplitPdf />
    </ToolShell>
  );
}
