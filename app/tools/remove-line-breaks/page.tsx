import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { RemoveLineBreaks } from "@/modules/tools/components/remove-line-breaks";

const tool = getTool("remove-line-breaks")!;

export const metadata = toolMetadata("remove-line-breaks");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <RemoveLineBreaks />
    </ToolShell>
  );
}
