import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { BmiCalculator } from "@/modules/tools/components/bmi-calculator";

const tool = getTool("bmi-calculator")!;

export const metadata = toolMetadata("bmi-calculator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <BmiCalculator />
    </ToolShell>
  );
}
