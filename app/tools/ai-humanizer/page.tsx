import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AiTextTool } from "@/modules/tools/components/ai-text-tool";

const tool = getTool("ai-humanizer")!;

export const metadata = toolMetadata("ai-humanizer");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AiTextTool
        task="humanize"
        actionLabel="Humanize"
        inputPlaceholder="Paste AI-generated text to make it read more naturally…"
        outputLabel="Humanized text"
      />
    </ToolShell>
  );
}
