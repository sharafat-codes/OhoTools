"use client";

import * as React from "react";

import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { DateInput, partsToISO, todayParts, emptyDate, type DateParts } from "./date-input";

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

export function AgeCalculator() {
  const [dob, setDob] = React.useState<DateParts>(emptyDate);
  const [asOf, setAsOf] = React.useState<DateParts>(emptyDate);

  // Default the "age at" date to today, client-side (avoids hydration mismatch).
  React.useEffect(() => {
    let ok = true;
    Promise.resolve().then(() => {
      if (ok) setAsOf(todayParts());
    });
    return () => {
      ok = false;
    };
  }, []);

  const fromISO = partsToISO(dob);
  const toISO = partsToISO(asOf);
  const from = fromISO ? new Date(fromISO + "T00:00:00") : null;
  const to = toISO ? new Date(toISO + "T00:00:00") : null;
  const valid = from && to && to >= from;

  const ymd = valid ? diffYMD(from!, to!) : null;
  const totalDays = valid ? Math.floor((to!.getTime() - from!.getTime()) / 86400000) : 0;

  let nextBirthday: number | null = null;
  if (valid) {
    const nb = new Date(to!.getFullYear(), from!.getMonth(), from!.getDate());
    if (nb < to!) nb.setFullYear(nb.getFullYear() + 1);
    nextBirthday = Math.ceil((nb.getTime() - to!.getTime()) / 86400000);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="dob-day">Date of birth</Label>
          <DateInput value={dob} onChange={setDob} idPrefix="dob" />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="asof-day">Age at date</Label>
            <button
              type="button"
              className="text-xs text-primary hover:underline"
              onClick={() => setAsOf(todayParts())}
            >
              Today
            </button>
          </div>
          <DateInput value={asOf} onChange={setAsOf} idPrefix="asof" />
        </div>
      </div>

      {ymd ? (
        <>
          <Card>
            <CardContent className="py-5 text-center">
              <div className="font-heading text-3xl font-semibold">
                {ymd.years} <span className="text-lg font-normal text-muted-foreground">years</span> {ymd.months}{" "}
                <span className="text-lg font-normal text-muted-foreground">months</span> {ymd.days}{" "}
                <span className="text-lg font-normal text-muted-foreground">days</span>
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Total months", value: (ymd.years * 12 + ymd.months).toLocaleString() },
              { label: "Total weeks", value: Math.floor(totalDays / 7).toLocaleString() },
              { label: "Total days", value: totalDays.toLocaleString() },
              {
                label: "Next birthday",
                value: nextBirthday === 0 ? "Today! 🎉" : `${nextBirthday} days`,
              },
            ].map((s) => (
              <Card key={s.label}>
                <CardContent className="py-3">
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                  <div className="font-heading text-lg font-semibold">{s.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">
          {from && to && !valid
            ? "The birth date must be on or before the second date."
            : "Enter your date of birth to calculate your age."}
        </p>
      )}
    </div>
  );
}
