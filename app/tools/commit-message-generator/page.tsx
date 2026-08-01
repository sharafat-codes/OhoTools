import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AiTextTool } from "@/modules/tools/components/ai-text-tool";

const tool = getTool("commit-message-generator")!;

export const metadata = toolMetadata("commit-message-generator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AiTextTool
        task="commit-message"
        actionLabel="Generate commit message"
        inputPlaceholder="Paste your git diff, or describe what you changed…"
        outputLabel="Commit message"
        controls={[
          {
            key: "style",
            label: "Style",
            default: "conventional",
            options: [
              { label: "Conventional Commits", value: "conventional" },
              { label: "Plain", value: "plain" },
            ],
          },
        ]}
      />
    </ToolShell>
  );
}
