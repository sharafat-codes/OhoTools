import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { CreditCardValidator } from "@/modules/tools/components/credit-card-validator";

const tool = getTool("credit-card-validator")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/credit-card-validator" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <CreditCardValidator />
    </ToolShell>
  );
}
