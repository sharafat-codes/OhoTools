import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { CompressPdf } from "@/modules/tools/components/compress-pdf";

const tool = getTool("compress-pdf")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/compress-pdf" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <CompressPdf />
    </ToolShell>
  );
}
