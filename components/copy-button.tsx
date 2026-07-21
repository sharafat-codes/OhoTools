"use client";

import * as React from "react";
import { CheckIcon, CopyIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CopyButton({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = React.useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={copy}>
      {copied ? <CheckIcon /> : <CopyIcon />}
      {label ?? (copied ? "Copied" : "Copy")}
    </Button>
  );
}
