import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { TextRepeater } from "@/modules/tools/components/text-repeater";

const tool = getTool("text-repeater")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/text-repeater" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <TextRepeater />
    </ToolShell>
  );
}
