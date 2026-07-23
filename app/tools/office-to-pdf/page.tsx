import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { OfficeToPdf } from "@/modules/tools/components/office-to-pdf";

const tool = getTool("office-to-pdf")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/office-to-pdf" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <OfficeToPdf />
    </ToolShell>
  );
}
