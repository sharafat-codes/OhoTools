import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { RotatePdf } from "@/modules/tools/components/rotate-pdf";

const tool = getTool("rotate-pdf")!;

export const metadata = toolMetadata("rotate-pdf");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <RotatePdf />
    </ToolShell>
  );
}
