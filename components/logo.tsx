import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * OhoTool brand mark — an interlocking rounded "scan frame" (two opposing
 * corner brackets) with a center stem and dot. Monochrome; inherits color via
 * `currentColor` so it adapts to light/dark automatically. Vector, so it stays
 * razor-sharp at any size. Single source of truth for the whole app + favicon +
 * OG image (see `LogoGlyph`).
 */
function MarkShapes({ color }: { color: string }) {
  return (
    <>
      {/* top-left bracket */}
      <path
        d="M24 8 L20 8 A12 12 0 0 0 8 20 L8 24"
        stroke={color}
        strokeWidth={7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* bottom-right bracket (180° rotation) */}
      <path
        d="M24 40 L28 40 A12 12 0 0 0 40 28 L40 24"
        stroke={color}
        strokeWidth={7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* center stem */}
      <rect x={21} y={19} width={6} height={16} rx={3} fill={color} />
      {/* dot */}
      <rect x={30} y={11} width={7} height={7} rx={2.6} fill={color} />
    </>
  );
}

/** The mark on its own, sized via className (uses currentColor). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="OhoTool"
      className={cn("size-7", className)}
    >
      <MarkShapes color="currentColor" />
    </svg>
  );
}

/**
 * Explicit-color / explicit-size variant for `next/og` ImageResponse (Satori),
 * which renders inline styles rather than Tailwind classes.
 */
export function LogoGlyph({
  color = "currentColor",
  size = 48,
}: {
  color?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <MarkShapes color={color} />
    </svg>
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
        "flex items-center gap-2 font-heading font-semibold tracking-tight text-foreground",
        s.text,
        className,
      )}
    >
      <LogoMark className={cn(s.mark, markClassName)} />
      {wordmark && <span>OhoTool</span>}
    </Link>
  );
}
