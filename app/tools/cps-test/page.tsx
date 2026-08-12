import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { CpsTest } from "@/modules/tools/components/cps-test";

const tool = getTool("cps-test")!;

export const metadata = toolMetadata("cps-test");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <CpsTest />
    </ToolShell>
  );
}
