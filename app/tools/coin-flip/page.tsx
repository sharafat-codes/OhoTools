import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { CoinFlip } from "@/modules/tools/components/coin-flip";

const tool = getTool("coin-flip")!;

export const metadata = toolMetadata("coin-flip");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <CoinFlip />
    </ToolShell>
  );
}
