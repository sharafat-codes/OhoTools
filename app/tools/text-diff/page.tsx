import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { TextDiff } from "@/modules/tools/components/text-diff";

const tool = getTool("text-diff")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/text-diff" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <TextDiff />
    </ToolShell>
  );
}
