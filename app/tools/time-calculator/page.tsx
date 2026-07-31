import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { TimeCalculator } from "@/modules/tools/components/time-calculator";

const tool = getTool("time-calculator")!;

export const metadata = toolMetadata("time-calculator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <TimeCalculator />
    </ToolShell>
  );
}
