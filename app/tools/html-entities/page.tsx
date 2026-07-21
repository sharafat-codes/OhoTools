import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { HtmlEntities } from "@/modules/tools/components/html-entities";

const tool = getTool("html-entities")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/html-entities" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <HtmlEntities />
    </ToolShell>
  );
}
