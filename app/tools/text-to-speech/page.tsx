import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { TextToSpeech } from "@/modules/tools/components/text-to-speech";

const tool = getTool("text-to-speech")!;

export const metadata = toolMetadata("text-to-speech");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <TextToSpeech />
    </ToolShell>
  );
}
