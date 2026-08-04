import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { PassportPhotoMaker } from "@/modules/tools/components/passport-photo-maker";

const tool = getTool("passport-photo-maker")!;

export const metadata = toolMetadata("passport-photo-maker");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <PassportPhotoMaker />
    </ToolShell>
  );
}
