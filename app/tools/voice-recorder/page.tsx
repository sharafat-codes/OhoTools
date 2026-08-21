import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { VoiceRecorder } from "@/modules/tools/components/voice-recorder";

const tool = getTool("voice-recorder")!;

export const metadata = toolMetadata("voice-recorder");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <VoiceRecorder />
    </ToolShell>
  );
}
