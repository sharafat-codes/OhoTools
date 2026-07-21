import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { ColorConverter } from "@/modules/tools/components/color-converter";

const tool = getTool("color-converter")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/color-converter" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <ColorConverter />
    </ToolShell>
  );
}
