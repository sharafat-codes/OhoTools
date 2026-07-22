import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { MetaTagGenerator } from "@/modules/tools/components/meta-tag-generator";

const tool = getTool("meta-tag-generator")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/meta-tag-generator" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <MetaTagGenerator />
    </ToolShell>
  );
}
