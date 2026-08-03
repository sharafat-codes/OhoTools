import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { CalorieCalculator } from "@/modules/tools/components/calorie-calculator";

const tool = getTool("calorie-calculator")!;

export const metadata = toolMetadata("calorie-calculator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <CalorieCalculator />
    </ToolShell>
  );
}
