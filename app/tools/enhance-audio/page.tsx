import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AudioTool } from "@/modules/tools/components/audio-tool";

const tool = getTool("enhance-audio")!;

export const metadata = toolMetadata("enhance-audio");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AudioTool op="enhance-audio" actionLabel="Enhance audio" />
    </ToolShell>
  );
}
