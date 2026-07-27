import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { CompressImage } from "@/modules/tools/components/compress-image";

const tool = getTool("compress-image")!;

export const metadata = toolMetadata("compress-image");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <CompressImage />
    </ToolShell>
  );
}
