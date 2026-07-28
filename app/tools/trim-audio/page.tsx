import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AudioTool } from "@/modules/tools/components/audio-tool";

const tool = getTool("trim-audio")!;

export const metadata = toolMetadata("trim-audio");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AudioTool op="trim-audio" actionLabel="Trim audio" />
    </ToolShell>
  );
}
