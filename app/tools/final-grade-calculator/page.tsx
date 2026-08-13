import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { FinalGradeCalculator } from "@/modules/tools/components/final-grade-calculator";

const tool = getTool("final-grade-calculator")!;

export const metadata = toolMetadata("final-grade-calculator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <FinalGradeCalculator />
    </ToolShell>
  );
}
