import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { UrlParser } from "@/modules/tools/components/url-parser";

const tool = getTool("url-parser")!;

export const metadata = toolMetadata("url-parser");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <UrlParser />
    </ToolShell>
  );
}
