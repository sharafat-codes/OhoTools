import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AiTextTool } from "@/modules/tools/components/ai-text-tool";

const tool = getTool("ai-grammar-checker")!;

export const metadata = toolMetadata("ai-grammar-checker");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AiTextTool
        task="grammar"
        actionLabel="Fix grammar"
        inputPlaceholder="Paste the text you want to proofread…"
        outputLabel="Corrected text"
      />
    </ToolShell>
  );
}
