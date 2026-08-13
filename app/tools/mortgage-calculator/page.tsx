import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { MortgageCalculator } from "@/modules/tools/components/mortgage-calculator";

const tool = getTool("mortgage-calculator")!;

export const metadata = toolMetadata("mortgage-calculator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <MortgageCalculator />
    </ToolShell>
  );
}
