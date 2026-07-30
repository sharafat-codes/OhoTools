import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { SvgToPng } from "@/modules/tools/components/svg-to-png";

const tool = getTool("svg-to-png")!;

export const metadata = toolMetadata("svg-to-png");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <SvgToPng />
    </ToolShell>
  );
}
