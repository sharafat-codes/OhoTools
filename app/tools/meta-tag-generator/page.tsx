import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { MetaTagGenerator } from "@/modules/tools/components/meta-tag-generator";

const tool = getTool("meta-tag-generator")!;

export const metadata = toolMetadata("meta-tag-generator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <MetaTagGenerator />
    </ToolShell>
  );
}
