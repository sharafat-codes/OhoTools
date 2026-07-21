import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * Data Access Layer — the server-side security boundary.
 *
 * Every protected page, Server Component, and (future) Server Action should read
 * the current user through here rather than trusting client state or the
 * optimistic redirects in proxy.ts. `cache()` dedupes the session lookup within
 * a single render pass.
 */
export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});

export const getCurrentUser = cache(async () => {
  const session = await getSession();
  return session?.user ?? null;
});

/** Returns the user or redirects to /login. Use in protected routes. */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}
