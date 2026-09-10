import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AiTextTool } from "@/modules/tools/components/ai-text-tool";

const tool = getTool("youtube-title-generator")!;

export const metadata = toolMetadata("youtube-title-generator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AiTextTool
        task="youtube"
        actionLabel="Generate titles & description"
        inputPlaceholder="Describe your video topic and angle…"
        outputLabel="Titles, description & tags"
      />
    </ToolShell>
  );
}
