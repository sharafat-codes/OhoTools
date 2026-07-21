import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { RegexTester } from "@/modules/tools/components/regex-tester";

const tool = getTool("regex-tester")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/regex-tester" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <RegexTester />
    </ToolShell>
  );
}
