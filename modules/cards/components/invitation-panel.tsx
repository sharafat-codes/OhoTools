"use client";

import * as React from "react";
import {
  CalendarDaysIcon, MapPinIcon, ClockIcon, XIcon, CalendarPlusIcon,
  CheckCircle2Icon, Loader2Icon,
} from "lucide-react";

import { OCCASIONS, resolveTheme, type CardData } from "@/modules/cards/types";
import { submitRsvp } from "@/modules/cards/actions";

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

function calendarUrl(card: CardData, title: string): string {
  const ev = card.event;
  if (!ev?.date) return "";
  const dnum = ev.date.replace(/-/g, "");
  let dates: string;
  if (ev.time) {
    const t = `${ev.time.replace(":", "")}00`;
    const [h, m] = ev.time.split(":").map(Number);
    const end = new Date();
    end.setHours(h + 2, m || 0, 0, 0);
    const endT = `${String(end.getHours()).padStart(2, "0")}${String(end.getMinutes()).padStart(2, "0")}00`;
    dates = `${dnum}T${t}/${dnum}T${endT}`;
  } else {
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
  return q ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}` : "";
}

function RsvpForm({ code, accent }: { code: string; accent: string }) {
  const [name, setName] = React.useState("");
  const [attending, setAttending] = React.useState<"yes" | "no">("yes");
  const [guests, setGuests] = React.useState("1");
  const [message, setMessage] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = React.useState("");

  async function submit() {
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    setStatus("sending");
    setError("");
    const res = await submitRsvp({
      code,
      name,
      attending: attending === "yes",
      guests: Number(guests) || 1,
      message,
    });
    if (res.ok) setStatus("done");
    else {
      setStatus("error");
      setError(res.error);
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center text-sm">
        <CheckCircle2Icon className="mx-auto mb-1 size-6 text-emerald-600" />
        <p className="font-medium">Thanks, {name.trim().split(" ")[0]}!</p>
        <p className="text-neutral-500">Your RSVP has been sent to the host.</p>
      </div>
    );
  }

  const field = "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-800";

  return (
    <div className="flex flex-col gap-2.5 border-t border-neutral-200 pt-4 dark:border-neutral-800">
      <p className="text-sm font-semibold">Will you attend?</p>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" maxLength={80} className={field} />
      <div className="inline-flex rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
        {(["yes", "no"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setAttending(v)}
            className={"flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors " + (attending === v ? "bg-white shadow-sm dark:bg-neutral-900" : "text-neutral-500")}
          >
            {v === "yes" ? "✅ Yes, I'll be there" : "❌ Can't make it"}
          </button>
        ))}
      </div>
      {attending === "yes" && (
        <label className="flex items-center justify-between gap-2 text-sm">
          <span className="text-neutral-600 dark:text-neutral-300">Number of guests (incl. you)</span>
          <input type="number" min={1} max={20} value={guests} onChange={(e) => setGuests(e.target.value)} className={field + " w-20"} />
        </label>
      )}
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message (optional)" maxLength={300} rows={2} className={field + " resize-none"} />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button
        type="button"
        onClick={submit}
        disabled={status === "sending"}
        className="inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold text-neutral-900 transition-transform hover:scale-[1.02] disabled:opacity-70"
        style={{ backgroundColor: accent }}
      >
        {status === "sending" ? <Loader2Icon className="size-4 animate-spin" /> : null}
        Send RSVP
      </button>
    </div>
  );
}

export function InvitationPanel({ card, code }: { card: CardData; code?: string }) {
  const [open, setOpen] = React.useState(false);
  const ev = card.event;
  const hasRsvp = !!code && !!card.rsvp;
  if (!ev && !hasRsvp) return null;

  const theme = resolveTheme(card);
  const title = OCCASIONS[card.occasion].title(card.to);
  const cal = calendarUrl(card, title);
  const map = mapUrl(card);
  const label = hasRsvp && !ev ? "RSVP" : hasRsvp ? "Details & RSVP" : "Event details";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="absolute bottom-16 left-1/2 z-30 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold shadow-lg backdrop-blur-sm transition-transform hover:scale-105"
        style={{ backgroundColor: theme.accent, color: "#111" }}
      >
        <CalendarDaysIcon className="size-4" /> {label}
      </button>

      {open && (
        <div className="absolute inset-0 z-50 grid place-items-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm" role="dialog" aria-modal>
          <div className="relative my-auto w-full max-w-sm overflow-hidden rounded-2xl bg-white text-neutral-900 shadow-2xl dark:bg-neutral-900 dark:text-neutral-100">
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
              {ev?.date && (
                <div className="flex items-start gap-3">
                  <CalendarDaysIcon className="mt-0.5 size-4 shrink-0 text-neutral-500" />
                  <div>
                    <div className="font-medium">{fmtDate(ev.date)}</div>
                    {ev.time && <div className="text-neutral-500">{fmtTime(ev.time)}</div>}
                  </div>
                </div>
              )}
              {ev && !ev.date && ev.time && (
                <div className="flex items-start gap-3">
                  <ClockIcon className="mt-0.5 size-4 shrink-0 text-neutral-500" />
                  <div className="font-medium">{fmtTime(ev.time)}</div>
                </div>
              )}
              {ev && (ev.venue || ev.address) && (
                <div className="flex items-start gap-3">
                  <MapPinIcon className="mt-0.5 size-4 shrink-0 text-neutral-500" />
                  <div>
                    {ev.venue && <div className="font-medium">{ev.venue}</div>}
                    {ev.address && <div className="text-neutral-500">{ev.address}</div>}
                  </div>
                </div>
              )}

              {ev && (cal || map) && (
                <div className="flex flex-wrap gap-2">
                  {cal && (
                    <a href={cal} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-2 text-xs font-medium text-white hover:opacity-90 dark:bg-white dark:text-neutral-900">
                      <CalendarPlusIcon className="size-3.5" /> Add to calendar
                    </a>
                  )}
                  {map && (
                    <a href={map} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 px-3 py-2 text-xs font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800">
                      <MapPinIcon className="size-3.5" /> View map
                    </a>
                  )}
                </div>
              )}

              {hasRsvp && code && <RsvpForm code={code} accent={theme.accent} />}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
