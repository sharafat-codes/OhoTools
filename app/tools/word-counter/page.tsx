import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { WordCounter } from "@/modules/tools/components/word-counter";

const tool = getTool("word-counter")!;

export const metadata = toolMetadata("word-counter");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <WordCounter />
    </ToolShell>
  );
}
