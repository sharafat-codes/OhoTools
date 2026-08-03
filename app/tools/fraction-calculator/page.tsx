import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { FractionCalculator } from "@/modules/tools/components/fraction-calculator";

const tool = getTool("fraction-calculator")!;

export const metadata = toolMetadata("fraction-calculator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <FractionCalculator />
    </ToolShell>
  );
}
