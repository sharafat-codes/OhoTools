import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { JsonToml } from "@/modules/tools/components/json-toml";

const tool = getTool("json-toml")!;

export const metadata = toolMetadata("json-toml");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <JsonToml />
    </ToolShell>
  );
}
