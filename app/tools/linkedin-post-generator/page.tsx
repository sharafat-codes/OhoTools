import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AiTextTool } from "@/modules/tools/components/ai-text-tool";

const tool = getTool("linkedin-post-generator")!;

export const metadata = toolMetadata("linkedin-post-generator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AiTextTool
        task="linkedin-post"
        actionLabel="Write LinkedIn post"
        inputPlaceholder="Describe your topic, story, or announcement…"
        outputLabel="LinkedIn post"
        controls={[
          {
            key: "tone",
            label: "Tone",
            default: "professional",
            options: [
              { label: "Professional", value: "professional" },
              { label: "Inspirational", value: "inspirational" },
              { label: "Conversational", value: "conversational" },
              { label: "Bold", value: "bold" },
            ],
          },
        ]}
      />
    </ToolShell>
  );
}
