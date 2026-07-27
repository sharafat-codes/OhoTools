import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { JsonToCsv } from "@/modules/tools/components/json-to-csv";

const tool = getTool("json-to-csv")!;

export const metadata = toolMetadata("json-to-csv");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <JsonToCsv />
    </ToolShell>
  );
}
