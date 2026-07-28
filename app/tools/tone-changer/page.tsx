import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AiTextTool } from "@/modules/tools/components/ai-text-tool";

const tool = getTool("tone-changer")!;

export const metadata = toolMetadata("tone-changer");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AiTextTool
        task="tone"
        actionLabel="Change tone"
        inputPlaceholder="Paste the text you want to rewrite…"
        outputLabel="Rewritten text"
        controls={[
          {
            key: "tone",
            label: "Tone",
            default: "professional",
            options: [
              { label: "Professional", value: "professional" },
              { label: "Friendly", value: "friendly" },
              { label: "Formal", value: "formal" },
              { label: "Casual", value: "casual" },
              { label: "Confident", value: "confident" },
              { label: "Empathetic", value: "empathetic" },
            ],
          },
        ]}
      />
    </ToolShell>
  );
}
