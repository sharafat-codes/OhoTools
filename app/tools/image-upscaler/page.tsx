import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { ImageUpscaler } from "@/modules/tools/components/image-upscaler";

const tool = getTool("image-upscaler")!;

export const metadata = toolMetadata("image-upscaler");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <ImageUpscaler />
    </ToolShell>
  );
}
