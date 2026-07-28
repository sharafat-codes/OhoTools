import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AudioTool } from "@/modules/tools/components/audio-tool";

const tool = getTool("audio-converter")!;

export const metadata = toolMetadata("audio-converter");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AudioTool op="audio-converter" actionLabel="Convert audio" />
    </ToolShell>
  );
}
