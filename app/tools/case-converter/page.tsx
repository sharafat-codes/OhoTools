import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { CaseConverter } from "@/modules/tools/components/case-converter";

const tool = getTool("case-converter")!;

export const metadata = toolMetadata("case-converter");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <CaseConverter />
    </ToolShell>
  );
}
