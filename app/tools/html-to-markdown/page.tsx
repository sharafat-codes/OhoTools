import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { HtmlToMarkdown } from "@/modules/tools/components/html-to-markdown";

const tool = getTool("html-to-markdown")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/html-to-markdown" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <HtmlToMarkdown />
    </ToolShell>
  );
}
