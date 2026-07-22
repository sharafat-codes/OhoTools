import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { StripHtml } from "@/modules/tools/components/strip-html";

const tool = getTool("strip-html")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/strip-html" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <StripHtml />
    </ToolShell>
  );
}
