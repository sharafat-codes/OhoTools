import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { JsonYaml } from "@/modules/tools/components/json-yaml";

const tool = getTool("json-yaml")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/json-yaml" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <JsonYaml />
    </ToolShell>
  );
}
