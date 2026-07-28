import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AudioTool } from "@/modules/tools/components/audio-tool";

const tool = getTool("change-volume")!;

export const metadata = toolMetadata("change-volume");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AudioTool op="change-volume" actionLabel="Adjust volume" />
    </ToolShell>
  );
}
