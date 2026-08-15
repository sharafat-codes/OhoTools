"use client";

import * as React from "react";

// Fires an "open" beacon for a short-linked card. Runs only in a real browser,
// so link-preview crawlers (which don't execute JS) never count as opens. De-
// dupes per browser for 6h so a refresh doesn't inflate the number.
export function CardOpenPing({ code }: { code: string }) {
  React.useEffect(() => {
    if (!code) return;
    const key = `oho_open_${code}`;
    try {
      const last = Number(localStorage.getItem(key) || 0);
      if (Date.now() - last < 6 * 60 * 60 * 1000) return;
      localStorage.setItem(key, String(Date.now()));
    } catch {
      /* storage blocked — still count once */
    }
    fetch("/api/card/open", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
      keepalive: true,
    }).catch(() => {});
  }, [code]);

  return null;
}
