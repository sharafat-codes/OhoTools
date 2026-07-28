import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AiTextTool } from "@/modules/tools/components/ai-text-tool";

const tool = getTool("faq-generator")!;

export const metadata = toolMetadata("faq-generator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AiTextTool
        task="faq"
        actionLabel="Generate FAQ"
        inputPlaceholder="Paste your topic, product summary, or page content…"
        outputLabel="FAQ"
      />
    </ToolShell>
  );
}
