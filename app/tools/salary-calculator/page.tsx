import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { SalaryCalculator } from "@/modules/tools/components/salary-calculator";

const tool = getTool("salary-calculator")!;

export const metadata = toolMetadata("salary-calculator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <SalaryCalculator />
    </ToolShell>
  );
}
