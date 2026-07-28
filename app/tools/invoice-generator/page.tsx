import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { InvoiceGenerator } from "@/modules/tools/components/invoice-generator";

const tool = getTool("invoice-generator")!;

export const metadata = toolMetadata("invoice-generator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <InvoiceGenerator />
    </ToolShell>
  );
}
