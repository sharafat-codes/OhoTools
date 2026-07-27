import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { CompressPdf } from "@/modules/tools/components/compress-pdf";

const tool = getTool("compress-pdf")!;

export const metadata = toolMetadata("compress-pdf");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <CompressPdf />
    </ToolShell>
  );
}
