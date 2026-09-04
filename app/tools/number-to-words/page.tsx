import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { NumberToWords } from "@/modules/tools/components/number-to-words";

const tool = getTool("number-to-words")!;

export const metadata = toolMetadata("number-to-words");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <NumberToWords />
    </ToolShell>
  );
}
