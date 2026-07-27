import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { HtmlToMarkdown } from "@/modules/tools/components/html-to-markdown";

const tool = getTool("html-to-markdown")!;

export const metadata = toolMetadata("html-to-markdown");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <HtmlToMarkdown />
    </ToolShell>
  );
}
