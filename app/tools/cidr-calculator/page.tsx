import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { CidrCalculator } from "@/modules/tools/components/cidr-calculator";

const tool = getTool("cidr-calculator")!;

export const metadata = toolMetadata("cidr-calculator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <CidrCalculator />
    </ToolShell>
  );
}
