import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { MergePdf } from "@/modules/tools/components/merge-pdf";

const tool = getTool("merge-pdf")!;

export const metadata = toolMetadata("merge-pdf");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <MergePdf />
    </ToolShell>
  );
}
