import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AiTextTool } from "@/modules/tools/components/ai-text-tool";

const tool = getTool("cold-email-generator")!;

export const metadata = toolMetadata("cold-email-generator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AiTextTool
        task="cold-email"
        actionLabel="Write cold email"
        inputPlaceholder="Describe your product/service and the prospect you're reaching…"
        outputLabel="Cold email"
        controls={[
          {
            key: "tone",
            label: "Tone",
            default: "professional",
            options: [
              { label: "Professional", value: "professional" },
              { label: "Friendly", value: "friendly" },
              { label: "Direct", value: "direct" },
            ],
          },
          {
            key: "length",
            label: "Length",
            default: "short",
            options: [
              { label: "Short", value: "short" },
              { label: "Medium", value: "medium" },
            ],
          },
        ]}
      />
    </ToolShell>
  );
}
