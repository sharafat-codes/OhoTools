// Constants shared by the Send feature's server and browser code.
// (Kept out of transfer-storage.ts so client components can import them without
// pulling in the server-only Supabase admin client.)

export const TRANSFER_BUCKET = "transfers";
export const FREE_MAX_BYTES = 100 * 1024 * 1024; // 100 MB per transfer (free tier)
export const MAX_EXPIRY_HOURS = 24;

export const EXPIRY_OPTIONS = [
  { label: "1 hour", hours: 1 },
  { label: "6 hours", hours: 6 },
  { label: "12 hours", hours: 12 },
  { label: "24 hours", hours: 24 },
];
