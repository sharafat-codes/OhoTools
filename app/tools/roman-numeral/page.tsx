import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { RomanNumeral } from "@/modules/tools/components/roman-numeral";

const tool = getTool("roman-numeral")!;

export const metadata = toolMetadata("roman-numeral");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <RomanNumeral />
    </ToolShell>
  );
}
