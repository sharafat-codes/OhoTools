"use client";

import * as React from "react";
import { Share2Icon, LinkIcon, CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// lucide dropped brand glyphs, so brand icons are inline SVG (simple-icons paths,
// monochrome via currentColor so they follow the theme).
function Svg({ path, label }: { path: string; label: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-4 fill-current" role="img">
      <title>{label}</title>
      <path d={path} />
    </svg>
  );
}

const ICONS = {
  x: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z",
  whatsapp:
    "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z",
  reddit:
    "M24 11.779c0-1.459-1.192-2.645-2.657-2.645-.715 0-1.363.286-1.84.746-1.81-1.191-4.259-1.949-6.971-2.046l1.483-4.669 4.016.941-.006.058c0 1.193.975 2.163 2.174 2.163 1.198 0 2.172-.97 2.172-2.163s-.975-2.164-2.172-2.164c-.92 0-1.703.574-2.021 1.379l-4.329-1.015c-.189-.046-.381.063-.44.249l-1.654 5.207c-2.759.081-5.25.839-7.083 2.043-.478-.46-1.125-.746-1.84-.746-1.466 0-2.658 1.186-2.658 2.645 0 1.058.629 1.965 1.531 2.379-.041.242-.062.49-.062.741 0 3.771 4.375 6.836 9.75 6.836 5.376 0 9.75-3.065 9.75-6.836 0-.246-.02-.487-.059-.726.914-.41 1.552-1.322 1.552-2.394zM7.256 14.132c0-.849.691-1.539 1.541-1.539.85 0 1.54.69 1.54 1.539 0 .849-.69 1.538-1.54 1.538-.849 0-1.541-.689-1.541-1.538zm8.484 3.716c-.919.917-2.669.99-3.181.99-.511 0-2.262-.073-3.181-.99-.137-.137-.137-.358 0-.494.136-.137.358-.137.494 0 .581.58 1.822.784 2.687.784.865 0 2.106-.204 2.687-.784.137-.137.359-.137.494 0 .137.136.137.357 0 .494zm-.299-2.178c-.849 0-1.54-.689-1.54-1.538 0-.849.691-1.539 1.54-1.539.85 0 1.54.69 1.54 1.539 0 .849-.69 1.538-1.54 1.538z",
  facebook:
    "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  pinterest:
    "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z",
} as const;

type Network = { key: keyof typeof ICONS; label: string; href: (u: string, t: string, img: string) => string };

const NETWORKS: Network[] = [
  { key: "x", label: "X", href: (u, t) => `https://twitter.com/intent/tweet?text=${enc(t)}&url=${enc(u)}` },
  { key: "linkedin", label: "LinkedIn", href: (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${enc(u)}` },
  { key: "whatsapp", label: "WhatsApp", href: (u, t) => `https://wa.me/?text=${enc(`${t} ${u}`)}` },
  { key: "reddit", label: "Reddit", href: (u, t) => `https://www.reddit.com/submit?url=${enc(u)}&title=${enc(t)}` },
  { key: "facebook", label: "Facebook", href: (u) => `https://www.facebook.com/sharer/sharer.php?u=${enc(u)}` },
  {
    key: "pinterest",
    label: "Pinterest",
    href: (u, t, img) =>
      `https://pinterest.com/pin/create/button/?url=${enc(u)}&description=${enc(t)}${img ? `&media=${enc(img)}` : ""}`,
  },
];

function enc(s: string) {
  return encodeURIComponent(s);
}

export function ShareButton({
  url,
  title,
  image,
  align = "start",
  className,
}: {
  url?: string;
  title?: string;
  /** Image URL for platforms that pin one (Pinterest). Usually the page's OG image. */
  image?: string;
  /** Which edge the menu aligns to. Use "end" when the button sits on the right. */
  align?: "start" | "end";
  className?: string;
}) {
  // Only prefer the native share sheet on touch/mobile devices — on desktop it's
  // an inconsistent OS sheet that often lacks targets like Pinterest, so we show
  // our own curated menu there instead.
  const [preferNative, setPreferNative] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const native = typeof navigator !== "undefined" && typeof navigator.share === "function";
    const coarse =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(pointer: coarse)").matches;
    setPreferNative(native && coarse);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const resolveUrl = () => url ?? (typeof window !== "undefined" ? window.location.href : "");
  const resolveTitle = () => title ?? (typeof document !== "undefined" ? document.title : "");

  async function onClick() {
    if (preferNative) {
      try {
        await navigator.share({ title: resolveTitle(), text: resolveTitle(), url: resolveUrl() });
      } catch {
        /* user cancelled */
      }
      return;
    }
    setOpen((o) => !o);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(resolveUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      <Button variant="outline" size="sm" onClick={onClick} aria-haspopup={!preferNative} aria-expanded={open}>
        <Share2Icon />
        Share
      </Button>

      {open && (
        <div
          className={cn(
            "absolute z-30 mt-2 w-48 overflow-hidden rounded-xl border border-border bg-popover p-1 shadow-lg",
            align === "end" ? "right-0" : "left-0",
          )}
        >
          {NETWORKS.map((n) => (
            <a
              key={n.key}
              href={n.href(resolveUrl(), resolveTitle(), image ?? "")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
            >
              <Svg path={ICONS[n.key]} label={n.label} />
              {n.label}
            </a>
          ))}
          <button
            onClick={copy}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
          >
            {copied ? <CheckIcon className="size-4 text-emerald-600 dark:text-emerald-500" /> : <LinkIcon className="size-4" />}
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>
      )}
    </div>
  );
}
