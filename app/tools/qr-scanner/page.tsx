import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { QrScanner } from "@/modules/tools/components/qr-scanner";

const tool = getTool("qr-scanner")!;

export const metadata = toolMetadata("qr-scanner");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <QrScanner />
    </ToolShell>
  );
}
