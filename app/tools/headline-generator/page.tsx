import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AiTextTool } from "@/modules/tools/components/ai-text-tool";

const tool = getTool("headline-generator")!;

export const metadata = toolMetadata("headline-generator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AiTextTool
        task="headline"
        actionLabel="Generate headlines"
        inputPlaceholder="Your topic or a short summary of the piece…"
        outputLabel="Headlines"
        controls={[
          {
            key: "type",
            label: "Type",
            default: "blog post",
            options: [
              { label: "Blog post", value: "blog post" },
              { label: "YouTube video", value: "YouTube video" },
              { label: "News", value: "news" },
              { label: "Ad", value: "ad" },
            ],
          },
        ]}
      />
    </ToolShell>
  );
}
