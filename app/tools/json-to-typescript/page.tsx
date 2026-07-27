import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { JsonToTypescript } from "@/modules/tools/components/json-to-typescript";

const tool = getTool("json-to-typescript")!;

export const metadata = toolMetadata("json-to-typescript");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <JsonToTypescript />
    </ToolShell>
  );
}
