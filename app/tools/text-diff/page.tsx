import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { TextDiff } from "@/modules/tools/components/text-diff";

const tool = getTool("text-diff")!;

export const metadata = toolMetadata("text-diff");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <TextDiff />
    </ToolShell>
  );
}
