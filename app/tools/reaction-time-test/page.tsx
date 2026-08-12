import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { ReactionTimeTest } from "@/modules/tools/components/reaction-time-test";

const tool = getTool("reaction-time-test")!;

export const metadata = toolMetadata("reaction-time-test");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <ReactionTimeTest />
    </ToolShell>
  );
}
