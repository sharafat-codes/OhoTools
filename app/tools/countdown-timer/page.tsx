import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { TimerTool } from "@/modules/tools/components/timer-tool";

const tool = getTool("countdown-timer")!;

export const metadata = toolMetadata("countdown-timer");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <TimerTool mode="countdown" />
    </ToolShell>
  );
}
