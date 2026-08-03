import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { CsvToXlsx } from "@/modules/tools/components/csv-to-xlsx";

const tool = getTool("csv-to-xlsx")!;

export const metadata = toolMetadata("csv-to-xlsx");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <CsvToXlsx />
    </ToolShell>
  );
}
