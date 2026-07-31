import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { SvgOptimizer } from "@/modules/tools/components/svg-optimizer";

const tool = getTool("svg-optimizer")!;

export const metadata = toolMetadata("svg-optimizer");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <SvgOptimizer />
    </ToolShell>
  );
}
