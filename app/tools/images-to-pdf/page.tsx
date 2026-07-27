import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { ImagesToPdf } from "@/modules/tools/components/images-to-pdf";

const tool = getTool("images-to-pdf")!;

export const metadata = toolMetadata("images-to-pdf");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <ImagesToPdf />
    </ToolShell>
  );
}
