import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { CardEditor } from "@/modules/cards/components/card-editor";

const tool = getTool("baby-shower-invitation-maker")!;

export const metadata = toolMetadata("baby-shower-invitation-maker");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <CardEditor occasion="baby-shower" />
    </ToolShell>
  );
}
