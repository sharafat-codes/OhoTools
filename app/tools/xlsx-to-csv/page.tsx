import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { DocConvert } from "@/modules/tools/components/doc-convert";

const tool = getTool("xlsx-to-csv")!;

export const metadata = toolMetadata("xlsx-to-csv");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <DocConvert
        op="xlsx-to-csv"
        accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        inLabel="Excel file"
        outExt="csv"
        actionLabel="Convert to CSV"
        hint="A .xlsx spreadsheet — up to 15 MB."
      />
    </ToolShell>
  );
}
