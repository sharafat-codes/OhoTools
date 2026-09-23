"use client";

import * as React from "react";
import { LoaderCircleIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

/**
 * Starts a JazzCash hosted checkout.
 *
 * JazzCash expects a form POST rather than a redirect to a URL, so the signed
 * fields are fetched from our server (the signature depends on the integrity
 * salt and can never be computed in the browser) and then submitted as a real
 * form. The form is built and removed in the same tick; navigation carries the
 * customer to JazzCash.
 */
export function JazzCashButton({
  children,
  className,
  variant = "default",
}: {
  children?: React.ReactNode;
  className?: string;
  variant?: "default" | "outline";
}) {
  const [busy, setBusy] = React.useState(false);

  async function start() {
    setBusy(true);
    try {
      const res = await fetch("/api/pay/jazzcash/create", { method: "POST" });
      const data = (await res.json()) as {
        postUrl?: string;
        fields?: Record<string, string>;
        error?: string;
      };

      if (!res.ok || !data.postUrl || !data.fields) {
        toast.error(data.error ?? "Couldn't start checkout. Please try again.");
        setBusy(false);
        return;
      }

      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.postUrl;
      form.style.display = "none";
      for (const [name, value] of Object.entries(data.fields)) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.appendChild(input);
      }
      document.body.appendChild(form);
      form.submit();
      // Deliberately leave `busy` set — the page is navigating away.
    } catch {
      toast.error("Couldn't reach the payment provider. Please try again.");
      setBusy(false);
    }
  }

  return (
    <Button onClick={start} disabled={busy} variant={variant} className={className}>
      {busy && <LoaderCircleIcon className="animate-spin" />}
      {children ?? "Pay with JazzCash"}
    </Button>
  );
}
