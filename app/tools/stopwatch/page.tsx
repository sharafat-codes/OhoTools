import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { TimerTool } from "@/modules/tools/components/timer-tool";

const tool = getTool("stopwatch")!;

export const metadata = toolMetadata("stopwatch");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <TimerTool mode="stopwatch" />
    </ToolShell>
  );
}
