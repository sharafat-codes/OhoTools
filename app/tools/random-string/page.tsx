import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { RandomString } from "@/modules/tools/components/random-string";

const tool = getTool("random-string")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/random-string" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <RandomString />
    </ToolShell>
  );
}
