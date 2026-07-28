import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { VideoTool } from "@/modules/tools/components/video-tool";

const tool = getTool("trim-video")!;

export const metadata = toolMetadata("trim-video");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <VideoTool op="trim-video" actionLabel="Trim video" />
    </ToolShell>
  );
}
