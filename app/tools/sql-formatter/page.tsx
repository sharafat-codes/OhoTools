import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { SqlFormatter } from "@/modules/tools/components/sql-formatter";

const tool = getTool("sql-formatter")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/sql-formatter" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <SqlFormatter />
    </ToolShell>
  );
}
