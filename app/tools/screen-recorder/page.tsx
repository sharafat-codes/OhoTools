import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { ScreenRecorder } from "@/modules/tools/components/screen-recorder";

const tool = getTool("screen-recorder")!;

export const metadata = toolMetadata("screen-recorder");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <ScreenRecorder />
    </ToolShell>
  );
}
