import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { PdfToImages } from "@/modules/tools/components/pdf-to-images";

const tool = getTool("pdf-to-images")!;

export const metadata = toolMetadata("pdf-to-images");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <PdfToImages />
    </ToolShell>
  );
}
