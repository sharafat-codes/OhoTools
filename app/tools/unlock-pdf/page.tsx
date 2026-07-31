import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { UnlockPdf } from "@/modules/tools/components/unlock-pdf";

const tool = getTool("unlock-pdf")!;

export const metadata = toolMetadata("unlock-pdf");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <UnlockPdf />
    </ToolShell>
  );
}
