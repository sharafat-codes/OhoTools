import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AiTextTool } from "@/modules/tools/components/ai-text-tool";

const tool = getTool("text-shortener")!;

export const metadata = toolMetadata("text-shortener");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AiTextTool
        task="shorten"
        actionLabel="Shorten text"
        inputPlaceholder="Paste long text to shorten…"
        outputLabel="Shortened text"
      />
    </ToolShell>
  );
}
