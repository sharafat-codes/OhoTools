import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { CronExplainer } from "@/modules/tools/components/cron-explainer";

const tool = getTool("cron-explainer")!;

export const metadata = toolMetadata("cron-explainer");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <CronExplainer />
    </ToolShell>
  );
}
