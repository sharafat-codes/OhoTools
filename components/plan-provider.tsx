"use client";

import * as React from "react";

import { useSession as useAuthSession } from "@/lib/auth-client";

// Seeds the user's auth/plan state from the server so plan-gated UI paints
// correctly on first render instead of flashing the "logged-out / not-Pro"
// state while the client session request is in flight.

type PlanSeed = { authed: boolean; plan: string };

const PlanContext = React.createContext<PlanSeed | null>(null);

export function PlanProvider({
  authed,
  plan,
  children,
}: {
  authed: boolean;
  plan: string;
  children: React.ReactNode;
}) {
  const value = React.useMemo(() => ({ authed, plan }), [authed, plan]);
  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

/**
 * Drop-in replacement for `@/lib/auth-client`'s `useSession`, but backed by the
 * server-seeded plan while the real client session loads — so components that
 * derive `pro`/`loggedIn` from `data.user` don't flash. Once the real session
 * resolves it takes over (same values, so no visible change). Falls back to the
 * real session if used outside a PlanProvider.
 */
export function useSession() {
  const seed = React.useContext(PlanContext);
  const real = useAuthSession();

  if (seed && real.isPending) {
    return {
      ...real,
      isPending: false,
      data: (seed.authed ? { user: { plan: seed.plan } } : null) as unknown as typeof real.data,
    };
  }
  return real;
}
