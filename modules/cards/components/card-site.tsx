"use client";

import * as React from "react";
import {
  CalendarDaysIcon, MapPinIcon, ClockIcon, CalendarPlusIcon, PhoneIcon,
  MessageCircleIcon, SparklesIcon, ChevronDownIcon, ImagesIcon, UsersIcon,
} from "lucide-react";

import { OCCASIONS, type CardData } from "@/modules/cards/types";
import { sitePalette, type SitePalette } from "@/modules/cards/palette";
import { CardCountdown } from "@/modules/cards/components/card-countdown";
import { RsvpForm, calendarUrl, mapUrl, fmtDate, fmtTime } from "@/modules/cards/components/invitation-panel";

type Ink = SitePalette["ink"];
const InkCtx = React.createContext<Ink>("light");

/**
 * The scrolling invitation website that sits beneath the animated card.
 *
 * Every section is optional and only renders when the host filled it in, so a
 * card with a single gallery photo gets one short section rather than a page
 * of empty headings. Colours come from the template's own palette (see
 * palette.ts) so the scroll continues the opening instead of changing site.
 */
export function CardSite({ card, code }: { card: CardData; code?: string }) {
  const s = card.site;
  if (!s) return null;
  const t = sitePalette(card);
  const light = t.ink === "light";
  const ev = card.event;
  const title = OCCASIONS[card.occasion].title(card.to);
  const cal = calendarUrl(card, title);
  const map = mapUrl(card);
  const hasRsvp = !!code && !!card.rsvp;
  const whenWhere = !!(ev?.date || ev?.time || ev?.venue || ev?.address);

  return (
    <InkCtx.Provider value={t.ink}>
    <div className={"relative " + (light ? "text-white" : "text-neutral-900")} style={{ background: t.bg }}>
      {/* Soft vignette so photos and glass cards sit on something, not flat colour. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: light
          ? "radial-gradient(ellipse at top, rgba(255,255,255,0.10), transparent 55%)"
          : "radial-gradient(ellipse at top, rgba(0,0,0,0.05), transparent 55%)" }}
      />

      <div className="relative mx-auto flex w-full max-w-2xl flex-col gap-14 px-5 py-16 sm:gap-20 sm:px-8 sm:py-24">
        {s.countdown && ev?.date && (
          <Section eyebrow="Counting down" accent={t.accent}>
            <CardCountdown date={ev.date} time={ev.time} accent={t.accent} ink={t.ink} />
          </Section>
        )}

        {whenWhere && (
          <Section eyebrow="When & where" accent={t.accent}>
            <Glass>
              <div className="flex flex-col gap-4 text-sm sm:text-base">
                {ev?.date && (
                  <Row icon={CalendarDaysIcon}>
                    <div className="font-medium">{fmtDate(ev.date)}</div>
                    {ev.time && <div className="opacity-75">{fmtTime(ev.time)}</div>}
                  </Row>
                )}
                {!ev?.date && ev?.time && (
                  <Row icon={ClockIcon}><div className="font-medium">{fmtTime(ev.time)}</div></Row>
                )}
                {(ev?.venue || ev?.address) && (
                  <Row icon={MapPinIcon}>
                    {ev.venue && <div className="font-medium">{ev.venue}</div>}
                    {ev.address && <div className="opacity-75">{ev.address}</div>}
                  </Row>
                )}
                {(cal || map) && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {cal && <Pill href={cal} accent={t.accent} solid><CalendarPlusIcon className="size-4" /> Add to calendar</Pill>}
                    {map && <Pill href={map} accent={t.accent}><MapPinIcon className="size-4" /> Open in Maps</Pill>}
                  </div>
                )}
              </div>
            </Glass>
          </Section>
        )}

        {s.schedule?.length ? (
          <Section eyebrow="Schedule" accent={t.accent}>
            <ol className={"relative ml-3 flex flex-col gap-6 border-l pl-6 " + (light ? "border-white/20" : "border-black/15")}>
              {s.schedule.map((e, i) => (
                <li key={i} className="relative">
                  <span
                    className="absolute -left-[31px] top-1.5 size-2.5 rounded-full"
                    style={{ background: t.accent, boxShadow: `0 0 0 4px ${light ? "rgba(0,0,0,.45)" : "rgba(255,255,255,.8)"}` }}
                  />
                  <div className="font-heading text-lg font-semibold sm:text-xl">{e.title}</div>
                  <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-sm opacity-80">
                    {e.date && <span>{fmtDate(e.date)}</span>}
                    {e.time && <span>{fmtTime(e.time)}</span>}
                  </div>
                  {e.venue && <div className="mt-1 flex items-center gap-1.5 text-sm opacity-80"><MapPinIcon className="size-3.5" /> {e.venue}</div>}
                  {e.note && <p className="mt-1.5 text-sm opacity-70">{e.note}</p>}
                </li>
              ))}
            </ol>
          </Section>
        ) : null}

        {s.gallery?.length ? (
          <Section eyebrow="Gallery" accent={t.accent} icon={ImagesIcon}>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
              {s.gallery.map((src, i) => (
                <a
                  key={src}
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    "group relative block overflow-hidden rounded-2xl ring-1 " +
                    (light ? "bg-white/5 ring-white/10 " : "bg-black/5 ring-black/10 ") +
                    // The first photo gets the full width on phones — it's the one
                    // the couple chose first, and a 2-up grid makes it a thumbnail.
                    (i === 0 ? "col-span-2 aspect-[4/3] sm:col-span-3 sm:aspect-[21/9]" : "aspect-square")
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- remote storage URLs, no loader */}
                  <img
                    src={src}
                    alt=""
                    loading={i < 3 ? "eager" : "lazy"}
                    decoding="async"
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </a>
              ))}
            </div>
          </Section>
        ) : null}

        {hasRsvp && code && (
          <Section eyebrow="RSVP" accent={t.accent} icon={UsersIcon}>
            {/* The form is built for a white sheet, so it always sits on one. */}
            <div className="rounded-3xl bg-white p-5 text-neutral-900 shadow-xl sm:p-6 [&_.border-t]:border-0 [&_.border-t]:pt-0">
              <RsvpForm code={code} accent={t.accent} />
            </div>
          </Section>
        )}

        {s.contacts?.length ? (
          <Section eyebrow="Questions?" accent={t.accent}>
            <div className="grid gap-3 sm:grid-cols-2">
              {s.contacts.map((c, i) => (
                <Glass key={i}>
                  <div className="font-heading text-lg font-semibold">{c.name}</div>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {c.phone && <Pill href={`tel:${c.phone.replace(/[\s-]/g, "")}`} accent={t.accent}><PhoneIcon className="size-4" /> Call</Pill>}
                    {c.whatsapp && (
                      <Pill href={`https://wa.me/${c.whatsapp.replace(/[^\d]/g, "")}`} accent={t.accent} solid>
                        <MessageCircleIcon className="size-4" /> WhatsApp
                      </Pill>
                    )}
                  </div>
                </Glass>
              ))}
            </div>
          </Section>
        ) : null}

        <footer className="pt-2 text-center">
          <p className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">{card.to}</p>
          {card.from.trim() && <p className="mt-1 text-sm opacity-70">with love, {card.from}</p>}
          {!card.noWatermark && (
            <a
              href="/tools/wedding-invitation-maker"
              className={
                "mt-8 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium backdrop-blur-sm transition-colors " +
                (light ? "bg-black/30 text-white hover:bg-black/45" : "bg-black/80 text-white hover:bg-black")
              }
            >
              <SparklesIcon className="size-3.5" /> Made with OhoTool — create your own
            </a>
          )}
        </footer>
      </div>
    </div>
    </InkCtx.Provider>
  );
}

