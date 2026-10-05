"use client";

import { useLinkStatus } from "next/link";

/**
 * A thin bar across the top of the page while a link click is still waiting on
 * the server — its target wasn't prefetched yet (a slow network, or a dynamic
 * route reached before its loading.tsx shell arrived). Without it, a click on
 * a slow route looks like nothing happened.
 *
 * Must be rendered inside a <Link>. It stays invisible for the first 120ms (see
 * .nav-pending in globals.css), so prefetched navigations, which finish within
 * a frame, never flash it.
 */
export function NavPending() {
  const { pending } = useLinkStatus();
  return <span aria-hidden className={pending ? "nav-pending is-pending" : "nav-pending"} />;
}
