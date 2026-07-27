import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { FindReplace } from "@/modules/tools/components/find-replace";

const tool = getTool("find-replace")!;

export const metadata = toolMetadata("find-replace");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <FindReplace />
    </ToolShell>
  );
}
