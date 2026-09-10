import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AiTextTool } from "@/modules/tools/components/ai-text-tool";

const tool = getTool("review-response-generator")!;

export const metadata = toolMetadata("review-response-generator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AiTextTool
        task="review-response"
        actionLabel="Write response"
        inputPlaceholder="Paste the customer review (and your business name)…"
        outputLabel="Response"
        controls={[
          {
            key: "tone",
            label: "Tone",
            default: "warm and professional",
            options: [
              { label: "Warm & professional", value: "warm and professional" },
              { label: "Formal", value: "formal" },
              { label: "Friendly & casual", value: "friendly and casual" },
            ],
          },
        ]}
      />
    </ToolShell>
  );
}
