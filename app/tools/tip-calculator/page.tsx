import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { TipCalculator } from "@/modules/tools/components/tip-calculator";

const tool = getTool("tip-calculator")!;

export const metadata = toolMetadata("tip-calculator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <TipCalculator />
    </ToolShell>
  );
}
