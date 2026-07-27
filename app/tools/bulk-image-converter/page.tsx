import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { BulkImageConverter } from "@/modules/tools/components/bulk-image-converter";

const tool = getTool("bulk-image-converter")!;

export const metadata = toolMetadata("bulk-image-converter");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <BulkImageConverter />
    </ToolShell>
  );
}
