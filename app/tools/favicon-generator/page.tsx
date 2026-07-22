import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { FaviconGenerator } from "@/modules/tools/components/favicon-generator";

const tool = getTool("favicon-generator")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/favicon-generator" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <FaviconGenerator />
    </ToolShell>
  );
}
