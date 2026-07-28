import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AiTextTool } from "@/modules/tools/components/ai-text-tool";

const tool = getTool("resume-summary-generator")!;

export const metadata = toolMetadata("resume-summary-generator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AiTextTool
        task="resume-summary"
        actionLabel="Generate summary"
        inputPlaceholder="Your role, years of experience, and key skills or achievements…"
        outputLabel="Resume summary"
        controls={[
          {
            key: "level",
            label: "Experience level",
            default: "mid-level",
            options: [
              { label: "Entry level", value: "entry-level" },
              { label: "Mid level", value: "mid-level" },
              { label: "Senior", value: "senior" },
            ],
          },
        ]}
      />
    </ToolShell>
  );
}
