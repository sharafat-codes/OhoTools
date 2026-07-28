import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { ImageToIco } from "@/modules/tools/components/image-to-ico";

const tool = getTool("image-to-ico")!;

export const metadata = toolMetadata("image-to-ico");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <ImageToIco />
    </ToolShell>
  );
}
