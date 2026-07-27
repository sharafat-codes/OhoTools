import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { TimezoneConverter } from "@/modules/tools/components/timezone-converter";

const tool = getTool("timezone-converter")!;

export const metadata = toolMetadata("timezone-converter");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <TimezoneConverter />
    </ToolShell>
  );
}
