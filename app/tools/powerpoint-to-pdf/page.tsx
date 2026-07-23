import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { DocConvert } from "@/modules/tools/components/doc-convert";

const tool = getTool("powerpoint-to-pdf")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/powerpoint-to-pdf" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <DocConvert
        op="to-pdf"
        accept=".ppt,.pptx,.odp"
        inLabel="PowerPoint file"
        outExt="pdf"
        actionLabel="Convert to PDF"
        hint="PowerPoint .ppt or .pptx — up to 15 MB."
      />
    </ToolShell>
  );
}
