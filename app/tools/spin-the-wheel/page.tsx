import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { SpinTheWheel } from "@/modules/tools/components/spin-the-wheel";

const tool = getTool("spin-the-wheel")!;

export const metadata = toolMetadata("spin-the-wheel");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <SpinTheWheel />
    </ToolShell>
  );
}
