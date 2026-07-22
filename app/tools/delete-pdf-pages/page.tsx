import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { DeletePdfPages } from "@/modules/tools/components/delete-pdf-pages";

const tool = getTool("delete-pdf-pages")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/delete-pdf-pages" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <DeletePdfPages />
    </ToolShell>
  );
}
