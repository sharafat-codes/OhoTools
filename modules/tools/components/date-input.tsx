"use client";

import * as React from "react";

export type DateParts = { day: string; month: string; year: string };

export const emptyDate: DateParts = { day: "", month: "", year: "" };

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const fieldClass =
  "h-9 rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

/** Returns a "YYYY-MM-DD" string, or null if the parts are incomplete/invalid. */
export function partsToISO(p: DateParts): string | null {
  if (!p.day || !p.month || !p.year) return null;
  const y = Number(p.year);
  const m = Number(p.month);
  const d = Number(p.day);
  if (!Number.isInteger(y) || y < 1 || y > 9999) return null;
  const dt = new Date(y, m - 1, d);
  // Rejects impossible dates like Feb 30 (JS would roll them over).
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return null;
  return `${String(y).padStart(4, "0")}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export function todayParts(): DateParts {
  const d = new Date();
  return {
    day: String(d.getDate()),
    month: String(d.getMonth() + 1),
    year: String(d.getFullYear()),
  };
}

/**
 * Day / Month / Year picker — far faster than a native date input for things
 * like birth years (month by name, year typed directly).
 */
export function DateInput({
  value,
  onChange,
  idPrefix,
}: {
  value: DateParts;
  onChange: (p: DateParts) => void;
  idPrefix?: string;
}) {
  return (
    <div className="flex gap-2">
      <select
        aria-label="Day"
        id={idPrefix ? `${idPrefix}-day` : undefined}
        value={value.day}
        onChange={(e) => onChange({ ...value, day: e.target.value })}
        className={`${fieldClass} w-20`}
      >
        <option value="">Day</option>
        {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
      <select
        aria-label="Month"
        value={value.month}
        onChange={(e) => onChange({ ...value, month: e.target.value })}
        className={`${fieldClass} flex-1`}
      >
        <option value="">Month</option>
        {MONTHS.map((name, i) => (
          <option key={name} value={i + 1}>
            {name}
          </option>
        ))}
      </select>
      <input
        type="number"
        inputMode="numeric"
        aria-label="Year"
        placeholder="Year"
        value={value.year}
        onChange={(e) => onChange({ ...value, year: e.target.value })}
        className={`${fieldClass} w-24`}
      />
    </div>
  );
}
