import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { CsvToJson } from "@/modules/tools/components/csv-to-json";

const tool = getTool("csv-to-json")!;

export const metadata = toolMetadata("csv-to-json");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <CsvToJson />
    </ToolShell>
  );
}
