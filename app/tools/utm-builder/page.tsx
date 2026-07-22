import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { UtmBuilder } from "@/modules/tools/components/utm-builder";

const tool = getTool("utm-builder")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/utm-builder" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <UtmBuilder />
    </ToolShell>
  );
}
