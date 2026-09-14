"use client";

import * as React from "react";
import { CalendarDaysIcon, MapPinIcon, ClockIcon, XIcon, CalendarPlusIcon } from "lucide-react";

import { OCCASIONS, resolveTheme, type CardData } from "@/modules/cards/types";

function fmtDate(date?: string) {
  if (!date) return "";
  const d = new Date(`${date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function fmtTime(time?: string) {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h)) return time;
  const d = new Date();
  d.setHours(h, m || 0, 0, 0);
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

/** Google Calendar "add event" URL, if we have at least a date. */
function calendarUrl(card: CardData, title: string): string {
  const ev = card.event;
  if (!ev?.date) return "";
  const dnum = ev.date.replace(/-/g, "");
  let dates: string;
  if (ev.time) {
    const t = ev.time.replace(":", "") + "00";
    // Naive +2h end.
    const [h, m] = ev.time.split(":").map(Number);
    const end = new Date();
    end.setHours(h + 2, m || 0, 0, 0);
    const endT = `${String(end.getHours()).padStart(2, "0")}${String(end.getMinutes()).padStart(2, "0")}00`;
    dates = `${dnum}T${t}/${dnum}T${endT}`;
  } else {
    // All-day: end date is the next day.
    const next = new Date(`${ev.date}T00:00:00`);
    next.setDate(next.getDate() + 1);
    const nextNum = `${next.getFullYear()}${String(next.getMonth() + 1).padStart(2, "0")}${String(next.getDate()).padStart(2, "0")}`;
    dates = `${dnum}/${nextNum}`;
  }
  const params = new URLSearchParams({ action: "TEMPLATE", text: title, dates });
  const loc = ev.address || ev.venue;
  if (loc) params.set("location", loc);
  if (card.message) params.set("details", card.message);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function mapUrl(card: CardData): string {
  const q = card.event?.address || card.event?.venue;
  if (!q) return "";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

export function InvitationPanel({ card }: { card: CardData; code?: string }) {
  const [open, setOpen] = React.useState(false);
  const ev = card.event;
  if (!ev) return null; // nothing to show yet (RSVP-only handled in a later phase)

  const theme = resolveTheme(card);
  const title = OCCASIONS[card.occasion].title(card.to);
  const cal = calendarUrl(card, title);
  const map = mapUrl(card);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="absolute bottom-16 left-1/2 z-30 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur-sm transition-transform hover:scale-105"
        style={{ backgroundColor: theme.accent, color: "#111" }}
      >
        <CalendarDaysIcon className="size-4" /> Event details
      </button>

      {open && (
        <div className="absolute inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm" role="dialog" aria-modal>
          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white text-neutral-900 shadow-2xl dark:bg-neutral-900 dark:text-neutral-100">
            <div className="px-5 py-4 text-white" style={{ background: `linear-gradient(135deg, ${theme.bg1}, ${theme.bg2})` }}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-wide opacity-80">{OCCASIONS[card.occasion].eyebrow}</div>
                  <h2 className="font-heading text-lg font-semibold">{card.to}</h2>
                </div>
                <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="rounded-full bg-white/20 p-1 hover:bg-white/30">
                  <XIcon className="size-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3 p-5 text-sm">
              {ev.date && (
                <div className="flex items-start gap-3">
                  <CalendarDaysIcon className="mt-0.5 size-4 shrink-0 text-neutral-500" />
                  <div>
                    <div className="font-medium">{fmtDate(ev.date)}</div>
                    {ev.time && <div className="text-neutral-500">{fmtTime(ev.time)}</div>}
                  </div>
                </div>
              )}
              {!ev.date && ev.time && (
                <div className="flex items-start gap-3">
                  <ClockIcon className="mt-0.5 size-4 shrink-0 text-neutral-500" />
                  <div className="font-medium">{fmtTime(ev.time)}</div>
                </div>
              )}
              {(ev.venue || ev.address) && (
                <div className="flex items-start gap-3">
                  <MapPinIcon className="mt-0.5 size-4 shrink-0 text-neutral-500" />
                  <div>
                    {ev.venue && <div className="font-medium">{ev.venue}</div>}
                    {ev.address && <div className="text-neutral-500">{ev.address}</div>}
                  </div>
                </div>
              )}

              <div className="mt-1 flex flex-wrap gap-2">
                {cal && (
                  <a
                    href={cal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-2 text-xs font-medium text-white hover:opacity-90 dark:bg-white dark:text-neutral-900"
                  >
                    <CalendarPlusIcon className="size-3.5" /> Add to calendar
                  </a>
                )}
                {map && (
                  <a
                    href={map}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 px-3 py-2 text-xs font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                  >
                    <MapPinIcon className="size-3.5" /> View map
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
