import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { PdfPageNumbers } from "@/modules/tools/components/pdf-page-numbers";

const tool = getTool("pdf-page-numbers")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/pdf-page-numbers" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <PdfPageNumbers />
    </ToolShell>
  );
}
