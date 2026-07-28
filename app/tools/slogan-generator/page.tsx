import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AiTextTool } from "@/modules/tools/components/ai-text-tool";

const tool = getTool("slogan-generator")!;

export const metadata = toolMetadata("slogan-generator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AiTextTool
        task="slogan"
        actionLabel="Generate slogans"
        inputPlaceholder="Describe your business or product…"
        outputLabel="Slogans"
        controls={[
          {
            key: "tone",
            label: "Tone",
            default: "catchy",
            options: [
              { label: "Catchy", value: "catchy" },
              { label: "Professional", value: "professional" },
              { label: "Playful", value: "playful" },
              { label: "Inspirational", value: "inspirational" },
            ],
          },
        ]}
      />
    </ToolShell>
  );
}
