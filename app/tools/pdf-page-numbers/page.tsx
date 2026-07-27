import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { PdfPageNumbers } from "@/modules/tools/components/pdf-page-numbers";

const tool = getTool("pdf-page-numbers")!;

export const metadata = toolMetadata("pdf-page-numbers");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <PdfPageNumbers />
    </ToolShell>
  );
}
