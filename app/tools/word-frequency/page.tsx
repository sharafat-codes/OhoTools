import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { WordFrequency } from "@/modules/tools/components/word-frequency";

const tool = getTool("word-frequency")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/word-frequency" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <WordFrequency />
    </ToolShell>
  );
}
