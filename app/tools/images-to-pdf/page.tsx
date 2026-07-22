import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { ImagesToPdf } from "@/modules/tools/components/images-to-pdf";

const tool = getTool("images-to-pdf")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/images-to-pdf" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <ImagesToPdf />
    </ToolShell>
  );
}
