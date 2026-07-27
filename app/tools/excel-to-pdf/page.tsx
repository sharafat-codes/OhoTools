import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { DocConvert } from "@/modules/tools/components/doc-convert";

const tool = getTool("excel-to-pdf")!;

export const metadata = toolMetadata("excel-to-pdf");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <DocConvert
        op="to-pdf"
        accept=".xls,.xlsx,.ods,.csv"
        inLabel="Excel file"
        outExt="pdf"
        actionLabel="Convert to PDF"
        hint="Excel .xls or .xlsx — up to 15 MB."
      />
    </ToolShell>
  );
}
