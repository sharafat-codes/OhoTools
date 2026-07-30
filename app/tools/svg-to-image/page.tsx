import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { SvgToImage } from "@/modules/tools/components/svg-to-image";

const tool = getTool("svg-to-image")!;

export const metadata = toolMetadata("svg-to-image");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <SvgToImage />
    </ToolShell>
  );
}
