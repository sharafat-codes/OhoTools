import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { CropImage } from "@/modules/tools/components/crop-image";

const tool = getTool("crop-image")!;

export const metadata = toolMetadata("crop-image");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <CropImage />
    </ToolShell>
  );
}
