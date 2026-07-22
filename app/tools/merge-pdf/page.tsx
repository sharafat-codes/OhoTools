import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { MergePdf } from "@/modules/tools/components/merge-pdf";

const tool = getTool("merge-pdf")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/merge-pdf" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <MergePdf />
    </ToolShell>
  );
}
