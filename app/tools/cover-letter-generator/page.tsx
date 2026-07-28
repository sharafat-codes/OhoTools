import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AiTextTool } from "@/modules/tools/components/ai-text-tool";

const tool = getTool("cover-letter-generator")!;

export const metadata = toolMetadata("cover-letter-generator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AiTextTool
        task="cover-letter"
        actionLabel="Write cover letter"
        inputPlaceholder="Paste the job description and your key experience, skills, and the role you're applying for…"
        outputLabel="Cover letter"
        controls={[
          {
            key: "tone",
            label: "Tone",
            default: "professional",
            options: [
              { label: "Professional", value: "professional" },
              { label: "Enthusiastic", value: "enthusiastic" },
              { label: "Formal", value: "formal" },
            ],
          },
        ]}
      />
    </ToolShell>
  );
}
