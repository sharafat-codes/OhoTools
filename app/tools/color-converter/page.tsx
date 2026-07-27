import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { ColorConverter } from "@/modules/tools/components/color-converter";

const tool = getTool("color-converter")!;

export const metadata = toolMetadata("color-converter");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <ColorConverter />
    </ToolShell>
  );
}
