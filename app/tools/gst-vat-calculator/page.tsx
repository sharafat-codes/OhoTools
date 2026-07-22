import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { GstVatCalculator } from "@/modules/tools/components/gst-vat-calculator";

const tool = getTool("gst-vat-calculator")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/gst-vat-calculator" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <GstVatCalculator />
    </ToolShell>
  );
}
