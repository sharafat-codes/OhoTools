import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { TimestampConverter } from "@/modules/tools/components/timestamp-converter";

const tool = getTool("timestamp-converter")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/timestamp-converter" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <TimestampConverter />
    </ToolShell>
  );
}
