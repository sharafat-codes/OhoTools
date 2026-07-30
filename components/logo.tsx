import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * OhoTool brand mark — the gradient "O" + sparkle. A small pre-optimized raster
 * asset (public/logo-mark.png, 192px, ~32KB) served with a plain <img> so it
 * always renders. Transparent background, so it sits cleanly on light or dark
 * surfaces. (The full-res master lives at public/logo-icon.png, used for the
 * Organization schema logo.)
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo-mark.png"
      alt="OhoTool"
      className={cn("size-7 select-none", className)}
    />
  );
}

const SIZES = {
  sm: { mark: "size-6", text: "text-base" },
  md: { mark: "size-7", text: "text-lg" },
  lg: { mark: "size-9", text: "text-2xl" },
} as const;

/** Full lockup (mark + "OhoTool" wordmark), rendered as a link. */
export function Logo({
  href = "/",
  size = "md",
  wordmark = true,
  className,
  markClassName,
  onClick,
}: {
  href?: string;
  size?: keyof typeof SIZES;
  wordmark?: boolean;
  className?: string;
  markClassName?: string;
  onClick?: () => void;
}) {
  const s = SIZES[size];
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-label="OhoTool home"
      className={cn(
        "flex items-center gap-2 tracking-tight text-foreground",
        s.text,
        className,
      )}
    >
      <LogoMark className={cn(s.mark, markClassName)} />
      {wordmark && (
        <span className="font-extrabold tracking-tight [font-family:var(--font-manrope)]">
          OhoTool
        </span>
      )}
    </Link>
  );
}
