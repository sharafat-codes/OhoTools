import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AiTextTool } from "@/modules/tools/components/ai-text-tool";

const tool = getTool("hashtag-generator")!;

export const metadata = toolMetadata("hashtag-generator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AiTextTool
        task="hashtag"
        actionLabel="Generate hashtags"
        inputPlaceholder="Describe your post or topic…"
        outputLabel="Hashtags"
        controls={[
          {
            key: "count",
            label: "How many",
            default: "20",
            options: [
              { label: "10 hashtags", value: "10" },
              { label: "20 hashtags", value: "20" },
              { label: "30 hashtags", value: "30" },
            ],
          },
        ]}
      />
    </ToolShell>
  );
}
