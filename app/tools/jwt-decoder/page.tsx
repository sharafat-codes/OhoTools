import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { JwtDecoder } from "@/modules/tools/components/jwt-decoder";

const tool = getTool("jwt-decoder")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/jwt-decoder" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <JwtDecoder />
    </ToolShell>
  );
}
