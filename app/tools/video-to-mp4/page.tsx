import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { VideoTool } from "@/modules/tools/components/video-tool";

const tool = getTool("video-to-mp4")!;

export const metadata = toolMetadata("video-to-mp4");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <VideoTool op="video-to-mp4" actionLabel="Convert to MP4" />
    </ToolShell>
  );
}
