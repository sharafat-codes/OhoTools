import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { JsonToCsv } from "@/modules/tools/components/json-to-csv";

const tool = getTool("json-to-csv")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/json-to-csv" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <JsonToCsv />
    </ToolShell>
  );
}
