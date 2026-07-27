import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { WifiQr } from "@/modules/tools/components/wifi-qr";

const tool = getTool("wifi-qr")!;

export const metadata = toolMetadata("wifi-qr");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <WifiQr />
    </ToolShell>
  );
}
