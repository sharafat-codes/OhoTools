import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { UnitConverter } from "@/modules/tools/components/unit-converter";

const tool = getTool("unit-converter")!;

export const metadata = toolMetadata("unit-converter");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <UnitConverter />
    </ToolShell>
  );
}
