import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { SalesTaxCalculator } from "@/modules/tools/components/sales-tax-calculator";

const tool = getTool("sales-tax-calculator")!;

export const metadata = toolMetadata("sales-tax-calculator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <SalesTaxCalculator />
    </ToolShell>
  );
}
