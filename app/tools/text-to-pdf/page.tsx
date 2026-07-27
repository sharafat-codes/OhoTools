import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { TextToPdf } from "@/modules/tools/components/text-to-pdf";

const tool = getTool("text-to-pdf")!;

export const metadata = toolMetadata("text-to-pdf");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <TextToPdf />
    </ToolShell>
  );
}
