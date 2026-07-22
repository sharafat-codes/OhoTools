import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { WatermarkPdf } from "@/modules/tools/components/watermark-pdf";

const tool = getTool("watermark-pdf")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/watermark-pdf" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <WatermarkPdf />
    </ToolShell>
  );
}
