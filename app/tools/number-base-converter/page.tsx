import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { NumberBase } from "@/modules/tools/components/number-base";

const tool = getTool("number-base-converter")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/number-base-converter" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <NumberBase />
    </ToolShell>
  );
}
