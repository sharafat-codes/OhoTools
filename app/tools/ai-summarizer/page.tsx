import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AiTextTool } from "@/modules/tools/components/ai-text-tool";

const tool = getTool("ai-summarizer")!;

export const metadata = toolMetadata("ai-summarizer");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AiTextTool
        task="summarize"
        actionLabel="Summarize"
        inputPlaceholder="Paste the text you want to summarize…"
        outputLabel="Summary"
        controls={[
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
          {
            key: "format",
            label: "Format",
            default: "paragraph",
            options: [
              { label: "Paragraph", value: "paragraph" },
              { label: "Bullet points", value: "bullets" },
            ],
          },
        ]}
      />
    </ToolShell>
  );
}
