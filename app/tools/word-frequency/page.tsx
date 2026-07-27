import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { WordFrequency } from "@/modules/tools/components/word-frequency";

const tool = getTool("word-frequency")!;

export const metadata = toolMetadata("word-frequency");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <WordFrequency />
    </ToolShell>
  );
}
