import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { UnitConverter } from "@/modules/tools/components/unit-converter";

const tool = getTool("unit-converter")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/unit-converter" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <UnitConverter />
    </ToolShell>
  );
}
