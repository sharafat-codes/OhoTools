import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { BarcodeGenerator } from "@/modules/tools/components/barcode-generator";

const tool = getTool("barcode-generator")!;

export const metadata = toolMetadata("barcode-generator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <BarcodeGenerator />
    </ToolShell>
  );
}
