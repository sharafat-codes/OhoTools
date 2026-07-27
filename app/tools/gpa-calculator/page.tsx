import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { GpaCalculator } from "@/modules/tools/components/gpa-calculator";

const tool = getTool("gpa-calculator")!;

export const metadata = toolMetadata("gpa-calculator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <GpaCalculator />
    </ToolShell>
  );
}
