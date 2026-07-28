import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AiTextTool } from "@/modules/tools/components/ai-text-tool";

const tool = getTool("ai-email-writer")!;

export const metadata = toolMetadata("ai-email-writer");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AiTextTool
        task="email"
        actionLabel="Write email"
        inputPlaceholder="Describe the email — topic, key points, and who it's to. Or paste a message to reply to…"
        outputLabel="Email"
        controls={[
          {
            key: "tone",
            label: "Tone",
            default: "professional",
            options: [
              { label: "Professional", value: "professional" },
              { label: "Friendly", value: "friendly" },
              { label: "Formal", value: "formal" },
            ],
          },
          {
            key: "length",
            label: "Length",
            default: "medium",
            options: [
              { label: "Short", value: "short" },
              { label: "Medium", value: "medium" },
              { label: "Long", value: "long" },
            ],
          },
        ]}
      />
    </ToolShell>
  );
}
