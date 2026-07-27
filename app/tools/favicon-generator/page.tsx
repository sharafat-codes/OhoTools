import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { FaviconGenerator } from "@/modules/tools/components/favicon-generator";

const tool = getTool("favicon-generator")!;

export const metadata = toolMetadata("favicon-generator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <FaviconGenerator />
    </ToolShell>
  );
}
