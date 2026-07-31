import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { HtmlMinifier } from "@/modules/tools/components/html-minifier";

const tool = getTool("html-minifier")!;

export const metadata = toolMetadata("html-minifier");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <HtmlMinifier />
    </ToolShell>
  );
}
