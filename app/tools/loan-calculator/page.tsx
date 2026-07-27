import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { LoanCalculator } from "@/modules/tools/components/loan-calculator";

const tool = getTool("loan-calculator")!;

export const metadata = toolMetadata("loan-calculator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <LoanCalculator />
    </ToolShell>
  );
}
