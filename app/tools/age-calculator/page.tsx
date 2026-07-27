import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AgeCalculator } from "@/modules/tools/components/age-calculator";

const tool = getTool("age-calculator")!;

export const metadata = toolMetadata("age-calculator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AgeCalculator />
    </ToolShell>
  );
}
