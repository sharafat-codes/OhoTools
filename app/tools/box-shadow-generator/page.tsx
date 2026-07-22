import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { BoxShadowGenerator } from "@/modules/tools/components/box-shadow-generator";

const tool = getTool("box-shadow-generator")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/box-shadow-generator" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <BoxShadowGenerator />
    </ToolShell>
  );
}
