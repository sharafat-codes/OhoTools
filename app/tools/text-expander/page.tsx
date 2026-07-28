import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AiTextTool } from "@/modules/tools/components/ai-text-tool";

const tool = getTool("text-expander")!;

export const metadata = toolMetadata("text-expander");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AiTextTool
        task="expand"
        actionLabel="Expand text"
        inputPlaceholder="Paste short text or notes to expand…"
        outputLabel="Expanded text"
      />
    </ToolShell>
  );
}
