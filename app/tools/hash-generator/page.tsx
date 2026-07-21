import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { HashGenerator } from "@/modules/tools/components/hash-generator";

const tool = getTool("hash-generator")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/hash-generator" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <HashGenerator />
    </ToolShell>
  );
}
