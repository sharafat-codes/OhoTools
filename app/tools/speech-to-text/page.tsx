import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { SpeechToText } from "@/modules/tools/components/speech-to-text";

const tool = getTool("speech-to-text")!;

export const metadata = toolMetadata("speech-to-text");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <SpeechToText />
    </ToolShell>
  );
}
