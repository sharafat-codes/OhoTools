import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { SqlFormatter } from "@/modules/tools/components/sql-formatter";

const tool = getTool("sql-formatter")!;

export const metadata = toolMetadata("sql-formatter");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <SqlFormatter />
    </ToolShell>
  );
}
