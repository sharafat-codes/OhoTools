import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { IdealWeightCalculator } from "@/modules/tools/components/ideal-weight-calculator";

const tool = getTool("ideal-weight-calculator")!;

export const metadata = toolMetadata("ideal-weight-calculator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <IdealWeightCalculator />
    </ToolShell>
  );
}
