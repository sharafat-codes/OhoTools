import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { JsonFormatter } from "@/modules/tools/components/json-formatter";

const tool = getTool("json-formatter")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/json-formatter" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <JsonFormatter />
    </ToolShell>
  );
}
