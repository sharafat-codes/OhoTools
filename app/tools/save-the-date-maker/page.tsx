import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { CardEditor } from "@/modules/cards/components/card-editor";

const tool = getTool("save-the-date-maker")!;

export const metadata = toolMetadata("save-the-date-maker");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <CardEditor occasion="save-the-date" />
    </ToolShell>
  );
}
