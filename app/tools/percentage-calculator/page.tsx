import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { PercentageCalculator } from "@/modules/tools/components/percentage-calculator";

const tool = getTool("percentage-calculator")!;

export const metadata = toolMetadata("percentage-calculator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <PercentageCalculator />
    </ToolShell>
  );
}
