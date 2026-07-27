import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { TimestampConverter } from "@/modules/tools/components/timestamp-converter";

const tool = getTool("timestamp-converter")!;

export const metadata = toolMetadata("timestamp-converter");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <TimestampConverter />
    </ToolShell>
  );
}
