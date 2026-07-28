import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AiTextTool } from "@/modules/tools/components/ai-text-tool";

const tool = getTool("caption-generator")!;

export const metadata = toolMetadata("caption-generator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AiTextTool
        task="caption"
        actionLabel="Generate captions"
        inputPlaceholder="Describe your post or topic…"
        outputLabel="Captions"
        controls={[
          {
            key: "platform",
            label: "Platform",
            default: "Instagram",
            options: [
              { label: "Instagram", value: "Instagram" },
              { label: "LinkedIn", value: "LinkedIn" },
              { label: "X (Twitter)", value: "X (Twitter)" },
              { label: "Facebook", value: "Facebook" },
              { label: "TikTok", value: "TikTok" },
            ],
          },
          {
            key: "count",
            label: "Options",
            default: "3",
            options: [
              { label: "3 captions", value: "3" },
              { label: "5 captions", value: "5" },
            ],
          },
        ]}
      />
    </ToolShell>
  );
}
