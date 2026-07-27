import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { DocConvert } from "@/modules/tools/components/doc-convert";

const tool = getTool("office-to-pdf")!;

export const metadata = toolMetadata("office-to-pdf");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <DocConvert
        op="to-pdf"
        accept=".doc,.docx,.ppt,.pptx,.xls,.xlsx,.odt,.ods,.odp,.rtf"
        inLabel="document"
        outExt="pdf"
        actionLabel="Convert to PDF"
        hint="Word, PowerPoint, or Excel (.docx, .pptx, .xlsx, and more) — up to 15 MB."
      />
    </ToolShell>
  );
}
