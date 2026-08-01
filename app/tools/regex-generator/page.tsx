import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AiTextTool } from "@/modules/tools/components/ai-text-tool";

const tool = getTool("regex-generator")!;

export const metadata = toolMetadata("regex-generator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AiTextTool
        task="regex-generator"
        actionLabel="Generate regex"
        inputPlaceholder="Describe what you want to match, e.g. 'a US phone number' or 'an email address'…"
        outputLabel="Regular expression"
        controls={[
          {
            key: "flavor",
            label: "Flavor",
            default: "JavaScript",
            options: [
              { label: "JavaScript", value: "JavaScript" },
              { label: "Python", value: "Python" },
              { label: "PCRE", value: "PCRE" },
            ],
          },
        ]}
      />
    </ToolShell>
  );
}
