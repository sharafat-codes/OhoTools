import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { VideoTool } from "@/modules/tools/components/video-tool";

const tool = getTool("video-to-gif")!;

export const metadata = toolMetadata("video-to-gif");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <VideoTool op="video-to-gif" actionLabel="Convert to GIF" />
    </ToolShell>
  );
}
