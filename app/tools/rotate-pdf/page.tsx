import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { RotatePdf } from "@/modules/tools/components/rotate-pdf";

const tool = getTool("rotate-pdf")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/rotate-pdf" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <RotatePdf />
    </ToolShell>
  );
}
