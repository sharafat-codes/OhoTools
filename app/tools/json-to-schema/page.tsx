import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { JsonToSchema } from "@/modules/tools/components/json-to-schema";

const tool = getTool("json-to-schema")!;

export const metadata = toolMetadata("json-to-schema");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <JsonToSchema />
    </ToolShell>
  );
}
