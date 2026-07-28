import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AiTextTool } from "@/modules/tools/components/ai-text-tool";

const tool = getTool("business-name-generator")!;

export const metadata = toolMetadata("business-name-generator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AiTextTool
        task="business-name"
        actionLabel="Generate names"
        inputPlaceholder="Describe your business, product, or industry…"
        outputLabel="Name ideas"
        controls={[
          {
            key: "style",
            label: "Style",
            default: "modern",
            options: [
              { label: "Modern", value: "modern" },
              { label: "Playful", value: "playful" },
              { label: "Professional", value: "professional" },
              { label: "Minimal / one-word", value: "minimal" },
            ],
          },
        ]}
      />
    </ToolShell>
  );
}
