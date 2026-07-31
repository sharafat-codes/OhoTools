import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { ImageToSvg } from "@/modules/tools/components/image-to-svg";

const tool = getTool("image-to-svg")!;

export const metadata = toolMetadata("image-to-svg");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <ImageToSvg />
    </ToolShell>
  );
}
