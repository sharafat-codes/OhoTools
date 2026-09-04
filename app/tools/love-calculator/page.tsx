import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { LoveCalculator } from "@/modules/tools/components/love-calculator";

const tool = getTool("love-calculator")!;

export const metadata = toolMetadata("love-calculator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <LoveCalculator />
    </ToolShell>
  );
}
