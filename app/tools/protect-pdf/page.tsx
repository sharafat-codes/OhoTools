import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { ProtectPdf } from "@/modules/tools/components/protect-pdf";

const tool = getTool("protect-pdf")!;

export const metadata = toolMetadata("protect-pdf");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <ProtectPdf />
    </ToolShell>
  );
}
