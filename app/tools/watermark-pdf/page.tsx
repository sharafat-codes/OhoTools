import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { WatermarkPdf } from "@/modules/tools/components/watermark-pdf";

const tool = getTool("watermark-pdf")!;

export const metadata = toolMetadata("watermark-pdf");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <WatermarkPdf />
    </ToolShell>
  );
}
