import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AsciiTable } from "@/modules/tools/components/ascii-table";

const tool = getTool("ascii-table")!;

export const metadata = toolMetadata("ascii-table");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AsciiTable />
    </ToolShell>
  );
}
