import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { JsonYaml } from "@/modules/tools/components/json-yaml";

const tool = getTool("json-yaml")!;

export const metadata = toolMetadata("json-yaml");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <JsonYaml />
    </ToolShell>
  );
}
