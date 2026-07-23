import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { DocConvert } from "@/modules/tools/components/doc-convert";

const tool = getTool("pdf-to-word")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/pdf-to-word" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <DocConvert
        op="pdf-to-word"
        accept=".pdf"
        inLabel="PDF"
        outExt="docx"
        actionLabel="Convert to Word"
        hint="A PDF file — up to 15 MB."
      />
    </ToolShell>
  );
}
