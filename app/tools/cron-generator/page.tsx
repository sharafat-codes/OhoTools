import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AiTextTool } from "@/modules/tools/components/ai-text-tool";

const tool = getTool("cron-generator")!;

export const metadata = toolMetadata("cron-generator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AiTextTool
        task="cron-generator"
        actionLabel="Generate cron"
        inputPlaceholder="Describe the schedule, e.g. 'every weekday at 9am' or 'the 1st of every month at midnight'…"
        outputLabel="Cron expression"
      />
    </ToolShell>
  );
}
