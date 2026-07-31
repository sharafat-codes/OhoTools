import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { ColorPickerFromImage } from "@/modules/tools/components/color-picker-from-image";

const tool = getTool("color-picker-from-image")!;

export const metadata = toolMetadata("color-picker-from-image");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <ColorPickerFromImage />
    </ToolShell>
  );
}
