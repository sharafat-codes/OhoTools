"use client";

import * as React from "react";

import { useSession as useAuthSession } from "@/lib/auth-client";

// Public pages are statically rendered and cached at the edge, so the server
// cannot know who is viewing. Without help, every signed-in visitor would see
// the logged-out UI for the second or so it takes the client session request to
// resolve — the header showing "Log in" to someone who is logged in.
//
// So the last known auth/plan state is cached in localStorage and read back
// before the first paint. A returning visitor gets the correct header
// immediately; the real session still arrives moments later and wins.

const SNAPSHOT_KEY = "oho-auth";

type Snapshot = { authed: boolean; plan: string };

function readSnapshot(): Snapshot | null {
  try {
    const raw = localStorage.getItem(SNAPSHOT_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as Snapshot;
    return typeof v?.authed === "boolean" ? { authed: v.authed, plan: String(v.plan || "FREE") } : null;
  } catch {
    return null; // private mode, blocked storage, or corrupt value
  }
}

function writeSnapshot(next: Snapshot) {
  // Keep the attribute the pre-paint script sets in step with reality, so a
  // sign-out takes effect immediately rather than on the next page load.
  try {
    document.documentElement.setAttribute("data-authed", next.authed ? "1" : "0");
  } catch {
    /* no DOM (SSR) */
  }
  try {
    localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable — we just lose the optimisation */
  }
}

// Runs before the browser paints on the client, so applying the snapshot does
// not produce a visible flash; falls back to useEffect during SSR.
const useIsoLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

/**
 * Drop-in replacement for `@/lib/auth-client`'s `useSession` that bridges the
 * gap while the real session loads, using the previous visit's cached state.
 *
 * Starts as `null` so the hydrated markup matches the static HTML exactly, then
 * applies the snapshot in a layout effect — before paint, so there is no flash.
 * Once the real session resolves it takes over and refreshes the snapshot, so a
 * sign-out or an upgrade elsewhere corrects itself on the next render.
 */
export function useSession() {
  const real = useAuthSession();
  const [snapshot, setSnapshot] = React.useState<Snapshot | null>(null);

  useIsoLayoutEffect(() => {
    setSnapshot(readSnapshot());
  }, []);

  const resolved = !real.isPending;
  const user = real.data?.user as { plan?: string } | undefined;

  React.useEffect(() => {
    if (!resolved) return;
    writeSnapshot(user ? { authed: true, plan: user.plan ?? "FREE" } : { authed: false, plan: "FREE" });
  }, [resolved, user]);

  if (!resolved && snapshot) {
    return {
      ...real,
      isPending: false,
      data: (snapshot.authed ? { user: { plan: snapshot.plan } } : null) as unknown as typeof real.data,
    };
  }
  return real;
}
