import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { TextRepeater } from "@/modules/tools/components/text-repeater";

const tool = getTool("text-repeater")!;

export const metadata = toolMetadata("text-repeater");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <TextRepeater />
    </ToolShell>
  );
}
