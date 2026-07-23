import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { XmlFormatter } from "@/modules/tools/components/xml-formatter";

const tool = getTool("xml-formatter")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/xml-formatter" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <XmlFormatter />
    </ToolShell>
  );
}
