import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { PxRemConverter } from "@/modules/tools/components/px-rem-converter";

const tool = getTool("px-rem-converter")!;

export const metadata = toolMetadata("px-rem-converter");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <PxRemConverter />
    </ToolShell>
  );
}
