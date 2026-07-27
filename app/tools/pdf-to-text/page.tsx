import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { PdfToText } from "@/modules/tools/components/pdf-to-text";

const tool = getTool("pdf-to-text")!;

export const metadata = toolMetadata("pdf-to-text");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <PdfToText />
    </ToolShell>
  );
}
