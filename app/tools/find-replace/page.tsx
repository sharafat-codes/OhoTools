import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { FindReplace } from "@/modules/tools/components/find-replace";

const tool = getTool("find-replace")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/find-replace" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <FindReplace />
    </ToolShell>
  );
}
