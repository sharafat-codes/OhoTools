import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { UrlEncoder } from "@/modules/tools/components/url-encoder";

const tool = getTool("url-encoder")!;

export const metadata = toolMetadata("url-encoder");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <UrlEncoder />
    </ToolShell>
  );
}
