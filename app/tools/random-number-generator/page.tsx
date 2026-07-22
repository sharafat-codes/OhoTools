import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { RandomNumberGenerator } from "@/modules/tools/components/random-number-generator";

const tool = getTool("random-number-generator")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/random-number-generator" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <RandomNumberGenerator />
    </ToolShell>
  );
}
