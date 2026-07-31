import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { MarkdownToPdf } from "@/modules/tools/components/markdown-to-pdf";

const tool = getTool("markdown-to-pdf")!;

export const metadata = toolMetadata("markdown-to-pdf");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <MarkdownToPdf />
    </ToolShell>
  );
}
