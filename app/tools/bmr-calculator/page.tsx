import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { BmrCalculator } from "@/modules/tools/components/bmr-calculator";

const tool = getTool("bmr-calculator")!;

export const metadata = toolMetadata("bmr-calculator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <BmrCalculator />
    </ToolShell>
  );
}
