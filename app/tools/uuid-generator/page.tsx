import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { UuidTool } from "@/modules/tools/components/uuid-tool";

const tool = getTool("uuid-generator")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/uuid-generator" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <UuidTool />
    </ToolShell>
  );
}
