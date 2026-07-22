import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { RomanNumeral } from "@/modules/tools/components/roman-numeral";

const tool = getTool("roman-numeral")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/roman-numeral" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <RomanNumeral />
    </ToolShell>
  );
}
