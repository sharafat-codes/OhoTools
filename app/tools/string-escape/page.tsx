import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { StringEscape } from "@/modules/tools/components/string-escape";

const tool = getTool("string-escape")!;

export const metadata = toolMetadata("string-escape");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <StringEscape />
    </ToolShell>
  );
}
