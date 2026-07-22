import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { CssGradientGenerator } from "@/modules/tools/components/css-gradient-generator";

const tool = getTool("css-gradient-generator")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/css-gradient-generator" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <CssGradientGenerator />
    </ToolShell>
  );
}
