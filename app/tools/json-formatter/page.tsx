import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { JsonFormatter } from "@/modules/tools/components/json-formatter";

const tool = getTool("json-formatter")!;

export const metadata = toolMetadata("json-formatter");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <JsonFormatter />
    </ToolShell>
  );
}
