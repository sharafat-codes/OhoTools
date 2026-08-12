import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { TypingSpeedTest } from "@/modules/tools/components/typing-speed-test";

const tool = getTool("typing-speed-test")!;

export const metadata = toolMetadata("typing-speed-test");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <TypingSpeedTest />
    </ToolShell>
  );
}
