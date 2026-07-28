import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AiTextTool } from "@/modules/tools/components/ai-text-tool";

const tool = getTool("simplify-text")!;

export const metadata = toolMetadata("simplify-text");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AiTextTool
        task="simplify"
        actionLabel="Simplify"
        inputPlaceholder="Paste complex or jargon-heavy text to simplify…"
        outputLabel="Simplified text"
        controls={[
          {
            key: "level",
            label: "How simple",
            default: "plain English",
            options: [
              { label: "Plain English", value: "plain English" },
              { label: "Explain like I'm 5", value: "an explanation a five-year-old could understand" },
              { label: "As simple as possible", value: "as simply as possible" },
            ],
          },
        ]}
      />
    </ToolShell>
  );
}
