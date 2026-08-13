import { headers } from "next/headers";

import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { WhatIsMyIp } from "@/modules/tools/components/what-is-my-ip";

const tool = getTool("what-is-my-ip")!;

export const metadata = toolMetadata("what-is-my-ip");

// Never cache — the IP is per-visitor and must not be shared across users.
export const dynamic = "force-dynamic";

export default async function Page() {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || h.get("x-real-ip") || "Unknown";

  return (
    <ToolShell tool={tool}>
      <WhatIsMyIp ip={ip} />
    </ToolShell>
  );
}
