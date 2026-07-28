import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { DocConvert } from "@/modules/tools/components/doc-convert";

const tool = getTool("csv-to-xlsx")!;

export const metadata = toolMetadata("csv-to-xlsx");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <DocConvert
        op="csv-to-xlsx"
        accept=".csv,text/csv"
        inLabel="CSV file"
        outExt="xlsx"
        actionLabel="Convert to Excel"
        hint="A .csv file — up to 15 MB."
      />
    </ToolShell>
  );
}
