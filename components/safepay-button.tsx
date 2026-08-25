"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";

// Starts a Safepay (PKR) checkout for a Pro pass — a card/JazzCash/Easypaisa
// path for users who can't pay via the card providers. Redirects to Safepay.
export function SafepayButton({ className }: { className?: string }) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  async function go() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/pay/safepay/create", { method: "POST" });
      if (res.status === 401) {
        window.location.href = "/login?redirect=/pricing";
        return;
      }
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setError(data.error || "Couldn't start checkout.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={className}>
      <Button variant="outline" onClick={go} disabled={loading} className="w-full">
        {loading ? "Redirecting…" : "Pay with Safepay (PKR)"}
      </Button>
      {error && <p className="mt-1 text-center text-xs text-destructive">{error}</p>}
    </div>
  );
}
