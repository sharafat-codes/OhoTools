import { ArrowRightIcon, CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Invitify is the dedicated invitation studio built from this card engine.
 * OhoTool's free makers stay as they are; this points people who want more —
 * cultural designs, the invitation website, fuller RSVP — to the same occasion
 * there, so they don't start over.
 */
const INVITIFY = "https://invitifycard.com";

/** OhoTool card-maker slug → Invitify occasion. */
const OCCASION_BY_SLUG: Record<string, string> = {
  "birthday-card-maker": "birthday",
  "wedding-invitation-maker": "wedding",
  "engagement-invitation-maker": "engagement",
  "anniversary-card-maker": "anniversary",
  "save-the-date-maker": "save-the-date",
  "eid-card-maker": "eid",
  "diwali-card-maker": "diwali",
  "christmas-card-maker": "christmas",
  "new-year-card-maker": "newyear",
  "valentine-card-maker": "valentine",
  "baby-shower-invitation-maker": "baby-shower",
  "graduation-card-maker": "graduation",
};

const WEDDING_LIKE = new Set(["wedding", "engagement", "save-the-date", "anniversary"]);

export function invitifyUrl(slug?: string) {
  const occasion = slug ? OCCASION_BY_SLUG[slug] : undefined;
  const path = occasion ? `/create/${occasion}` : "/designs";
  return `${INVITIFY}${path}?ref=ohotool`;
}

function InvitifyMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={cn("shrink-0", className)}>
      <defs>
        <linearGradient id="invitify-promo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F43F5E" />
          <stop offset="1" stopColor="#A21CAF" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#invitify-promo-g)" />
      <path d="M20 20 L32 24 L32 50 L20 46 Z" fill="#fff" opacity=".6" />
      <path d="M32 24 L46 18 L46 44 L32 50 Z" fill="#fff" />
      <path
        d="M47 7.5 C47.88 12.12 47.88 12.12 52.5 13 C47.88 13.88 47.88 13.88 47 18.5 C46.12 13.88 46.12 13.88 41.5 13 C46.12 12.12 46.12 12.12 47 7.5Z"
        fill="#FDE68A"
      />
    </svg>
  );
}

export function InvitifyPromo({ slug, className }: { slug?: string; className?: string }) {
  const occasion = slug ? OCCASION_BY_SLUG[slug] : undefined;
  const wedding = occasion ? WEDDING_LIKE.has(occasion) : true;
  const points = wedding
    ? [
        "Nikah, Shaadi, Mehndi & Uzbek suzani designs",
        "A full invitation website — schedule, gallery, countdown",
        "RSVP with meal choices & guest names",
        "Urdu, Arabic & 4 more languages · print-ready PDF",
      ]
    : [
        "More premium animated designs",
        "Cards in Urdu, Arabic, Hindi, Russian & Uzbek",
        "Video for WhatsApp status & print-ready PDF",
        "Save, track opens and collect RSVPs",
      ];

  return (
    <aside
      className={cn(
        "relative overflow-hidden rounded-2xl border border-fuchsia-500/25 bg-gradient-to-br from-rose-500/[0.07] via-transparent to-fuchsia-600/[0.09] p-5 sm:p-6",
        className,
      )}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex-1">
          <div className="flex items-center gap-2.5">
            <InvitifyMark className="size-8" />
            <span className="text-lg font-semibold tracking-tight">Invitify</span>
            <span className="rounded-full bg-fuchsia-500/10 px-2 py-0.5 text-[11px] font-medium text-fuchsia-700 dark:text-fuchsia-300">
              by OhoTool
            </span>
          </div>
          <p className="mt-3 font-medium">
            Want the full experience? Make it in Invitify, our dedicated invitation studio.
          </p>
          <ul className="mt-3 grid gap-1.5 text-sm text-muted-foreground sm:grid-cols-2">
            {points.map((p) => (
              <li key={p} className="flex gap-2">
                <CheckIcon className="mt-0.5 size-4 shrink-0 text-fuchsia-600 dark:text-fuchsia-400" />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <a
          href={invitifyUrl(slug)}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-fuchsia-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
        >
          Open in Invitify <ArrowRightIcon className="size-4" />
        </a>
      </div>
    </aside>
  );
}
