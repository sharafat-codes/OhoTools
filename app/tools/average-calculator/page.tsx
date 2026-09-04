import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AverageCalculator } from "@/modules/tools/components/average-calculator";

const tool = getTool("average-calculator")!;

export const metadata = toolMetadata("average-calculator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AverageCalculator />
    </ToolShell>
  );
}
