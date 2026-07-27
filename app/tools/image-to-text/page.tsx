import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { ImageToText } from "@/modules/tools/components/image-to-text";

const tool = getTool("image-to-text")!;

export const metadata = toolMetadata("image-to-text");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <ImageToText />
    </ToolShell>
  );
}
