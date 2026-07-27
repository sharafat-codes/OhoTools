import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { ImageToBase64 } from "@/modules/tools/components/image-to-base64";

const tool = getTool("image-to-base64")!;

export const metadata = toolMetadata("image-to-base64");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <ImageToBase64 />
    </ToolShell>
  );
}
