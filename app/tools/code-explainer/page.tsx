import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AiTextTool } from "@/modules/tools/components/ai-text-tool";

const tool = getTool("code-explainer")!;

export const metadata = toolMetadata("code-explainer");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AiTextTool
        task="explain-code"
        actionLabel="Explain code"
        inputPlaceholder="Paste the code you want explained…"
        outputLabel="Explanation"
        controls={[
          {
            key: "level",
            label: "Detail",
            default: "detailed",
            options: [
              { label: "Detailed", value: "detailed" },
              { label: "Simple", value: "simple" },
            ],
          },
        ]}
      />
    </ToolShell>
  );
}
