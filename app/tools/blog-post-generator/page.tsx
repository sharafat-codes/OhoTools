import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AiTextTool } from "@/modules/tools/components/ai-text-tool";

const tool = getTool("blog-post-generator")!;

export const metadata = toolMetadata("blog-post-generator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AiTextTool
        task="blog-post"
        actionLabel="Write blog post"
        inputPlaceholder="Enter your topic and any key points or angle…"
        outputLabel="Draft"
        controls={[
          {
            key: "tone",
            label: "Tone",
            default: "informative",
            options: [
              { label: "Informative", value: "informative" },
              { label: "Conversational", value: "conversational" },
              { label: "Professional", value: "professional" },
              { label: "Persuasive", value: "persuasive" },
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
