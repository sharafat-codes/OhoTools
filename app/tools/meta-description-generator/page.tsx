import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AiTextTool } from "@/modules/tools/components/ai-text-tool";

const tool = getTool("meta-description-generator")!;

export const metadata = toolMetadata("meta-description-generator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AiTextTool
        task="meta-description"
        actionLabel="Generate meta descriptions"
        inputPlaceholder="Describe your page's topic, or paste its content…"
        outputLabel="Meta descriptions"
      />
    </ToolShell>
  );
}
