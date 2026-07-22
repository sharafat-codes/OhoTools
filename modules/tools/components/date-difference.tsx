"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

function localISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

function useTodayISO() {
  const [today, setToday] = React.useState("");
  React.useEffect(() => {
    let ok = true;
    Promise.resolve().then(() => {
      if (ok) setToday(localISO(new Date()));
    });
    return () => {
      ok = false;
    };
  }, []);
  return today;
}

function diffYMD(from: Date, to: Date) {
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();
  if (days < 0) {
    months -= 1;
    days += new Date(to.getFullYear(), to.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

export function DateDifference() {
  const today = useTodayISO();
  const [start, setStart] = React.useState("");
  const [end, setEnd] = React.useState("");

  const s = start || today;
  const e = end || today;
  const from = s ? new Date(s + "T00:00:00") : null;
  const to = e ? new Date(e + "T00:00:00") : null;

  const valid = from && to && !isNaN(from.getTime()) && !isNaN(to.getTime());
  const [lo, hi] = valid ? (from! <= to! ? [from!, to!] : [to!, from!]) : [null, null];
  const totalDays = lo && hi ? Math.round((hi.getTime() - lo.getTime()) / 86400000) : 0;
  const ymd = lo && hi ? diffYMD(lo, hi) : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="start">Start date</Label>
            <button type="button" className="text-xs text-primary hover:underline" onClick={() => setStart(today)}>
              Today
            </button>
          </div>
          <Input id="start" type="date" value={s} onChange={(ev) => setStart(ev.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="end">End date</Label>
            <button type="button" className="text-xs text-primary hover:underline" onClick={() => setEnd(today)}>
              Today
            </button>
          </div>
          <Input id="end" type="date" value={e} onChange={(ev) => setEnd(ev.target.value)} />
        </div>
      </div>

      {ymd ? (
        <>
          <Card>
            <CardContent className="py-5 text-center">
              <div className="font-heading text-2xl font-semibold">
                {ymd.years > 0 && (
                  <>
                    {ymd.years} <span className="text-base font-normal text-muted-foreground">yr </span>
                  </>
                )}
                {(ymd.years > 0 || ymd.months > 0) && (
                  <>
                    {ymd.months} <span className="text-base font-normal text-muted-foreground">mo </span>
                  </>
                )}
                {ymd.days} <span className="text-base font-normal text-muted-foreground">days</span>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {totalDays === 0 ? "Same day" : `${totalDays.toLocaleString()} days total`}
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Total days", value: totalDays.toLocaleString() },
              { label: "Total weeks", value: `${Math.floor(totalDays / 7).toLocaleString()}${totalDays % 7 ? ` + ${totalDays % 7}d` : ""}` },
              { label: "Total hours", value: (totalDays * 24).toLocaleString() },
              { label: "Total minutes", value: (totalDays * 24 * 60).toLocaleString() },
            ].map((s2) => (
              <Card key={s2.label}>
                <CardContent className="py-3">
                  <div className="text-xs text-muted-foreground">{s2.label}</div>
                  <div className="font-heading text-lg font-semibold">{s2.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">Pick a start and end date to see the duration.</p>
      )}
    </div>
  );
}
