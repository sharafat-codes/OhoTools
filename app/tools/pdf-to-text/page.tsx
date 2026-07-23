import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { PdfToText } from "@/modules/tools/components/pdf-to-text";

const tool = getTool("pdf-to-text")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/pdf-to-text" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <PdfToText />
    </ToolShell>
  );
}
