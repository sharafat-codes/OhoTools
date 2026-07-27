import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { UtmBuilder } from "@/modules/tools/components/utm-builder";

const tool = getTool("utm-builder")!;

export const metadata = toolMetadata("utm-builder");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <UtmBuilder />
    </ToolShell>
  );
}
