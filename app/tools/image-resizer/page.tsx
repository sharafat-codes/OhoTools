import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { ImageResizer } from "@/modules/tools/components/image-resizer";

const tool = getTool("image-resizer")!;

export const metadata = toolMetadata("image-resizer");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <ImageResizer />
    </ToolShell>
  );
}
