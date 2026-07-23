import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { MarkdownToHtml } from "@/modules/tools/components/markdown-to-html";

const tool = getTool("markdown-to-html")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/markdown-to-html" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <MarkdownToHtml />
    </ToolShell>
  );
}
