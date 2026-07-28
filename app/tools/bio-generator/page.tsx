import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AiTextTool } from "@/modules/tools/components/ai-text-tool";

const tool = getTool("bio-generator")!;

export const metadata = toolMetadata("bio-generator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AiTextTool
        task="bio"
        actionLabel="Generate bio"
        inputPlaceholder="Describe yourself — what you do, interests, and the vibe you want…"
        outputLabel="Bio options"
        controls={[
          {
            key: "platform",
            label: "Platform",
            default: "Instagram",
            options: [
              { label: "Instagram", value: "Instagram" },
              { label: "LinkedIn", value: "LinkedIn" },
              { label: "X (Twitter)", value: "X (Twitter)" },
              { label: "TikTok", value: "TikTok" },
              { label: "General", value: "a general profile" },
            ],
          },
        ]}
      />
    </ToolShell>
  );
}
