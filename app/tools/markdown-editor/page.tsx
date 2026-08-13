import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { MarkdownEditor } from "@/modules/tools/components/markdown-editor";

const tool = getTool("markdown-editor")!;

export const metadata = toolMetadata("markdown-editor");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <MarkdownEditor />
    </ToolShell>
  );
}
