import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AiTextTool } from "@/modules/tools/components/ai-text-tool";

const tool = getTool("ad-copy-generator")!;

export const metadata = toolMetadata("ad-copy-generator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AiTextTool
        task="ad-copy"
        actionLabel="Generate ad copy"
        inputPlaceholder="Describe your product/service and the offer…"
        outputLabel="Ad copy"
        controls={[
          {
            key: "platform",
            label: "Platform",
            default: "Google",
            options: [
              { label: "Google Ads", value: "Google" },
              { label: "Facebook", value: "Facebook" },
              { label: "Instagram", value: "Instagram" },
              { label: "LinkedIn", value: "LinkedIn" },
            ],
          },
          {
            key: "tone",
            label: "Tone",
            default: "persuasive",
            options: [
              { label: "Persuasive", value: "persuasive" },
              { label: "Friendly", value: "friendly" },
              { label: "Professional", value: "professional" },
              { label: "Bold", value: "bold" },
            ],
          },
        ]}
      />
    </ToolShell>
  );
}
