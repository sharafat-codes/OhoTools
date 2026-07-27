import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { SplitPdf } from "@/modules/tools/components/split-pdf";

const tool = getTool("split-pdf")!;

export const metadata = toolMetadata("split-pdf");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <SplitPdf />
    </ToolShell>
  );
}
