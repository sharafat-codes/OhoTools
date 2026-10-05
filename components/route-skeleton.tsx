/**
 * Content-area placeholder rendered by loading.tsx while a dynamic route
 * renders on the server. The surrounding layout — header, dashboard sidebar —
 * stays on screen; only the content swaps, so a click visibly lands at once.
 *
 * Its other job is invisible: Next.js only prefetches a dynamic route up to its
 * nearest loading boundary, so without a loading.tsx those routes were never
 * prefetched at all.
 */
export function RouteSkeleton({ variant = "page" }: { variant?: "page" | "app" }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={
        variant === "page"
          ? "mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14"
          : "mx-auto w-full max-w-5xl"
      }
    >
      <div className="h-8 w-56 max-w-[70%] animate-pulse rounded-lg bg-muted" />
      <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-muted/70" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-muted/60" />
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
