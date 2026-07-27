import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { Slugify } from "@/modules/tools/components/slugify";

const tool = getTool("slugify")!;

export const metadata = toolMetadata("slugify");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <Slugify />
    </ToolShell>
  );
}
