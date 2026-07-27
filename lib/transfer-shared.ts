// Constants shared by the Send feature's server and browser code.
// (Kept out of transfer-storage.ts so client components can import them without
// pulling in the server-only Supabase admin client.)

export const TRANSFER_BUCKET = "transfers";
// 50 MB matches Supabase's free-tier global upload limit. Raising this requires
// bumping the Supabase project's global file-size limit (paid plan).
export const FREE_MAX_BYTES = 50 * 1024 * 1024;

// Expiry caps by plan (Pro links last longer — a paid perk).
export const MAX_EXPIRY_HOURS = 24; // Free
export const PRO_MAX_EXPIRY_HOURS = 24 * 7; // 7 days

/** Server-side cap for a plan (defends against tampered client requests). */
export function maxExpiryHours(isProPlan: boolean): number {
  return isProPlan ? PRO_MAX_EXPIRY_HOURS : MAX_EXPIRY_HOURS;
}

export const EXPIRY_OPTIONS = [
  { label: "1 hour", hours: 1 },
  { label: "6 hours", hours: 6 },
  { label: "12 hours", hours: 12 },
  { label: "24 hours", hours: 24 },
];

// Extra options unlocked on Pro.
export const EXPIRY_OPTIONS_PRO = [
  { label: "3 days", hours: 24 * 3 },
  { label: "7 days", hours: 24 * 7 },
];
