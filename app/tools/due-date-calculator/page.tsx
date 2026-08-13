import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { DueDateCalculator } from "@/modules/tools/components/due-date-calculator";

const tool = getTool("due-date-calculator")!;

export const metadata = toolMetadata("due-date-calculator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <DueDateCalculator />
    </ToolShell>
  );
}
