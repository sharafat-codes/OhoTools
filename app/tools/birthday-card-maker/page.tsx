import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { CardEditor } from "@/modules/cards/components/card-editor";

const tool = getTool("birthday-card-maker")!;

export const metadata = toolMetadata("birthday-card-maker");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <CardEditor />
    </ToolShell>
  );
}
