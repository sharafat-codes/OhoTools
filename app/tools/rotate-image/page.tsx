import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { RotateImage } from "@/modules/tools/components/rotate-image";

const tool = getTool("rotate-image")!;

export const metadata = toolMetadata("rotate-image");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <RotateImage />
    </ToolShell>
  );
}
