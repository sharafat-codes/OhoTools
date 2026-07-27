import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { DiscountCalculator } from "@/modules/tools/components/discount-calculator";

const tool = getTool("discount-calculator")!;

export const metadata = toolMetadata("discount-calculator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <DiscountCalculator />
    </ToolShell>
  );
}
