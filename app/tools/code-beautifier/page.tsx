import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { CodeBeautifier } from "@/modules/tools/components/code-beautifier";

const tool = getTool("code-beautifier")!;

export const metadata = toolMetadata("code-beautifier");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <CodeBeautifier />
    </ToolShell>
  );
}
