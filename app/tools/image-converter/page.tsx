import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { ImageConverter } from "@/modules/tools/components/image-converter";

const tool = getTool("image-converter")!;

export const metadata = toolMetadata("image-converter");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <ImageConverter />
    </ToolShell>
  );
}