/** The chevron on the opening card that says "there's more below". */
export function ScrollCue({ accent, ink = "light" }: { accent: string; ink?: Ink }) {
  return (
    <a
      href="#invitation"
      aria-label="Scroll to the invitation"
      className={
        "absolute bottom-16 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-1 text-[11px] font-medium uppercase tracking-[0.25em] " +
        (ink === "light" ? "text-white/85 drop-shadow" : "text-neutral-800/80")
      }
    >
      Scroll
      <ChevronDownIcon className="size-5 animate-bounce" style={{ color: accent }} />
    </a>
  );
}

function Section({ eyebrow, accent, icon: Icon, children }: { eyebrow: string; accent: string; icon?: typeof ImagesIcon; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-5">
      <h2 className="flex items-center justify-center gap-2 text-center text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: accent }}>
        {Icon && <Icon className="size-3.5" />}
        {eyebrow}
      </h2>
      {children}
    </section>
  );
}

function Glass({ children }: { children: React.ReactNode }) {
  const ink = React.useContext(InkCtx);
  return (
    <div
      className={
        "rounded-3xl border p-5 shadow-xl backdrop-blur-md sm:p-6 " +
        (ink === "light" ? "border-white/15 bg-white/10" : "border-black/10 bg-white/60 shadow-black/5")
      }
    >
      {children}
    </div>
  );
}

function Row({ icon: Icon, children }: { icon: typeof MapPinIcon; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 opacity-70" />
      <div>{children}</div>
    </div>
  );
}

function Pill({ href, accent, solid, children }: { href: string; accent: string; solid?: boolean; children: React.ReactNode }) {
  const ink = React.useContext(InkCtx);
  const external = /^https?:/.test(href);
  // A solid pill is filled with the accent; its text must contrast with that,
  // not with the page. Light accents (pale pink, gold) need dark text; the
  // deep sage/rust/wine accents of the light templates need white.
  const solidText = solid && ink === "dark" ? "text-white" : "text-neutral-900";
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={
        "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-transform hover:scale-[1.03] " +
        (solid ? solidText : ink === "light" ? "border border-white/25 bg-white/10 text-white" : "border border-black/15 bg-white/50 text-neutral-900")
      }
      style={solid ? { backgroundColor: accent } : undefined}
    >
      {children}
    </a>
  );
}
