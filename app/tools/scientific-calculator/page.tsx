import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { ScientificCalculator } from "@/modules/tools/components/scientific-calculator";

const tool = getTool("scientific-calculator")!;

export const metadata = toolMetadata("scientific-calculator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <ScientificCalculator />
    </ToolShell>
  );
}
