import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { SpacebarCounter } from "@/modules/tools/components/spacebar-counter";

const tool = getTool("spacebar-counter")!;

export const metadata = toolMetadata("spacebar-counter");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <SpacebarCounter />
    </ToolShell>
  );
}
