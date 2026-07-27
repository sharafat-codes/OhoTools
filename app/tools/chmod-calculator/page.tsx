import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { ChmodCalculator } from "@/modules/tools/components/chmod-calculator";

const tool = getTool("chmod-calculator")!;

export const metadata = toolMetadata("chmod-calculator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <ChmodCalculator />
    </ToolShell>
  );
}
