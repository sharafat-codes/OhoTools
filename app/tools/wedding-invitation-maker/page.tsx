import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { CardEditor } from "@/modules/cards/components/card-editor";

const tool = getTool("wedding-invitation-maker")!;

export const metadata = toolMetadata("wedding-invitation-maker");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <CardEditor occasion="wedding" />
    </ToolShell>
  );
}
