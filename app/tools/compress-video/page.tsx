import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { VideoTool } from "@/modules/tools/components/video-tool";

const tool = getTool("compress-video")!;

export const metadata = toolMetadata("compress-video");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <VideoTool op="compress-video" actionLabel="Compress video" />
    </ToolShell>
  );
}
