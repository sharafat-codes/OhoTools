import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AiTextTool } from "@/modules/tools/components/ai-text-tool";

const tool = getTool("product-description-generator")!;

export const metadata = toolMetadata("product-description-generator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AiTextTool
        task="product-description"
        actionLabel="Generate description"
        inputPlaceholder="Product name and key features (materials, size, benefits, who it's for)…"
        outputLabel="Product description"
        controls={[
          {
            key: "tone",
            label: "Tone",
            default: "persuasive",
            options: [
              { label: "Persuasive", value: "persuasive" },
              { label: "Professional", value: "professional" },
              { label: "Playful", value: "playful" },
            ],
          },
        ]}
      />
    </ToolShell>
  );
}
