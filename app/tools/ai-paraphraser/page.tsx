import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AiTextTool } from "@/modules/tools/components/ai-text-tool";

const tool = getTool("ai-paraphraser")!;

export const metadata = toolMetadata("ai-paraphraser");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AiTextTool
        task="paraphrase"
        actionLabel="Rewrite"
        inputPlaceholder="Paste the text you want to rewrite…"
        outputLabel="Rewritten text"
        controls={[
          {
            key: "tone",
            label: "Tone",
            default: "professional",
            options: [
              { label: "Professional", value: "professional" },
              { label: "Casual", value: "casual" },
              { label: "Concise", value: "concise" },
              { label: "Friendly", value: "friendly" },
              { label: "Formal", value: "formal" },
              { label: "Confident", value: "confident" },
            ],
          },
        ]}
      />
    </ToolShell>
  );
}
