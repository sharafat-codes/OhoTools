import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { HtmlEntities } from "@/modules/tools/components/html-entities";

const tool = getTool("html-entities")!;

export const metadata = toolMetadata("html-entities");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <HtmlEntities />
    </ToolShell>
  );
}
