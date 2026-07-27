import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { LineSorter } from "@/modules/tools/components/line-sorter";

const tool = getTool("line-sorter")!;

export const metadata = toolMetadata("line-sorter");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <LineSorter />
    </ToolShell>
  );
}
