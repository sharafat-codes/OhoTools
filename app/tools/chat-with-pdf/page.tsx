import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { PdfChat } from "@/modules/tools/components/pdf-chat";

const tool = getTool("chat-with-pdf")!;

export const metadata = toolMetadata("chat-with-pdf");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <PdfChat />
    </ToolShell>
  );
}
