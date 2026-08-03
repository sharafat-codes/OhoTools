import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { CompoundInterestCalculator } from "@/modules/tools/components/compound-interest-calculator";

const tool = getTool("compound-interest-calculator")!;

export const metadata = toolMetadata("compound-interest-calculator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <CompoundInterestCalculator />
    </ToolShell>
  );
}
