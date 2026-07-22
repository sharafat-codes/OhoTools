import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { TimezoneConverter } from "@/modules/tools/components/timezone-converter";

const tool = getTool("timezone-converter")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/timezone-converter" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <TimezoneConverter />
    </ToolShell>
  );
}
