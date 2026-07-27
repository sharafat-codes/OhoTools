import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { MarkdownToHtml } from "@/modules/tools/components/markdown-to-html";

const tool = getTool("markdown-to-html")!;

export const metadata = toolMetadata("markdown-to-html");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <MarkdownToHtml />
    </ToolShell>
  );
}
