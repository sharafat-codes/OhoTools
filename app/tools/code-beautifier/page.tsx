import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { CodeBeautifier } from "@/modules/tools/components/code-beautifier";

const tool = getTool("code-beautifier")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/code-beautifier" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <CodeBeautifier />
    </ToolShell>
  );
}
