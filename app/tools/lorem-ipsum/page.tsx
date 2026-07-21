import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { LoremIpsum } from "@/modules/tools/components/lorem-ipsum";

const tool = getTool("lorem-ipsum")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/lorem-ipsum" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <LoremIpsum />
    </ToolShell>
  );
}
