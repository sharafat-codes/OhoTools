import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { OnlineNotepad } from "@/modules/tools/components/online-notepad";

const tool = getTool("online-notepad")!;

export const metadata = toolMetadata("online-notepad");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <OnlineNotepad />
    </ToolShell>
  );
}
